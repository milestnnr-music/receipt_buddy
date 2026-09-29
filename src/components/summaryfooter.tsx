// Display the total (and anything else that isn't items or metadata)
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
		<View
			style={{
				backgroundColor: "white",
				height: "15%",
				width: "100%",
				borderRadius: 5,
			}}
		>
			<SummaryItem text="TOTAL" price={scanHeader.total}></SummaryItem>
		</View>
	);
}
