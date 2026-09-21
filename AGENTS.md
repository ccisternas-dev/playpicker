# PlayPicker engineering guidelines

## Scope and workflow

- This is a static, mobile-first family activity app: HTML, CSS, and browser JavaScript. Keep production free of build steps and runtime dependencies unless a feature justifies them.
- Work on `dev`. Preserve user changes. Commit, push, merge, and publish only when requested.
- Keep changes focused and readable. Format source with Prettier, use descriptive names, and extract repeated behavior into small functions. Keep data, translations, rendering, and styles distinguishable.
- Use native browser controls and progressive enhancement. Validate persisted data and handle unavailable storage and network errors without breaking the app.
- Never insert untrusted strings as HTML. Escape dynamic text and attribute values in templates; prefer textContent for plain text. Do not add secrets, tracking, or unnecessary dependencies.
- Keep relative asset paths working at both `/` and `/playpicker/`. Include required assets in the service worker shell and increment its cache version when the shell changes. Do not remove caches belonging to other apps on the same origin.

## Internationalization

- English and Spanish are supported equally. Every user-facing string, accessible name, status, empty state, and instruction must have both translations.
- Use explicit translation attributes for static elements and the translation helpers for dynamic content. Do not discover translations by scanning arbitrary rendered text.
- Translate complete sentences with named placeholders. Use Intl.PluralRules and Intl.NumberFormat for counts; do not assemble translated sentences from English fragments.
- Keep IDs and filter values language-independent. Switching language must preserve collection, filter, and swipe state. Persist the preference defensively and update the document language and title.
- Search must support Spanish accents. Layout must accommodate translated text without clipping or reducing text to unreadable sizes. Do not use national flags for languages.
- Translation additions require coverage checks for UI messages and all activity fields.

## Accessibility: WCAG 2.2 Level AA target

- Target all applicable WCAG 2.2 A and AA criteria. Automated checks support this target; they do not establish conformance alone.
- Use semantic landmarks, one visible h1, a logical heading hierarchy, a skip link, visible input labels, and native buttons and dialogs. Decorative graphics must be hidden from assistive technology.
- All functionality must work with a keyboard and a single pointer without dragging. Keep pass/save buttons alongside swipe gestures. Never use positive tabindex.
- Preserve a logical focus location after rerenders, save/remove, undo, and deck exhaustion. Dialogs must contain focus, close with Escape, and restore focus to a connected, visible trigger or sensible fallback.
- Provide visible, high-contrast focus indicators. Focus must not be obscured by notifications or overlays. Honor prefers-reduced-motion for animations and scripted scrolling.
- Normal text needs 4.5:1 contrast; large text needs 3:1. Essential control boundaries and state indicators need 3:1. Do not communicate state by color alone.
- Meet 24×24 CSS px AA target size or its spacing exceptions; use at least 44×44 px for app controls as our design standard (not an AA requirement).
- Support 200% text resizing, 400% zoom / 320 CSS px reflow, and WCAG text-spacing overrides without lost content or two-dimensional scrolling. Avoid fixed-height text containers.
- Accessible names must contain visible labels. Give icon-only buttons descriptive names. Expose expanded/pressed state, label dialogs, and announce meaningful updates politely without duplicate announcements.
- Keep critical information available rather than only in timed notifications. Errors and storage limitations must be understandable in both languages.

## Verification

- Run `npm run check`, `npm test`, and `git diff --check` before reporting completion.
- Browser tests should exercise both languages, filters, saved state, keyboard/focus paths, dialog close/restore, touch alternatives, reduced motion, offline reload, translation completeness, and representative empty states.
- Run axe-core WCAG 2.2 A/AA checks across discovery, expanded filters, activity dialog, installation dialog, collection, and empty states. Test narrow and desktop layouts plus text enlargement and spacing.
- Keep an accessibility verification record in ACCESSIBILITY.md. Explicitly distinguish tested behavior, known limitations, and manual checks still required (VoiceOver/NVDA, real-device zoom and touch, forced colors).
- Do not claim certified or complete WCAG conformance based on automated tests. Record relevant remaining limitations honestly.
