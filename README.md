# Receipt Buddy

**Video:** Paste the URL of your demo here before you submit. CS50x requires a YouTube video of 3 minutes or less. An unlisted video is fine. The URL has to be in this file.

"Do you want your receipt?"
Such a common question - and I always say yes for "safe keeping".
But where the heck should you keep them?!

Receipt Buddy is a phone app that turns a photo of a grocery receipt into a structured list. You scan a receipt, the app reads the text on the page, and it separates that text into a date, a store address, a total, and individual items with prices. The Summary tab shows that result. From there you can save it as a Markdown file and hand it to the phone’s share sheet. (With a potentially to save and store using SQLite)

The app is built with React Native and Expo. Navigation uses Expo Router. The scanning page uses the iOS document scanner that allows you to scan your receipt. Text recognition runs on the device with ML Kit, so the receipt text is not sent to a server. A small local "native" Expo module, `item-tagging`, finds a street address in the header text - written in Swift.

## How to run

This app uses native code such as iOS document scanner, Google ML Kit, and a custom module to use Apple's Foundation NSDataDetector API I called `item-tagging` (for tagging tricky things like location strings) It does not run in Expo Go, which only runs JavaScript/React. You need Node.js, npm, and a development build.

```bash
npm install
npx expo run:ios
```

On Android, use `npx expo run:android`. Those commands install dependencies, generate the native `ios/` or `android/` project from `app.json`, and launch the app. The generated native folders are not in this repository. Expo recreates them from `app.json` and the local module under `modules/item-tagging/`.

On the Scan tab, **Submit** opens the camera and scans one page. After a successful scan, open the Summary tab. **Save Receipt Scan** writes a Markdown table and opens the share sheet.

## Dependencies

Runtime (`package.json` `dependencies`):

- `@react-native-ml-kit/text-recognition` ^2.0.0
- `expo` ~57.0.24
- `expo-constants` ~57.0.19
- `expo-file-system` ~57.0.7
- `expo-linking` ~57.0.10
- `expo-router` ~57.0.22
- `expo-sharing` ~57.0.22
- `expo-splash-screen` ~57.0.9
- `item-tagging` `file:./modules/item-tagging` (local module)
- `react` 19.2.3
- `react-native` 0.86.3
- `react-native-document-scanner-plugin` ^2.0.4
- `react-native-safe-area-context` ~5.7.0
- `react-native-screens` ~4.26.0

Development (`package.json` `devDependencies`):

- `@react-native/typescript-config` ^0.87.1
- `@types/react` ~19.2.2
- `eslint` ^9.0.0
- `eslint-config-expo` ~57.0.2
- `typescript` ~6.0.3

## What each part does

### App Routes

`src/app/_layout.tsx` is the root layout. It adds Expo Router's Native Tabs, allowing navigation with iOS-styled tabs at the bottom of the screen. It wraps the app in `ScanProvider` and shows two tabs, Scan and Summary.
`src/app/index.tsx` is a landing page - immediately redirects to the Scan tab.
`src/app/scan.tsx` is the scan screen. Submit calls `takeScan`.
`src/app/summary.tsx` reads that shared state. Before a scan it says “No scan yet!”. After a scan it shows a representation of what was scanned of the receipt and the save button, which calls `Receipt2Md`.

### Shared state

`src/context/receiptContext.tsx` holds the React "context" for this app, including state variables for whether the user has scanned a receipt and the items that have been returned from processing. Both tabs read and write the same state, so there is no backend and no route parameters for the receipt. In addition to this global context, useState is called to define "setter" functions for these variables.

### Data Typing

`src/types/receipt_types.tsx` defines `ReceiptHeaderItem` (date, location, total), `ReceiptLineItem` (id, text, price), and the context value type. These are then grouped into a `ReceiptScanResult` which bundles the two lower data types.

### Logic

`src/scripts/scan.tsx` is the parser.

- `takeScan` opens the document scanner and passes the cropped image to OCR.
- `ImageOCR` asks ML Kit for text blocks, then splits the page into a header and a body. The body starts at the first price and ends at the first line that looks like a total.
- Prices and item names are paired by vertical position. A price is matched to the capitalized line whose center falls inside that price’s vertical span. Lines such as tax, subtotal, discount, and change are dropped so they are not treated as products.
- The header parser looks for a `MM/DD/YYYY` date and for the price on the same row as “total”.
- The address is not parsed with a regular expression. Header lines are joined and passed to `ItemTaggingModule.analyzeText`.

`src/scripts/receipt2md.tsx` formats the header and items as a Markdown table, writes `receipt-<date>.md` into the cache directory, and opens the share sheet.

### React Components

From the top down:
`screenshell.tsx` applies a safe-area layout for each page (so information doesn't bleed off the page)
`header-text.tsx` is used for any large, page level screen titles.
`src/components/submit-button.tsx` is the scan button.

Using the general mindset that React motivates - to decompose UI into small elements:
`summarybox.tsx` stacks the summary header, the scrolling item list, and the total footer.
`summarylist.tsx` renders one row per line item.
`summaryitem.tsx` is a single name-and-price row.
`summaryheader.tsx` shows the date and location.
`summaryfooter.tsx` shows the total.

### "Native" code

A small portion of the app is coded directly in Swift, using Apple's APIs harnessing the power of the iOS device itself.
`modules/item-tagging/` is a local Expo module, wired in through `package.json` as `"item-tagging": "file:./modules/item-tagging"`.
On iOS, `ItemTaggingModule.swift` uses `NSDataDetector` to find the first street address and returns street, city, state, and ZIP.
On Android, `analyzeText` currently returns null, so location detection is iOS-only. Google ML Kit has "entity extraction" that works on Android so it could be implemented later.
The entry point from this Swift module to the rest of the app is `modules/item-tagging/src/index.ts`.

`app.json` is the Expo config: app name, icons, the `receiptbuddy` URL scheme, the document-scanner camera permission, and the config plugins for the document scanner, file sharing, and splash screen. `package.json` and `package-lock.json` pin the dependency versions. `tsconfig.json` maps `@/` to `src/`. `eslint.config.js` uses the Expo ESLint config.

## Design choices and AI usage

This was tricky because I wanted to make a useful phone app.. using some tech we had studied in CS50, while learning a new thing.. And crucially have it be actually compiled to your phone, not a web app. (To use it offline, or out of the house and to keep the data yourself!)
This led me to React Native, which I had a bit of exposure to through trying to make some sites using React for the web. This fit the bill, as I'd be using Javascript combined with HTML and CSS - something React calls JSX.. And also using TypeScript's syntax and type checker to make sure that I didn't break any of React's native data types.
It was made a lot easier by using the Expo frameworks, for time's sake.

AI usage was interestingly two fold - I wrote a lot of logic myself, and scoped out the issues. Only asking questions to Gemini outside the IDE for general direction. As I got into trickier elements of the app (like making my own TypeScript data types, connecting a Swift module to the rest of the app..) I then switched to Cursor, specifically it's Ask Mode.
I tried to keep this heuristic in mind..
I should, at a minimum, write the first lines and the last lines.
In the middle, I didn't ask the agent to write but used Ask Mode along with slowly going through, implementing what I thought I needed to, and using the "tab" complete for small helper functions and complex Regex patterns I didn't want to mess up. Ocasionally I ran into bugs which had to do with version histories (like what version was on my testing build vs. what I had written and what I had downloaded) and other corner cases that the "Debug" mode was useful in so far as it always explained what was going wrong.
I found myself in some moments really not understanding - there I took the time to rely on those CS50 skills! Read the docs, check sample usage and common faults. I used "Ask Mode" to help guide me to the right sources - to some amount of success. (Apple's documentation is really not made for beginners.)

---

Ideally, I would have implemented a connection with SQLite to store these receipts as items in a DB - but alas, I wanted to actually finish the project! For next time.

Receipt data stays in React context instead of a database. A scan is one short-lived result that both tabs need at the same time, and nothing in the app has to survive a restart. I figured that merely saving them as a small markdown file for safe keeping was a fine way to start. (I want to start getting rid of paper copies as soon as possible!)

Item rows are paired by position on the page rather than by assuming the name and the price are already one OCR line. Grocery receipts often put the description and the price in different columns, and ML Kit returns them as separate lines. Matching a price to the text that sits on the same horizontal band was done by looking at the "frame" attributes that ML Kit captures, representing the outlines of the text being scanned. By calculating the center of the box, then seeing if that center passed through the vertical coordinates of another box, they could be "paired up" as an item and a price.
This uses a 2D collision approach called 'Center-Line Intersection' or 1D Bounding Box Overlap.

Summary rows (tax, subtotal, coupons, change) use a separate list of regular expressions so those amounts are not added as products. The grand total is still kept, but only on the "header"/metadata.
Later I might display the amount of items scanned as a bit of metadata too.

Address detection lives in a native module because iOS already has a detector for postal addresses. A hand-written pattern for every store header would be easier to get wrong. (Android does not use that detector yet, which is why `analyzeText` returns null there... I used iOS specific tools.)

## Future

Some of the issues I worked on appear in fields like Computational Geometry and Collision Detection - a major topic in web, UI, UX and game design. It's tricky and I built a rather simple implementation, good enough for a short little project like this.. Almost useful.
Dealing with a balance of structured, unstructured data, Natural Language and API responses is a lot of what is done on the cutting edge today. I'm not dealing with a ton of data so I could build a rather simple implementation.. But pulling more information out of it could be good. I see a future version where I could add features like storing data - but also categorizing items, cleaning up unclear API responses, performing calculations on the data across a user's DB of receipts.. Things that more fully featured finance apps do with your bank statements as a whole. (The app would do that just for receipts)
Also: It could definetly be a little prettier.. UI is hard!

## What is not in this repository

`.gitignore` omits `node_modules/`, `.expo/`, local env files, editor config, and the generated `/ios` and `/android` folders. They are generated by `npx expo run:ios` and `npx expo run:android`, and the iOS tree on a development machine includes CocoaPods, which is hundreds of megabytes. The source that is actually written for this project is `src/` plus `modules/item-tagging/`. Install dependencies with `npm install`. Do not force-add those folders. CS50’s `submit50` rejects submissions over 100 MB, and a generated `ios/` folder by itself is far larger than that.

## Submitting to CS50x

From this directory, after the video URL above is filled in:

```bash
submit50 cs50/problems/2026/x/project
```

That uploads the project to the private course repository GitHub creates for your submission (`github.com/me50/<your-username>`, branch `cs50/problems/2026/x/project`). CS50’s academic honesty policy asks you not to publish final-project source code in a public GitHub repository. Share the video, not a public copy of this code.
