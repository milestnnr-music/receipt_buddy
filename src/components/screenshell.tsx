import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default function ScreenShell({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>{children}</SafeAreaView>
		</SafeAreaProvider>
	);
}
