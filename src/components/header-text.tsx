import { Text, TextStyle } from "react-native";

// Define a base styling irrespective of page
const baseStyles = {
	textAlign: "center",
	fontWeight: 800,
	marginTop: "auto",
	fontSize: 30,
};

// I ran into some issues here - with typing
// Styles are just "objects" and here I use ... to mean all parts of an object
export default function HeaderText(header: { header: string }) {
	const finalStyle: TextStyle = {
		...baseStyles,
	} as TextStyle;
	return <Text style={finalStyle}>{header.header}</Text>;
}
