import HeaderText from "@/components/header-text";
import ScreenShell from "@/components/screenshell";
import SubmitButton from "@/components/submit-button";
import { scanContext } from "@/context/receiptContext";
import { useContext } from "react";
import { View } from "react-native";

export default function Scan() {
	const { setScanHeader, setScanItems, setHasScanned } = useContext(scanContext);

	return (
		<ScreenShell>
			<View style={{ flex: 1 }} />
			<View style={{ flex: 1, alignContent: "center" }}>
				<HeaderText header={"Scan a receipt."} />
			</View>
			<View style={{ flex: 3, top: 50, alignItems: "center" }}>
				<SubmitButton />
			</View>
		</ScreenShell>
	);
}
