# Pocket IDE (Android)

A mobile-first IDE that runs in Chrome on Android and installs as an app (PWA).
Everything is plain HTML/CSS/JS, with no build step.

## Features
- Syntax highlighting for HTML, CSS, JavaScript, Python, JSON and Markdown
- Multiple projects and folders, open-file tabs, and autosave to IndexedDB
- Coding key bar (Tab, arrows, brackets, symbols) and word suggestions for phone keyboards
- Auto-indent, auto-closing brackets and quotes, toggle comment, find & replace, go to line
- **Run**: live HTML preview (linked CSS/JS are inlined) with a console and a JS REPL
- **Python** via [Pyodide](https://pyodide.org) in a Web Worker (downloaded on first run, then cached)
- Import/export projects as `.zip`; the Android back button closes panels and dialogs
- Works offline after the first visit (service worker)

## Run it
Serve the repo over HTTP(S) (service workers need it), for example:

```bash
npx http-server . -p 8080
```

Open `http://<your-pc-ip>:8080/android-ide/` on the phone. Installing needs HTTPS
(GitHub Pages works). Then use **☰ → Install app** or Chrome **⋮ → Add to Home screen**.

## Ship it as an APK / Play Store app
The PWA can be wrapped as a Trusted Web Activity without rewriting it:
- [PWABuilder](https://www.pwabuilder.com): enter the hosted URL and download an Android package, or
- [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap): `bubblewrap init --manifest https://<host>/android-ide/manifest.webmanifest`

## Known limits
- Python `input()` isn't supported yet (it needs cross-origin isolation).
- Only text files are stored. ES-module `import` between project JS files isn't resolved;
  classic `<script src>` tags are.
