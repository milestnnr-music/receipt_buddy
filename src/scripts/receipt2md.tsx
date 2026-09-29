// TODO: The markdown file should be handed to the sharesheet for sharing
import { ReceiptScanResult } from "@/types/receipt_types";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";


export const Receipt2Md = async (result: ReceiptScanResult): Promise<void> => {
	const filename = getFilename(result);
	let md = "";
	md += `# Receipt - ${result.header?.date}\n`;
	md += `Store Location: ${result.header?.location}\n`;
	md += `Total: ${result.header?.total}\n\n`;
	md += `| Item | Price |\n`;
	md += `| --- | --- |\n`;
	for (const item of result.items ?? []) {
		md += `| ${item.text} | ${item.price} |\n`;
	}
	await saveFile(filename, md);
}

// Give the markdown file a useful filename, sanitizing the date for filesystem compatibility
const getFilename = (result: ReceiptScanResult): string => {
	const safeDate = (result.header?.date ?? "unknown-date").replace(/\//g, "-");
return `receipt-${safeDate}.md`;
}

// Save the file to the cache directory, so it can be shared/saved to the user's preference
const saveFile = async (filename: string, content: string) => {
    const file =  new File(Paths.cache, filename);
    file.create({ overwrite: true });
    file.write(content);
    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
    }
}