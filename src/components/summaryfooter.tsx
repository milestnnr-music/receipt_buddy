import { scanContext } from "@/context/receiptContext";
import { useContext } from "react";
import { View } from "react-native";
import SummaryItem from "./summaryitem";

export default function SummaryFooter() {
	const { scanHeader } = useContext(scanContext);
	if (!scanHeader) {
		return null;
	}
	return (
		<View style={{ backgroundColor: "gray", height: "15%", width: "100%" }}>
			<SummaryItem text="TOTAL" price={scanHeader.total}></SummaryItem>
		</View>
	);
}
