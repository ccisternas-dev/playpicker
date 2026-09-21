# Accessibility verification

Target: **WCAG 2.2 Level AA**. This is a development target and verification record, not a certification or a completed conformance evaluation.

## Implemented

- Semantic landmarks, a skip link, one visible page heading, and ordered activity/dialog headings.
- Visible labels for filters and search, translated accessible names, and exposed selected/expanded states.
- Keyboard and single-tap alternatives to swiping; keyboard focus follows card replacement, undo, empty states, and dialog dismissal.
- Native modal dialogs with Escape dismissal, tab containment, and explicit restoration when an opener was replaced.
- Higher-contrast text and controls, visible focus indicators, and controls designed around a 44 CSS px minimum target (exceeding the AA 24px minimum where applicable).
- Content-driven card heights, wrapping filters, and layouts that accommodate translated and enlarged text.
- Reduced-motion support for animations and scrolling, plus forced-colors styling.
- Polite state announcements and persistent, in-flow notifications that do not cover controls.
- Explicit English/Spanish translation bindings, complete messages with named placeholders and plural rules, accent-insensitive search, and defensive preference storage.

## Automated verification

Run `npm ci`, `npx playwright install chromium`, `npm run check`, and `npm test`. Tests start their own local HTTP server and do not change application data in your regular browser. To use an existing Chromium binary, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its executable path.

The suite uses axe-core's WCAG 2 A/AA, WCAG 2.1 A/AA, WCAG 2.2 AA, and best-practice rules. It checks discovery, filters, empty search, activity dialogs, saved and empty collections, and installation dialogs in both languages. It also exercises translation coverage, plural forms, persistence, focus restoration, keyboard operation, offline switching, and unavailable storage.

Reflow is checked at 320, 390, 768, and 1280 CSS px. The suite also applies 200% root text sizing and the WCAG text-spacing overrides at a 320px viewport. A narrow viewport is a reflow test; it is not a substitute for manually testing browser zoom.

Latest verification: 2026-09-21, Chromium automation. All 15 axe audits passed with zero reported violations. The regression suite also passed keyboard/focus, English/Spanish translation coverage and pluralization, filter and saved-state persistence, 44px control bounds, touch swipe/cancellation, escaped content rendering, text enlargement/spacing, offline reload, and unavailable-storage checks. Re-run the suite for results on your machine. Passing axe checks does not establish conformance with all criteria; its incomplete/manual-review results also need human evaluation.

## Manual checks before claiming conformance

- VoiceOver with Safari on iPhone/macOS and NVDA with Firefox or Chrome: reading order, card names, dialog entry/exit, status announcements, and language pronunciation.
- Real browser zoom at 200% and 400%, text-only enlargement, and custom text spacing on discovery, collection, and dialogs.
- Real-device touch dragging, vertical scrolling, canceled gestures, and pass/save alternatives in portrait and landscape.
- Windows High Contrast / forced colors: controls, selection, disabled states, and visible focus.
- Focus visibility while scrolling long dialogs and every card, including when the on-screen keyboard is open.
- Human review of Spanish phrasing and the clarity of all instructions and activity safety notes.

## References

- [WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)
- [Target size, minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [Focus not obscured, minimum](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
