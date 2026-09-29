package expo.modules.itemtagging

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ItemTaggingModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ItemTagging")

    AsyncFunction("analyzeText") { input: String? ->
      // Address detection via NSDataDetector equivalent is iOS-only for now.
      null
    }
  }
}
