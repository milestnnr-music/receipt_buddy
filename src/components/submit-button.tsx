// A custom button that specifcally calls the takeScan function in the scan script
import { scanContext } from "@/context/receiptContext";
import { takeScan } from "@/scripts/scan";
import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SubmitButton() {
	const { setHasScanned, setScanHeader, setScanItems } =
		useContext(scanContext);

	async function handlePress() {
		const scanResult = await takeScan();
		if (scanResult) {
			setScanHeader(scanResult.header ?? { date: "", location: "", total: 0 });
			setScanItems(scanResult.items ?? []);
			setHasScanned(true);
		}
	}

	return (
		<View>
			<Pressable
				onPress={handlePress}
				style={({ pressed }) => [
					styles.buttonBase,
					// Dynamic styles for visual feedback on press (the "button feel")
					{
						opacity: pressed ? 0.8 : 1, // Dim slightly when pressed
						transform: [{ scale: pressed ? 0.98 : 1 }], // Scale down slightly when pressed
					},
				]}
			>
				<Text style={styles.buttonText}>Submit</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonBase: {
		paddingVertical: 15,
		paddingHorizontal: 10,
		width: 150,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",

		backgroundColor: "#007AFF",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	buttonText: {
		// Ensure the text inside is clear and consistent
		fontSize: 16,
		color: "#FFFFFF", // White text on the blue background
		fontWeight: "bold",
		textAlign: "center",
	},
});
