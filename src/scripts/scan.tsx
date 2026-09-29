// The main scanning script logic.
// Call the Google ML Kit TextRecognition API, get just the "lines" read in rather than full blocks
// Separate them out, and get the items, their associated prices - and separately information about the receipt

import {
	ReceiptHeaderItem,
	ReceiptLineItem,
	ReceiptScanResult,
} from "@/types/receipt_types";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import ItemTaggingModule from "item-tagging";
import DocumentScanner from "react-native-document-scanner-plugin";

// An array of regexes to match the summary labels, and avoid adding them
const SUMMARY_LABEL_RES: RegExp[] = [
	/^\s*net\s+sales\b/i,
	/^\s*sub\s*total\b/i,
	/^\s*subtotal\b/i,
	/^\s*(?:sales\s+)?tax\b/i,
	/^\s*tax\s+total\b/i,
	/^\s*discounts?\b/i,
	/^\s*savings\b/i,
	/^\s*coupon\b/i,
	/^\s*change\b/i,
	/^\s*balance\s+due\b/i,
	/^\s*amount\s+due\b/i,
];

// Have a simple regex just to find the $ sign
const price_re = new RegExp("^[$]");

// A more fine tuned regex, matching group [0] includes other non-price text, group [1] includes the price value
const PRICE_VALUE_RE = /^\$\s*([\d,]+(?:\.\d{1,2})?)/;

// Items will start with one or more capital letters
const item_re = new RegExp("^\s*[A-Z]+");

// Totals will have the word total
const total_re = /^\s*(?:grand\s+)?total\b(?!s\b)/i; // "grand" is optional, "total" is required, "s" is optional

// Dates will have ##/##/#### formatting
const date_re = new RegExp("[0-9]{1,2}[/][0-9]{1,2}[/][0-9]{4}");

// If dates are spelled out - we should get that, only after the first regex fails
// They might be written out with month names
const date_spelledout_re: RegExp[] = [
	/^\s*january.+\b/i,
	/^\s*february.+\b/i,
	/^\s*march.+\b/i,
	/^\s*april.+\b/i,
	/^\s*june.+\b/i,
	/^\s*july.+\b/i,
	/^\s*august.+\b/i,
	/^\s*october.+\b/i,
	/^\s*september.+\b/i,
	/^\s*november.+\b/i,
	/^\s*december.+\b/i,
];

// Special data types for the receipt items
interface OCRTextItem {
	text: string;
	pointX: number;
	pointY: number;
	center: number;
	height: number;
}

interface OCRTextPair {
	price: OCRTextItem;
	item: OCRTextItem;
}

// This function should just open the scanner - and get a URI
export const takeScan = async () => {
	const { scannedImages, status } = await DocumentScanner.scanDocument({
		maxNumDocuments: 1,
		croppedImageQuality: 0.8,
	});
	if (status === "success" && scannedImages && scannedImages.length > 0) {
		const uri = scannedImages[0];
		const scanResult = await ImageOCR(uri);
		return scanResult;
	}
};

export const ImageOCR = async (uri: string) => {
	try {
		// Asks TextRecognition to find text
		if (uri) {
			const result = await TextRecognition.recognize(uri);
			const totalItems = getReceiptItems(result);
			const receiptStartIndex = getReceiptStartIndex(totalItems);
			const receiptEndIndex = getReceiptEndIndex(totalItems);
			const receiptBodyItems = totalItems.slice(
				receiptStartIndex,
				receiptEndIndex,
			);
			const receiptHeaderItems = totalItems.slice(0, receiptStartIndex);
			const receiptHeader = parseReceiptHeader(totalItems);
			const receiptAddress = await parseReceiptAddress(receiptHeaderItems);
			const receiptItems = parseReceiptItems(receiptBodyItems);
			const scanResult: ReceiptScanResult = {
				header: { ...receiptHeader, location: receiptAddress },
				items: receiptItems,
			};
			console.log(`Scan Result: ${JSON.stringify(scanResult, null, 2)}`);
			return scanResult;
		}
	} catch (error) {
		console.error("OCR Test Failed:", error);
	}
};

// Gets an array of items from the OCR result
export const getReceiptItems = (result: any) => {
	let items: OCRTextItem[] = [];
	for (const block of result.blocks) {
		for (const line of block.lines) {
			// If we are reading a price, normalize the text
			if (price_re.test(line.text)) {
				line.text = normalizeText(line.text);
			}
			items.push({
				text: line.text,
				pointX: line.frame.top,
				pointY: line.frame.left,
				center: line.frame.top + line.frame.height / 2,
				height: line.frame.height,
			});
		}
	}
	// Sort by points, ascending
	// This places associated items next to each other in the array
	items.sort((a, b) => a.pointX - b.pointX);
	return items;
};

// Demarcate the body of the receipt from the header, by getting index of the first item that has a price
export const getReceiptStartIndex = (items: OCRTextItem[]) => {
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (price_re.test(item.text)) {
			return i;
		}
	}
	return items.length;
};

// Demarcate the end of the receipt from the body, by getting index of the first item that has the word total
export const getReceiptEndIndex = (items: OCRTextItem[]) => {
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (total_re.test(item.text)) {
			return i;
		}
	}
	return items.length;
};

export const parseReceiptItems = (items: OCRTextItem[]) => {
	// Create an items array, append an object containing each scanned line
	// The image has been reoriented so
	//  "top" is actually corresponding to x-coords, "left" is y-coords from the top right

	let pairs: OCRTextPair[] = [];

	// Look at all of the items we got back
	for (const item of items) {
		// Check if it's a price
		if (price_re.test(item.text)) {
			// Make a new "pair" object, and store the price of the item
			// Now search through the items, for the nearest x value
			const bounding_top = item.pointX;
			const bounding_bot = item.pointX + item.height;
			let closest_item: OCRTextItem | null = null;
			// Find the item whose center line passes through the bounding
			for (const item of items) {
				// Ignore non "items" which don't start with capitals
				if (!item_re.test(item.text)) {
					continue;
				}
				// If the items center line passes throught the middle of the bounding box, it's likely associated
				if (item.center > bounding_top && item.center < bounding_bot) {
					closest_item = item;
				}
			}
			// If we found a closest item, and it's not a summary label, add the pair
			if (closest_item !== null && !isSummaryLabel(closest_item.text)) {
				pairs.push({
					price: item,
					item: closest_item,
				});
			}
		}
	}

	// Instead of returning pairs immediately, parse them into ReceiptLineItem objects
	let receiptItems: ReceiptLineItem[] = [];
	for (const pair of pairs) {
		receiptItems.push({
			text: pair.item.text,
			price: parsePriceValue(pair.price.text) ?? 0,
			id: receiptItems.length + 1,
		});
	}
	return receiptItems;
};

// Searches through receipt items and pulls out date, location and total of receipt
export const parseReceiptHeader = (items: OCRTextItem[]) => {
	let date: string | null = null;
	let total: number | null = null;
	for (const item of items) {
		if (date === null && date_re.test(item.text)) {
			date = item.text.match(date_re)?.[0] ?? null;
		}
		// Search back through and find the associated price item.
		if (total === null && total_re.test(item.text)) {
			const bounding_top = item.pointX;
			const bounding_bot = item.pointX + item.height;
			for (const item of items) {
				if (price_re.test(item.text)) {
					if (item.center > bounding_top && item.center < bounding_bot) {
						total = parsePriceValue(item.text) ?? null;
						break;
					}
				}
			}
		}
	}
	// If the data is still null - there was no date explicitly written using the mm/dd/yyyy format, check the other regex
	// Could be another moment to use ML Kit or NSDataDetector!
	if (date === null) {
		let possible_date;
		for (const item of items) {
			possible_date = SpelledDate(item.text);
			if (possible_date) {
				date = possible_date;
			}
		}
	}
	const header: ReceiptHeaderItem = {
		date: date ?? "",
		total: total ?? 0,
		location: "",
	};
	return header;
};

const parseReceiptAddress = async (items: OCRTextItem[]) => {
	const address = await ItemTaggingModule.analyzeText(
		items.map((item) => item.text).join(" "),
	);
	// If we get an address, assemble it into a string - if nothing was detected for the field, leave it blank
	if (address) {
		console.log(`Address: ${JSON.stringify(address, null, 2)}`);
		return (
			(address.street || "") +
			" " +
			(address.city || "") +
			" " +
			(address.state || "") +
			" " +
			(address.zip || "")
		);
	}
	return "";
};

// Parses the price value from the text
export const parsePriceValue = (text: string) => {
	const match = normalizeText(text).match(PRICE_VALUE_RE);
	if (match) {
		return Number(match[1]);
	}
	return null;
};

// Checks if the text is a summary label
export function isSummaryLabel(text: string) {
	const label = normalizeLabelText(text);
	return SUMMARY_LABEL_RES.some((re) => re.test(label));
}

/** Collapse whitespace and strip trailing punctuation — for summary label regexes */
export function normalizeLabelText(text: string) {
	return text
		.trim()
		.replace(/\s+/g, " ")
		.replace(/[.,:;]+$/g, "");
}

// Normalizes price OCR text by removing all spaces (e.g. "$6  .99" → "$6.99")
export function normalizeText(text: string) {
	return text.trim().replace(/\s+/g, "");
}

// Quickly searches all regexes for all the data passed in. (The header)
export function SpelledDate(text: string) {
	let dateMatches = [];
	for (const re of date_spelledout_re) {
		let match;
		while ((match = re.exec(text)) !== null) {
			dateMatches.push(match[0]);
			return dateMatches[0];
		}
	}
	return null;
}
