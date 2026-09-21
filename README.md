# PlayPicker

A mobile-first way for families to discover screen-free DIY activities through visual browsing and practical filters.

## Run locally

Open `http://localhost/playpicker/` with MAMP running (this MAMP installation uses port 80). No build or installation is required. Alternatively, run `python3 -m http.server 8080` in this directory and open `http://localhost:8080`.

## MVP

- Nine illustrated activities with materials, steps, and grown-up notes.
- Search titles, descriptions, categories, and materials.
- Combine category, age, duration, setting, and mess-level filters.
- Save a collection in browser localStorage, without an account.
- Swipe left to pass and right to save, with button and keyboard alternatives.
- Undo the last swipe, and revisit passed activities when you reach the end.
- Installable web app manifest, home-screen icons, and offline app shell.
- Responsive layouts, keyboard-accessible controls, and native modal dialogs.

`activities.js` holds the curated activity data. `app.js` handles the swipe deck, dialogs, and saved activities. `illustrations.js` holds the decorative SVG artwork. `styles.css` contains the responsive design. Google Fonts is optional; system sans-serif fallbacks are provided. No external image service or JavaScript dependency is required.

Collections belong to the current browser and do not sync between devices. This MVP has no backend, account system, or analytics. Activity age ranges are suggestions; grown-ups should adapt activities and supervise as appropriate.

Work branch: `dev`.

## Install on a phone

Publish this folder to an HTTPS static host to make it available away from your Mac. Asset paths work both at a domain root and under `/playpicker/`.

- **iPhone:** Open the HTTPS URL in Safari → Share → Add to Home Screen → keep Open as Web App enabled if shown → Add.
- **Android:** Open the HTTPS URL in Chrome → menu → Add to Home screen / Install app.

The page footer also includes installation instructions. Supporting browsers offer a native install button when available.

For a local preview only, connect the phone to the same Wi-Fi as the Mac and open `http://YOUR_MAC_LAN_IP/playpicker/` while MAMP is running. `localhost` on the phone refers to the phone, not your Mac. An HTTP LAN preview does not provide service-worker offline support or full PWA installation eligibility; use HTTPS for installation. No deployment is performed by this project.

After one successful online load on HTTPS (or localhost on the development machine), the service worker caches the application and activity data for offline use. Optional Google Fonts require a connection; system fonts work offline. Saved activities are local to the current browser or installed app and do not sync. Passed cards and undo history reset when the page reloads.

## Languages

Use the ES / EN button in the header to switch between English and Spanish. The preference is remembered in localStorage; English is the default. All activity content, interface labels, instructions, and installation help are translated. Search is accent-insensitive in the selected language. Switching languages preserves saved activities, current filters, and swipe history. `i18n.js` contains the Spanish interface dictionary and activity translations and is included in the offline cache.

## Development quality checks

The app still runs without a build step or production dependencies. Development tools are pinned in `package-lock.json`:

```sh
npm ci
npx playwright install chromium
npm run format
npm run check
npm test
```

Tests run a temporary local server and isolated browser profiles. If needed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an existing Chromium executable. Generated screenshots are written to the ignored `test-results/` directory.

Follow [AGENTS.md](AGENTS.md) for coding, internationalization, and WCAG 2.2 AA requirements. [ACCESSIBILITY.md](ACCESSIBILITY.md) records implemented improvements, automated verification, and the manual checks still needed before a conformance claim.
