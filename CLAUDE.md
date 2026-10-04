# Gymnase app (repo: grades)

French PWA for students of my Vaud gymnase, classes 3M01 to 3M14 (there is no 3M04).
Hosted on GitHub Pages at https://quidding1.github.io/grades/ and wrapped as an Android APK
with PWABuilder (package `io.github.quidding1.grades`). Asset links live in the separate
repo `quidding1.github.io` (`.well-known/assetlinks.json`).

## Files
- `index.html`: the whole app (HTML, CSS, JS and the timetable data). No build step.
- `sw.js`: service worker. **Bump `CACHE` (e.g. `grades-v17` → `grades-v18`) on every change**,
  otherwise phones keep the old version.
- `manifest.json`, `icon-*.png`.

## Rules
- All UI text in French. Keep the black/minimal style, light/dark/system theme via CSS variables.
- Data lives in `localStorage` key `grades-v1`. Never break existing data: add migrations instead.
- Teacher codes are never stored or shown.
- Languages: French (source), English, German. Language is `settings.lang` (`auto` = phone language, French fallback).
  The code stays in French; `applyLang()` translates the rendered DOM afterwards (MutationObserver).
  **New UI text needs an entry** in `TX` (whole text), `RU` (text with numbers/names, regex) or `VOC` (subject names),
  otherwise it stays French. User-typed text must go through `uesc()` so it is never translated.
  Strings built in code that must be translated at once (dates, `confirm()`, calendar titles) use `tr()`.

## What the app does
- Setup slides (resume if closed): class, maths / history / language-2 groups, A/B group
  (asked once for English; language 2 is the opposite letter), option spécifique (all 10),
  locked 2nd-year grades as "points en plus" (−9 to +6), option complémentaire (Thursday blocks).
- Horaire: real dates, swipe between days, Vaud holidays 2026-27, red TE / yellow DV marks
  with a dropdown per lesson, "now / next" card.
- Agenda: tests and homework by date, homework can be ticked done.
- Notes: Vaud maturité total = 14 grades, minimum 4 × number of grades, double compensation
  for grades under 4, max 4 grades under 4. Subject averages rounded to 0.5.
  Philo & Psycho (OS) = 3/5 philo + 2/5 psycho, separate from Philosophie (DF). TM = 1 grade.
- Exam simulator, trend graph, Google Agenda link and .ics export, feedback by mail
  (`gradesapp@outlook.com`), first-launch tutorial, one round + button on every tab.

## Timetable data
`GROUPS` (shared maths, history, language-2 and OS groups) and `CLASSES` (class-level lessons)
use one line per lesson: `Day start-end Name @Room #tag=value`, periods 1 to 10
(08:10 to 16:45). OC blocks are in `OC_SLOTS`, all on Thursday afternoon.
