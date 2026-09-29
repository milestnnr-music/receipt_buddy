import { NativeModule, requireNativeModule } from 'expo';

import { DetectedAddress, ItemTaggingModuleEvents } from './ItemTagging.types';

declare class ItemTaggingModule extends NativeModule<ItemTaggingModuleEvents> {
  analyzeText(input?: string | null): Promise<DetectedAddress | null>;
}

export default requireNativeModule<ItemTaggingModule>('ItemTagging');
