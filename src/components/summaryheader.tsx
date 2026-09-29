// Header items showing when and where you bought stuff
import { scanContext } from "@/context/receiptContext";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function SummaryHeader() {
	const { scanHeader } = useContext(scanContext);
	if (!scanHeader) {
		return null;
	}
	return (
		<View
			style={{
				height: "20%",
				width: "100%",
				flex: 1,
				flexDirection: "column",
				justifyContent: "flex-start",
				alignItems: "flex-start",
			}}
		>
			<Text style={{ color: "black", fontSize: 20 }}> {scanHeader?.date} </Text>
			<Text style={{ color: "black", fontSize: 15 }}>
				{" "}
				{scanHeader?.location}{" "}
			</Text>
		</View>
	);
}
