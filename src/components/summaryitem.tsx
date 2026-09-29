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
			}}
		>
			<View
				style={{ width: "50%", borderBottomWidth: 1, borderColor: "lightgray" }}
			>
				<Text style={{ color: "black", fontSize: 20 }}>{item.text}</Text>
			</View>
			<View
				style={{
					width: "50%",
					borderBottomWidth: 1,
					borderColor: "lightgray",
					alignItems: "center",
				}}
			>
				<Text style={{ color: "black", fontSize: 20 }}>{item.price}</Text>
			</View>
		</View>
	);
}
