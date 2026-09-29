import ExpoModulesCore
import Foundation

public class ItemTaggingModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ItemTagging")

    let sample_text = """
    492 ST. MARKS AVE\nBROOKLYN, NY 11238
    """

    AsyncFunction("analyzeText") { (input: String?) -> [String: String]? in
      let raw = input ?? sample_text
      let text = raw.trimmingCharacters(in: .whitespacesAndNewlines)
      return ItemTaggingAddressDetector.detectFirstAddress(in: text)
    }
  }
}

private enum ItemTaggingAddressDetector {
  static func detectFirstAddress(in text: String) -> [String: String]? {
    guard !text.isEmpty,
      let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.address.rawValue)
    else {
      return nil
    }

    let range = NSRange(text.startIndex..., in: text)
    guard let match = detector.firstMatch(in: text, options: [], range: range),
      match.resultType == .address,
      let matchRange = Range(match.range, in: text)
    else {
      return nil
    }

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
