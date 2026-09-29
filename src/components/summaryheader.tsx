// Header items showing when and where you bought stuff - and the amount of items!
import { scanContext } from "@/context/receiptContext";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function SummaryHeader() {
	const { scanHeader, scanItems } = useContext(scanContext);
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
				alignContent: "space-evenly",
				alignItems: "flex-start",
				borderColor: "lightgrey",
				backgroundColor: "white",
				borderWidth: 1,
				borderRadius: 5,
				marginBottom: 10,
			}}
		>
			<Text style={{ color: "black", fontSize: 20, textAlign: "left" }}>
				{" "}
				{scanHeader.date ? scanHeader.date : "No date detected."}{" "}
			</Text>
			<Text style={{ color: "black", fontSize: 12, textAlign: "left" }}>
				{" "}
				{scanHeader.location
					? scanHeader.location
					: "No location detected."}{" "}
			</Text>
			<Text>
				{" "}
				{scanItems.length} {scanItems.length > 1 ? "Items" : "Item"}
			</Text>
		</View>
	);
}
