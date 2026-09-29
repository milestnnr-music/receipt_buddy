// TypeScript "interfaces" - canonical data 'shapes' objects need to take
import type { Dispatch, SetStateAction } from "react";

export interface ReceiptLineItem {
	id: number;
	text: string;
	price: number;
}

export interface ReceiptHeaderItem {
	date: string;
	location: string;
	total: number;
}

export type ReceiptScanResult = {
	header: ReceiptHeaderItem | null;
	items: ReceiptLineItem[];
};

export interface scanContextType {
	hasScanned: boolean;
	setHasScanned: Dispatch<SetStateAction<boolean>>;
	scanHeader: ReceiptHeaderItem | null;
	setScanHeader: Dispatch<SetStateAction<ReceiptHeaderItem | null>>;
	scanItems: ReceiptLineItem[];
	setScanItems: Dispatch<SetStateAction<ReceiptLineItem[]>>;
}
