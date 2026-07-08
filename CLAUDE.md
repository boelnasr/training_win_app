# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This is a static "Developer Training Hub" — a collection of long-form, single-file HTML guides on programming topics, linked together from `index.html`. There is no build system, package manager, server, or test suite; every page is plain HTML/CSS/JS meant to be opened directly in a browser or served as static files.

Pages:
- `index.html` — landing/hub page, links to all guides
- `algorithms-guide.html` — algorithms & data structures
- `capstone-projects-guide.html` — project ideas applying prior guides
- `design-patterns-guide.html` — OOP design patterns
- `docker-containers-guide.html` — Docker & containers
- `elsa-workflows-guide.html` — Elsa (.NET workflow engine)
- `git-visual-guide.html` — Git/version control
- `python-to-cpp-csharp-guide.html` — Python → C++/C# language transition
- `winui-blazor-guide.html` — WinUI & Blazor
- `wpf-complete-guide.html` — WPF

## Working with this codebase

There is nothing to install, build, lint, or test. To view changes, open the relevant `.html` file directly in a browser (or serve the directory with any static file server, e.g. `python3 -m http.server`). There is no CI, formatter, or linter configured — verify changes visually in a browser.

## Page structure and conventions

Every guide file is a **single self-contained HTML document**: all CSS lives in a `<style>` block in `<head>`, all JS in one `<script>` block before `</body>`. There are no external JS/CSS files and no build step — do not try to extract shared assets into separate files or introduce a bundler; the self-contained-per-page model is intentional so each guide can be opened/shared standalone.

Each guide follows the same template, so when editing one, match the existing ones:

- **Theming**: dark theme defined via CSS custom properties on `:root` (`--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`, plus a per-guide accent color set, e.g. `--accent-blue`, `--docker-blue`). Google Fonts (`JetBrains Mono`, `Plus Jakarta Sans`, `Space Grotesk`) are imported via `@import url(...)` at the top of the `<style>` block.
- **Layout**: fixed `<header>` with title/subtitle, a scroll `.progress-bar`, a `<nav>` of `.nav-link` anchors, and `<main>` containing a sequence of `<section id="...">` blocks — one section per topic/chapter.
- **Code blocks**: wrapped in `.code-block` with a `.copy-btn` calling `copyCode(this)`.
- **Shared JS behaviors** (duplicated verbatim in each file's inline `<script>`, not imported): `updateProgressBar()`, `revealOnScroll()` (adds `.visible` to sections as they scroll into view), `updateActiveNav()` (highlights the current section's nav link), `toggleBackToTop()` / `scrollToTop()`, `copyCode(btn)` (copies a code block's text via `navigator.clipboard`), and a mouse-driven particle effect (`moveParticles`). When adding a new guide or new interactive behavior, copy the existing pattern from another guide rather than inventing a new one.
- **Content sections** typically build up from concept explainers to diagrams (CSS-drawn boxes/arrows) to runnable code samples, ending in a pitfalls/best-practices section.

When adding a new topic section to an existing guide, follow the existing section's HTML structure (heading, prose, diagram markup, code block with copy button) rather than introducing new markup patterns. When adding a brand-new guide page, copy an existing guide as a starting template (for the CSS variables, header/nav/progress-bar scaffold, and script block) and add a corresponding link/card on `index.html`.
