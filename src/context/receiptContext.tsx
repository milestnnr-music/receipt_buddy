// Implements the "useContext" hook in React - a shared state that can be shared deeply,
// throughtout the app rather than a parent component
// And the "useState" hook creating a "getter" and "setter" function for those shared states

import {
	ReceiptHeaderItem,
	ReceiptLineItem,
	scanContextType,
} from "@/types/receipt_types";
import { createContext, ReactNode, useState } from "react";

// Make the contexts
export const scanContext = createContext<scanContextType>({
	hasScanned: false,
	setHasScanned: () => {},
	scanItems: [],
	setScanItems: () => {},
	scanHeader: null,
	setScanHeader: () => {},
});

// Makes a "wrappper" around everything that gives it context, and a useState hook so it can be updated
// Make sure { children } is in the arguments and rendered inside the tags, allows other items to be nested like HTML
export default function ScanProvider({ children }: { children: ReactNode }) {
	const [hasScanned, setHasScanned] = useState(false);
	const [scanItems, setScanItems] = useState<ReceiptLineItem[]>([]);
	const [scanHeader, setScanHeader] = useState<ReceiptHeaderItem | null>(null);
	return (
		<scanContext.Provider
			value={{
				hasScanned,
				setHasScanned,
				scanItems,
				setScanItems,
				scanHeader,
				setScanHeader,
			}}
		>
			{children}
		</scanContext.Provider>
	);
}
