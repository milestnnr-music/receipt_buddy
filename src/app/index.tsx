// index.tsx is the default page - reroute us to scan
import { Redirect } from "expo-router";
export default function Index() {
	return <Redirect href="/scan" />;
}
