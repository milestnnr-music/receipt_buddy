// Define strict data types
export type DetectedAddress = {
	matchedText: string;
	street?: string;
	city?: string;
	state?: string;
	zip?: string;
};

export type ItemTaggingModuleEvents = Record<string, never>;
