// Each item's containing component
import { Text, View } from "react-native";

export default function SummaryItem(item: { text: string; price: number }) {
	return (
		<View
			style={{
				backgroundColor: "white",
				height: "auto",
				width: "100%",
				flex: 1,
				flexDirection: "row",
				justifyContent: "space-between",
				borderColor: "lightgrey",
				borderWidth: 1,
				borderRadius: 5,
				marginTop: 5,
			}}
		>
			<View style={{ width: "50%" }}>
				<Text style={{ color: "black", fontSize: 20 }}>{item.text}</Text>
			</View>
			<View
				style={{
					width: "50%",
					alignItems: "center",
				}}
			>
				<Text style={{ color: "black", fontSize: 20 }}>{item.price}</Text>
			</View>
		</View>
	);
}
