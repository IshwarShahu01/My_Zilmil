# Zilmil ✦ a birthday site for Sakshi

A small, private website — your memories, told as a constellation. No backend,
no database, just HTML/CSS/JS, so it can be hosted for free on GitHub Pages
without buying a domain.

## 1. Put this on GitHub

1. Create a new repository on GitHub (e.g. `zilmil`). Keep it **public** —
   GitHub Pages' free tier needs that (unless you're on a paid plan that
   supports private Pages).
2. From this folder, run:
   ```bash
   git init
   git add .
   git commit -m "for Sakshi"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from
   a branch → Branch: `main` / `(root)` → Save.**
4. Wait a minute, then your site is live at:
   `https://<your-username>.github.io/<repo-name>/`
5. Share that link with her.

## 2. Add her photos

Drop image files into `images/` using these exact names and they show up
automatically, no code edits required:

| Filename                  | Where it appears                          |
|----------------------------|--------------------------------------------|
| `painting-event.jpg`       | Chapter one — the office painting event    |
| `csr-hug.jpg`               | Chapter two — the CSR event / the hug      |
| `navratri.jpg`               | Chapter three — Navratri, Radha & Krishna  |
| `diwali-stall.jpg`           | Chapter three — Diwali, her first stall    |

The small "constellation of small moments" cards each take an optional photo
too — these are unnamed if missing, just falling back to a small star icon:

| Filename                        | Card                |
|----------------------------------|----------------------|
| `moment-31st-night.jpg`          | 31st Night           |
| `moment-diyas-mandir.jpg`        | Diyas at the Mandir  |
| `moment-cricket-final.jpg`       | The Cricket Final    |
| `moment-food-trips.jpg`          | Every Food Trip      |
| `moment-coke-incident.jpg`       | The Coke Incident    |
| `moment-midnight-calls.jpg`      | Midnight Calls       |
| `moment-fights.jpg`              | Our Fights           |
| `moment-walks.jpg`               | The Walks            |
| `moment-happy-places.jpg`        | Happy Places         |

Until you add a photo, that spot just shows a small placeholder card —
nothing breaks.

## 3. Add her song

Drop an mp3 into `audio/` named exactly `her-song.mp3` and the player in the
"Your Song" section starts working automatically.

## 4. Customize the words

Everything you'd want to tweak — the memories, the quotes, the jokes, the
final wish — lives as plain text inside `index.html`. Open it in any text
editor, find the section by its heading comment (e.g.
`<!-- ================= THE WISH ================= -->`), and edit the `<p>`
text directly. The quotes in "Sweet Nothings" live in `js/script.js` near the
top, in a list called `lines`.

## 5. Preview it locally before pushing

Just open `index.html` directly in a browser, or for a closer-to-production
preview, run from this folder:
```bash
python3 -m http.server 8000
```
then visit `http://localhost:8000`.

## What's inside

- `index.html` — all the content and structure
- `css/style.css` — the night-sky design system (colors, type, layout, motion)
- `js/script.js` — scroll reveals, the constellation nav, the quote cards, the
  "Catch the Falling Stars" game, and the candle/confetti wish reveal
- `images/`, `audio/` — drop her photos and song here

No build tools, no frameworks, no dependencies beyond Google Fonts — it's
plain enough to host anywhere, but built for GitHub Pages specifically.
