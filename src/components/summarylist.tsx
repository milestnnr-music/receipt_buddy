import SummaryItem from "@/components/summaryitem";
import { scanContext } from "@/context/receiptContext";
import { useContext } from "react";
import { FlatList, View } from "react-native";



// Display items in a FlatList - each line in data will be an item
// from the receipt - which gets passed in and made into
export default function SummaryList() {
	const { scanItems } = useContext(scanContext);
	if (!scanItems) {
		return null;
	}
	return (
		<View>
			<FlatList
				style={{
					backgroundColor: "lightgray",
					height: "65%",
					width: "100%",
				}}
				data={scanItems}
				renderItem={({ item, index }) => <SummaryItem key={index} {...item} />}
				horizontal={false}
			></FlatList>
		</View>
	);
}
