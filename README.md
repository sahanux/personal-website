# Sahan Karunarathne · Portfolio

A simple portfolio in plain HTML, CSS and JavaScript. There's no build step and no dependencies (the fonts are Archivo and Fraunces, from Google Fonts). The site is light theme only, with fully rounded buttons, pills and circles and soft-cornered cards.

## Pages

```
public/index.html      Main page: hero, About, How I work, Work, Experience, Toolkit, Education, Contact
public/videos.html     Videos: your YouTube videos (featured + grid + topic filters)
```

Both pages share these files:

```
public/css/styles.css  All styling (design tokens at the top, including the rounding: --r-full, --r-card)
public/js/content.js   ← ALL site text lives here. Edit this file to change content.
public/js/main.js      Renders content.js into each page and wires up interactions
public/cv.pdf          Your CV. The "Download CV" buttons open it in a new tab.
                  To update it, overwrite this file (keep the name).
public/assets/work/    Drop product screenshots here
```

## Adding a YouTube video

Open `public/js/content.js`, find `videos` → `items`, and add a block like this:

```js
{
  title: "How I map a company's operations in one week",
  url: "https://www.youtube.com/watch?v=VIDEO_ID",
  date: "2026-09-10",
  topic: "Operations",
  description: "One or two lines about what viewers will learn.",
},
```

- **Links:** any YouTube link works (`watch?v=`, `youtu.be/`, `shorts/`), or just paste the video ID.
- **Order:** the newest `date` is featured at the top. The rest appear in a grid below it.
- **Topic filters:** a filter button appears for each `topic` once you use two or more topics.
- **Channel link:** set `channelUrl` to show a "Subscribe on YouTube" button.
- **Playback:** videos play in place when clicked. Nothing loads from YouTube until then, which keeps the page fast.

## Other edits

- **Headshot:** set `person.photo`, e.g. `"assets/sahan.jpg"` (portrait, about 4:5). It replaces the "SK" circle in the About section.
- **Experience:** dates are `"YYYY-MM"` (or `"present"`). Durations are calculated automatically.
- **Screenshots:** set `image: "assets/work/ledgerpro.jpg"` on a work item (16:10 works best).
- **Navigation:** edit `nav` in `content.js`. `target` scrolls to a section on the main page, and `href` opens another page.
- **Page titles and descriptions:** edit the `<title>` and `<meta>` tags at the top of each HTML file.

## Running locally

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.

**Seeing old content after an edit?** Browsers cache the CSS and JS files. Hard-refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows). Before publishing changes, bump the `?v=` number on the `css/styles.css`, `js/content.js` and `js/main.js` links at the top of `public/index.html` and `public/videos.html` (e.g. `?v=20260915` → `?v=20260920`), so visitors get the new files too.

## Deploying

Upload the folder as-is to any static host: GitHub Pages, Netlify, Vercel or Cloudflare Pages.
