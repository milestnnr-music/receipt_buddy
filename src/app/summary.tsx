// Render either a summary of the receipt, with the info captured - or nothing if no scan exists.
import HeaderText from "@/components/header-text";
import ScreenShell from "@/components/screenshell";
import SummaryBox from "@/components/summarybox";
import { scanContext } from "@/context/receiptContext";
import { Receipt2Md } from "@/scripts/receipt2md";
import { useContext } from "react";
import { Button, View } from "react-native";

export default function Summary() {
	const { hasScanned, scanItems, scanHeader } = useContext(scanContext);

	async function handleShareReceipt() {
		if (scanHeader && scanItems.length > 0) {
			await Receipt2Md({ header: scanHeader, items: scanItems });
		}
	}

	return (
		<ScreenShell>
			<View style={{ flex: 1, bottom: 50 }}>
				<HeaderText header={hasScanned ? "Receipt Summary" : "No scan yet!"} />
				{hasScanned && (
					<Button title="Save Receipt Scan" onPress={handleShareReceipt} />
				)}
			</View>
			<View style={{ flex: 3, alignItems: "center", bottom: 10 }}>
				{hasScanned && <SummaryBox />}
			</View>
		</ScreenShell>
	);
}
