# SCE — Swipe Card Engine · v0.2.0

Independent reusable HTML/CSS/JavaScript card engine derived from TYPE/16 v1.0.2. No network dependencies or build step. Open index.html directly or serve the directory. The demo is also the editable studio. All custom content remains in the browser unless exported; uploaded images are embedded as data URLs.

## v0.2.0
- Exact active button illumination during drag and throw, including strong and vertical actions; cancel clears all feedback.
- TYPE/16-style fixed choice banner, single spatial response row (strong left, left, up, right, strong right), down in the lower toolbar when available.
- Opposed card stamps: left choice on the right, right choice on the left, up at the bottom and down at the top. Side colors follow the theme.
- Preserve existing set schema and local storage key. Gesture thresholds and editor unchanged.

## Quick start
1. Open index.html and choose an example or create a set.
2. Edit name, card count, mode, per-card text, images and actions. Choose preset, colors, desktop background and font.
3. Click **Probar set** to start a fresh preview. Hide the editor to play.
4. Save locally or export/import JSON (includes embedded images). Local storage capacity depends on the browser; export larger sets.

## For developers and AI
Copy the entire engine directory into your app. Load model.js, gestures.js, audio.js, player.js in this order and player.css. Create a div and call `new SCE.player.Player(element, set, options)`. No demo dependency. No MBTI logic. Classic scripts also work from file://. See docs/API.md and AGENTS.md. Use the studio to produce valid starting content. Assets may be embedded or relative to the hosting document. No external URLs accepted by the built-in player.

## Source and scope
TYPE/16's pointer damping and paper swish/thud were adapted/extracted from the active index.html at main commit 08b05d0. The original HTML tightly couples rendering, gesture classification and MBTI state, so the card renderer and data model are newly decoupled implementations, not a verbatim clone of the old UI. Intensity uses horizontal distance only; vertical gestures are separate. No original project files changed.

## Tests
Run `node tests/model.test.cjs` for state and gesture assertions. Manual browser checklist: drag mouse/touch in all enabled directions; cancel short drag; use buttons and keys; change modes; load images and SVG; export/import; reload after local save; check mobile/desktop, fullscreen and reduced motion. This release does not claim browser test coverage.

## Limits
Initial version: Spanish studio UI; per-card correctness, scores, next-card branches and numerical state effects. No automatic conditional rules, randomization, session resume, learner analytics, PWA or standalone HTML exporter yet. JSON export stores the set, not its player. No external image URLs; maximum individual upload 3 MB. SVG is rendered as an image, not inserted as markup.
