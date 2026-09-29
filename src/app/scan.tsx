import HeaderText from "@/components/header-text";
import ScreenShell from "@/components/screenshell";
import SubmitButton from "@/components/submit-button";
import { scanContext } from "@/context/receiptContext";
import { testImageScan } from "@/scripts/scan";
import { useContext } from "react";
import { Button, View } from "react-native";

export default function Scan() {
	const { setScanHeader, setScanItems, setHasScanned } = useContext(scanContext);

	async function handleTestPress() {
		const scanResult = await testImageScan();
		if (scanResult) {
			setScanHeader(scanResult.header);
			setScanItems(scanResult.items);
			setHasScanned(true);
		}
	}

	return (
		<ScreenShell>
			<View style={{ flex: 1 }} />
			<View style={{ flex: 1, alignContent: "center" }}>
				<HeaderText header={"Scan a receipt."} />
			</View>
			<View style={{ flex: 3, top: 50, alignItems: "center" }}>
				<SubmitButton />
				<Button title="Test." onPress={handleTestPress} />
			</View>
		</ScreenShell>
	);
}
