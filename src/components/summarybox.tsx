// High level component to organize everything in the summary.
import SummaryHeader from "@/components/summaryheader";
import SummaryList from "@/components/summarylist";
import { View } from "react-native";
import SummaryFooter from "./summaryfooter";

export default function SummaryBox() {
	return (
		<View
			style={{
				height: "100%",
				width: "90%",
			}}
		>
			{/* <Text style={{ color: "white" }}> SummaryBox </Text> */}
			<SummaryHeader />
			<SummaryList />
			<SummaryFooter />
		</View>
	);
}
