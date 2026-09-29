# Receipt Buddy

**Video:** Paste the URL of your demo here before you submit. CS50x requires a YouTube video of 3 minutes or less. An unlisted video is fine. The URL has to be in this file.

Receipt Buddy is a phone app that turns a photo of a grocery receipt into a structured list. You scan a receipt, the app reads the text on the page, and it separates that text into a date, a store address, a total, and individual items with prices. The Summary tab shows that result. From there you can save it as a Markdown file and hand it to the phone’s share sheet.

The app is built with React Native and Expo. Navigation uses Expo Router. Scanning uses a document scanner that crops the page. Text recognition runs on the device with ML Kit, so the receipt text is not sent to a server. A small local Expo module, `item-tagging`, finds a street address in the header text.

## How to run

This app uses native code (the document scanner, ML Kit, and `item-tagging`). It does not run in Expo Go. You need Node.js, npm, and a development build.

```bash
npm install
npx expo run:ios
```

On Android, use `npx expo run:android`. Those commands install dependencies, generate the native `ios/` or `android/` project from `app.json`, and launch the app. The generated native folders are not in this repository. Expo recreates them from `app.json` and the local module under `modules/item-tagging/`.

On the Scan tab, **Submit** opens the camera and scans one page. **Test.** runs the same parser against `assets/testscan.jpg`. That image is not in this repository, so the Test button will fail until you add it. After a successful scan, open the Summary tab. **Save Receipt Scan** writes a Markdown table and opens the share sheet.

## What each part does

`src/app/_layout.tsx` is the root layout. It wraps the app in `ScanProvider` and shows two tabs, Scan and Summary.

`src/app/index.tsx` immediately redirects to the Scan tab.

`src/app/scan.tsx` is the scan screen. Submit calls `takeScan`. The Test button calls `testImageScan`. Either path stores the header and line items in shared state.

`src/app/summary.tsx` reads that shared state. Before a scan it says “No scan yet!”. After a scan it shows the summary and the save button, which calls `Receipt2Md`.

`src/context/receiptContext.tsx` holds `hasScanned`, the header, and the line items. Both tabs read and write the same state, so there is no backend and no route parameters for the receipt.

`src/types/receipt_types.tsx` defines `ReceiptHeaderItem` (date, location, total), `ReceiptLineItem` (id, text, price), and the context value type.

`src/scripts/scan.tsx` is the parser.

- `takeScan` opens the document scanner and passes the cropped image to OCR.
- `ImageOCR` asks ML Kit for text blocks, then splits the page into a header and a body. The body starts at the first price and ends at the first line that looks like a total.
- Prices and item names are paired by vertical position. A price is matched to the capitalized line whose center falls inside that price’s vertical span. Lines such as tax, subtotal, discount, and change are dropped so they are not treated as products.
- The header parser looks for a `MM/DD/YYYY` date and for the price on the same row as “total”.
- The address is not parsed with a regular expression. Header lines are joined and passed to `ItemTaggingModule.analyzeText`.

`src/scripts/receipt2md.tsx` formats the header and items as a Markdown table, writes `receipt-<date>.md` into the cache directory, and opens the share sheet.

`src/components/submit-button.tsx` is the scan button. `screenshell.tsx` applies a safe-area layout. `header-text.tsx` is the screen title. `summarybox.tsx` stacks the summary header, the scrolling item list, and the total footer. `summarylist.tsx` renders one row per line item. `summaryitem.tsx` is a single name-and-price row. `summaryheader.tsx` shows the date and location. `summaryfooter.tsx` shows the total.

`modules/item-tagging/` is a local Expo module, wired in through `package.json` as `"item-tagging": "file:./modules/item-tagging"`. On iOS, `ItemTaggingModule.swift` uses `NSDataDetector` to find the first street address and returns street, city, state, and ZIP. On Android, `analyzeText` currently returns null, so location detection is iOS-only. The TypeScript entry point is `modules/item-tagging/src/index.ts`.

`app.json` is the Expo config: app name, icons, the `receiptbuddy` URL scheme, camera and photo permission strings, and the config plugins for the document scanner, image picker, file sharing, and splash screen. `package.json` and `package-lock.json` pin the dependency versions. `tsconfig.json` maps `@/` to `src/`. `eslint.config.js` uses the Expo ESLint config.

## Design choices

Receipt data stays in React context instead of a database. A scan is one short-lived result that both tabs need at the same time, and nothing in the app has to survive a restart.

Item rows are paired by position on the page rather than by assuming the name and the price are already one OCR line. Grocery receipts often put the description and the price in different columns, and ML Kit returns them as separate lines. Matching a price to the text that sits on the same horizontal band survives that layout. Summary rows (tax, subtotal, coupons, change) use a separate list of regular expressions so those amounts are not added as products. The grand total is still kept, but only on the header.

Address detection lives in a native module because iOS already has a detector for postal addresses. A hand-written pattern for every store header would be easier to get wrong. Android does not use that detector yet, which is why `analyzeText` returns null there.

`ios/` and `android/` are left out of the repository. They are generated by `npx expo run:ios` and `npx expo run:android`, and the iOS tree on a development machine includes CocoaPods, which is hundreds of megabytes. The source that is actually written for this project is `src/` plus `modules/item-tagging/`.

## What is not in this repository

`.gitignore` omits `node_modules/`, `.expo/`, local env files, editor config, and the generated `/ios` and `/android` folders. Install dependencies with `npm install`. Do not force-add those folders. CS50’s `submit50` rejects submissions over 100 MB, and a generated `ios/` folder by itself is far larger than that.

## Submitting to CS50x

From this directory, after the video URL above is filled in:

```bash
submit50 cs50/problems/2026/x/project
```

That uploads the project to the private course repository GitHub creates for your submission (`github.com/me50/<your-username>`, branch `cs50/problems/2026/x/project`). CS50’s academic honesty policy asks you not to publish final-project source code in a public GitHub repository. Share the video, not a public copy of this code.
