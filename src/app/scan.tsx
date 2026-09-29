import HeaderText from "@/components/header-text";
import ScreenShell from "@/components/screenshell";
import SubmitButton from "@/components/submit-button";
import { View } from "react-native";

export default function Scan() {
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
