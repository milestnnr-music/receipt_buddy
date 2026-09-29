import { NativeModule, registerWebModule } from 'expo';

import { DetectedAddress, ItemTaggingModuleEvents } from './ItemTagging.types';

class ItemTaggingModule extends NativeModule<ItemTaggingModuleEvents> {
  async analyzeText(_input?: string | null): Promise<DetectedAddress | null> {
    console.warn('[ItemTagging] analyzeText is only available on iOS native builds');
    return null;
  }
}

export default registerWebModule(ItemTaggingModule, 'ItemTaggingModule');
