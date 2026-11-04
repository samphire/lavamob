# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Lavamob is an English-reading / vocabulary-learning PWA for (mostly Korean) students. Users open "readers" (texts, optionally with synced audio), tap words to look them up and add them to a personal learning list (LL), then review the list with spaced-repetition tests. Authors (`group === 'AUTHOR'`) can also create and edit readers.

## Build / run / deploy

There is no build step, bundler, linter, or test suite. The app is plain HTML + global-scope JavaScript (jQuery) + PHP/MySQL.

- `npm install` only pulls `qrcode` and `sweetalert2`; the app itself loads vendored copies from `js/` (`jquery-3.0.0.min.js`, `sweetalert2.min.js`, `howler.core.min.js`, `buzz.min.js`), not from `node_modules`.
- Production is `https://www.notborder.org/lavamob` (Apache/PHP on AWS, `/var/www/html/lavamob`). The WebStorm config (`.idea/deployment.xml`, `php/.idea/`) auto-uploads files over SFTP on save. Editing a file in WebStorm can therefore deploy it straight to production.
- To test locally, edit the commented-out localhost lines in `js/globalVars.js` (`url`, `url2`, `audiourl`). Login depends on the central `/login/` service on the same host, so most flows only work when served from notborder.org.
- Cache busting is done by hand with `?version=N` query strings on the `<script>`/`<link>` tags in `index.html`. Bump them when you change those files. `service-worker.js` is network-first.

## Architecture

**Single page, section switching.** `index.html` holds every screen as a `<section>` (`#welcome`, `#selectReader`, `#createReader`, `#reader`, `#vocab`, `#vocaTest`). Navigation hides all sections (`hideAllSections()` in `js/index.js`) and shows one. There are no modules: every script in `index.html` shares global variables, so **script order in `index.html` matters**, and many globals (`userid`, `llData`, `nowList`, `selectedTextid`, `selectedReaderObj`, `howl`, …) are declared at the top of `js/index.js` and changed from other files.

**Auth.** On `window.onload`, `js/index.js` calls `/login/whoami_lavamob.php`, a shared SSO endpoint outside this repo. If there is no session it redirects to `/login/?next=…`. On success it fills the globals and mirrors them into `localStorage`. Logout goes to `/login/logout.php`. `?textid=N` in the URL opens that reader directly (used by QR codes in printed books).

**Backends** (configured in `js/globalVars.js`):
- `url2` → this repo's `php/*.php` endpoints. These handle almost all data access: texts, the learning list, goals, the activity log, and OpenAI example sentences (`php/openai.php`, which reads the key from `/var/www/config/lavamob-api.php`).
- `url` → a legacy Java REST service (`:8181/Reader/webresources`). It is still used only for `replaceSpriteData` in `js/utilities.js`.
- `audiourl` → `notborder.org/readeraudio`, which hosts audio files and the audio upload endpoint.

Every PHP endpoint includes `php/session.inc`, which sets the CORS/no-cache headers and opens the global `$conn` (mysqli, DB `reader3`) using credentials from `/var/www/config/lavamob-db.php`. Secrets live in `/var/www/config/` on the server, outside the web root (`/var/www/html`); `config/` in the repo holds git-ignored local copies plus tracked `*.example.php` templates. Never put secrets in `.inc` files under the web root: Apache serves them as plain text. Endpoints build SQL by putting `$_GET`/`$_POST` values straight into the query string and return JSON via `echo json_encode(...)`.

**Front-end file roles:**
- `js/index.js`: startup and auth, the welcome/goals gauges, reader list, reader rendering (`downloadReader` wraps each word in a span bound to `customPop` for lookup and LL add), and LL fetching (`getLL.php`).
- `js/createReader.js`: the author tool for creating and editing texts, uploading audio, and building Howler audio sprites. It posts to `uploadText.php`.
- `js/readerSortAndGroup.js`: drag reordering and grouping of the reader list (`reorderReaders.php`).
- `js/spacedRep.js`: the vocab test flow (`test()`, `checkResult`, `endTest`, `updateItem`). It writes results with `llEdit.php` / `llDelete.php` / `llDeleteAndAdd.php`.
- `js/SRS2.js`: the scheduling algorithm (SM-2-like ease factor with a kid-friendly bootstrap interval ladder and jitter). `updateSRS(card, wasCorrect)` is what `spacedRep.js` calls.
- `js/utilities.js`: shared helpers, including `jaxy(url, type, data, successMsg, errorMsg)`, the generic AJAX + SweetAlert wrapper, and the OpenAI example fetch.

**Learning-list updates happen in place.** Adding or deleting LL items changes `llData` and restyles the matching `.readerPanel .word` spans without reloading, so the user keeps their scroll position. Keep that behaviour. Words can contain apostrophes, so escape them when building selectors or inline handlers (a past bug).

## Notes

- `css/index.css` is due for cleanup. Newer styling lives in its own files per feature (`create-reader.css`, `header.css`, `gauges.css`, …).
- Server timezone is set to `Asia/Seoul` in `session.inc`. SRS due dates are MySQL date strings (`calcDateNext` in `spacedRep.js`).
