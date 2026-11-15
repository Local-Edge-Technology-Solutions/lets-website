# LETS website

The website for Local Edge Technology Solutions (localedgesolutions.ai): one static page, built with Vite and
hosted on Netlify. This repository is public: never put passwords, keys, `.env` files, client data or private
screenshots and recordings in it.

## Adding something (a demo, a picture, a change)

You need Git and Node.js 20 or newer, and a copy of this repository on your computer. Run the commands below
from its folder.

1. Work on the branch `zeke-bio-2026-11`, which holds the current redesign (pull request #5):
   `git switch zeke-bio-2026-11 && git pull`.
2. Make a folder `site/assets/demos/` and put demo files in it (pictures as `.jpg` or `.webp`). A file only
   shows on the page once `site/index.html` points to it. Photos of real people stay real photos, and
   anything invented for a demo is labelled "Example".
   Videos (`.mp4`) also need one change to the site's security settings in `netlify.toml` (a `media-src`
   entry); leave that to Ben if you're unsure.
3. See it on your computer: `npm install` once, then `npm run dev:site`, and open the address it prints.
   Before you push, `npm run build:site` must finish without errors.
4. Commit and push to `zeke-bio-2026-11`. The preview link on pull request #5
   (https://deploy-preview-5--localedgesolutions.netlify.app) updates a minute or two later.
5. Nothing goes live until the change reaches `main`. Merging into `main`, or pushing to it directly,
   publishes the site straight away, so only do that when both of us have looked and said go.

If you'd rather not touch the code, send the files (or invite AceofBen to the repository they are in) and
Ben will add them.

## Where things are

- `site/index.html`: the page. `site/styles.css`: all the styling. `site/js/`: the small scripts (menu,
  the example demos, the form).
- `site/public/`: files served as they are (icons, the share picture, robots.txt).
- `netlify.toml`: build settings and security headers. The one inline script in `site/index.html` is
  allowed by a hash here; if that line changes, the hash must change too.
- The contact form uses Netlify Forms; messages are in the Netlify dashboard under Forms.
