import { Text, TextStyle } from "react-native";

// Pass the component some text and optional extra styling
interface HeaderTextProps {
  header: string;
  style?: TextStyle;
}

// Define a base styling irrespective of page
const baseStyles = {
  textAlign: "center",
  fontWeight: 800,
  marginTop: "auto",
  fontSize: 30,
};

// I ran into some issues here - with typing
// Styles are just "objects" and here I use ... to mean all parts of an object
// but the "style" parameter/prop is optional, style || {} means either all of the styles I give you or an empty object
export default function HeaderText({ header, style }: HeaderTextProps) {
  const finalStyle: TextStyle = {
    ...baseStyles,
    ...(style || {}),
  } as TextStyle;
  return <Text style={finalStyle}>{header}</Text>;
}
