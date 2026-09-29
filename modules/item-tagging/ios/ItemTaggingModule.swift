// Disclosures: I wrote some parts of this, then handing off the task of 
// improving it to Cursor Composer as understanding Apple's API's here was quite tricky.
// I found lots of documentation on the existence of the functions/methods but I had to see some examples first.

import ExpoModulesCore
import Foundation

public class ItemTaggingModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ItemTagging")

    // Interface with the NLDataDetector API
    AsyncFunction("analyzeText") { (input: String?) -> [String: String]? in
      let raw = input
      let text = raw.trimmingCharacters(in: .whitespacesAndNewlines)
      return ItemTaggingAddressDetector.detectFirstAddress(in: text)
    }
  }
}

private enum ItemTaggingAddressDetector {
  static func detectFirstAddress(in text: String) -> [String: String]? {
    // If we have text - make a detector object looking for addresses
    guard !text.isEmpty,
      let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.address.rawValue)
    else {
      return nil
    }
    // Find the first match across the whole range
    let range = NSRange(text.startIndex..., in: text)
    guard let match = detector.firstMatch(in: text, options: [], range: range),
      match.resultType == .address,
      let matchRange = Range(match.range, in: text)
    else {
      return nil
    }

    // Return the whole match text just in case, then the components
    var result: [String: String] = [
      "matchedText": String(text[matchRange]),
    ]

    if let components = match.addressComponents {
      if let street = components[.street] {
        result["street"] = street
      }
      if let city = components[.city] {
        result["city"] = city
      }
      if let state = components[.state] {
        result["state"] = state
      }
      if let zip = components[.zip] {
        result["zip"] = zip
      }
    }

    return result
  }
}
