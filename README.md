# DHS Visitor System (website)

Visitor registration and phone alerts for Dapdap High School. A guard registers each visitor and picks the teacher or office being visited; that person gets an in-app notification and a phone alert and can reply (On my way / Please wait / Cannot meet now).

This repository is only the **website** (plain HTML and JavaScript, no build step). The database, logins and alert sender run on Supabase and are set up separately (see the `dhs-visitor-supabase` package, its README has the steps).

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app (pages, styles, English and Tagalog text) |
| `config.js` | Public settings: Supabase project URL, publishable key, login domain |
| `sw.js` | Service worker that shows phone alerts when the app is closed |
| `manifest.webmanifest`, `icon-192.png`, `icon-512.png` | Install-to-home-screen name and icons (seal centred) |
| `dhs-logo.jpg` | Original logo artwork, kept as the source. The app shows a circular copy of the seal that is embedded inside `index.html`. |
| `.github/workflows/deploy.yml` | Publishes the site to GitHub Pages |
| `.nojekyll` | Tells GitHub Pages not to process the files |

## Publish it

1. Upload every file to the **root** of the repository, including the hidden `.github` folder and `.nojekyll`. Phone file managers often hide dot-folders, so check that `.github/workflows/deploy.yml` arrived.
2. Repository **Settings > Pages > Build and deployment > Source: GitHub Actions**.
3. Commit to `main`. The **Actions** tab shows the deploy; when it is green the site address appears under Settings > Pages.

## config.js

`config.js` already points at the DHS Supabase project. It holds public values only. If you ever move to a different Supabase project, replace `url` and `key` with that project's Project URL and **publishable** key.

**Never put a `service_role` or `sb_secret_` key in this repository.** The page refuses to start if it finds one, and anyone can read a public repo.

## Using it

- Guard and admin: sign in with the staff ID and password (an admin must approve new accounts).
- Teachers: open the site in Chrome on Android, then **Install app**, **Enable alerts**, **Send test**.

## Design notes

- `sw.js` does no caching, so a new `index.html` shows up on the next reload. No version number to bump.
- Only the design layer changed from the earlier version. Sign-in, approvals, alerts, replies and live updates run the same code.
- Motion: screens animate only when you change page. Numbers count up, the active tab slides, cards glow under the pointer, buttons ripple and buzz on Android. All of it switches off for people who set "reduce motion" on their phone.
- Popups: toasts stack (max 3), pause on hover, and carry an icon, so colour is never the only signal. Dialogs trap focus, close with Esc or the X, and give focus back. Delete and reset-password use in-app dialogs, not browser pop-ups. A teacher with the app open gets an urgent visitor as a reply sheet, not a short toast.
- Phone motion (touch first, no hover): every button squashes its own way under your finger (7 press styles, one tilts toward where you touch) and then plays its own release flourish (12 styles), so no two buttons share a pair. Taps give a small vibration on Android (iPhones ignore it). Swipe an unanswered alert left to acknowledge it, pull down at the top of a page to refresh, drag a sheet down to close it, swipe a toast up to dismiss it. Tabs slide the page in the direction you moved. Everything respects "reduce motion".

## Colour choices (and the evidence)

Navy base, trust blue for actions, golden yellow for highlights and caution, green for safe/accepted, red only for urgent, danger and errors.

- School visitor/safety software leans navy and bright blue (e.g. Pikmykid's brand guidelines: https://www.pikmykid.com/?p=1400). Red and green are kept for alert feedback.
- Safety-colour standard ISO 3864: red = prohibition/danger, yellow = warning, blue = mandatory action, green = safe condition. Reference values: red #9B2423, yellow #F9A800, blue #005387, green #237F52 (https://en.wikipedia.org/wiki/ISO_3864). The app uses lighter versions of these so they read on a dark screen.
- DepEd's official identity is blue, red and golden yellow, taken from the Philippine flag (https://www.teacherph.com/deped-service-marks-and-visual-identity-manual/). The Dapdap seal carries the same red and yellow.
- Blue is linked to competence, trust and security; saturated red to excitement (Labrecque and Milne 2012, https://www.servicescape.com/blog/the-psychology-of-color-6-logo-color-secrets-you-should-know).
- Every text pair is at least 4.5:1 and form-field borders at least 3:1 (WCAG).
