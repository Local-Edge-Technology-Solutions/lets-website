# LETS website

The website for Local Edge Technology Solutions (localedgesolutions.ai): a small static site (the home page,
the examples page, a thank-you page and a not-found page), built with Vite and hosted on Netlify. This
repository is public: never put passwords, keys, `.env` files, client data or private screenshots and
recordings in it.

## Adding something (a demo, a picture, a change)

You need Git and Node.js 20.9 or newer, and a copy of this repository on your computer. Run the commands below
from its folder.

1. Start from the live version and make a branch of your own:
   `git switch main && git pull && git switch -c your-change-name` (swap `your-change-name` for a short
   name of your own, such as `zeke-demo-video`).
2. Make a folder `site/assets/demos/` and put demo files in it (pictures as `.jpg` or `.webp`). A file only
   shows on the page once `site/index.html` points to it. Photos of real people stay real photos, and
   anything invented for a demo is labelled "Example".
   Videos (`.mp4`) also need one change to the site's security settings in `netlify.toml` (a `media-src`
   entry); leave that to Ben if you're unsure.
3. See it on your computer: `npm install` once, then `npm run dev:site`, and open the address it prints.
   Before you push, `npm run build:site` must finish without errors.
4. Commit, push your branch and open a pull request on GitHub. Netlify adds a preview link to the pull
   request a minute or two later, and updates it each time you push.
5. Nothing goes live until the change reaches `main`. Merging into `main`, or pushing to it directly,
   publishes the site straight away, so leave that to Ben: he looks at the preview and publishes it.

If you'd rather not touch the code, send the files (or invite AceofBen to the repository they are in) and
Ben will add them.

## Where things are

- `site/index.html`: the home page. `site/styles.css`: its styling. `site/js/`: the small scripts (menu,
  the example demos, the form).
- `site/examples/`: the examples page and its styling; its script is `site/public/examples/examples.js`.
- `site/public/`: files served as they are (icons, the share picture, robots.txt).
- `netlify.toml`: build settings and security headers. The one inline script in `site/index.html` is
  allowed by a hash here; if that line changes, the hash must change too.
- The contact form uses Netlify Forms; messages are in the Netlify dashboard under Forms.
