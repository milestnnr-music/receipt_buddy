// Nest the entire app within a "Native Tabs" component for navigation, and give it the app wide context "Scan Provider"
import ScanProvider from "@/context/receiptContext";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
	return (
		<ScanProvider>
			<NativeTabs>
				<NativeTabs.Trigger name="scan">
					<NativeTabs.Trigger.Label>Scan</NativeTabs.Trigger.Label>
					<NativeTabs.Trigger.Icon sf="printer" />
				</NativeTabs.Trigger>
				<NativeTabs.Trigger name="summary">
					<NativeTabs.Trigger.Label>Summary</NativeTabs.Trigger.Label>
					<NativeTabs.Trigger.Icon sf="paperclip" />
				</NativeTabs.Trigger>
			</NativeTabs>
		</ScanProvider>
	);
}
