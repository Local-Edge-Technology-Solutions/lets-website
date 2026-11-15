// Builds the static site in site/ (the black-and-teal Poster) into dist/site. Netlify publishes dist/site.
import { defineConfig, type Plugin } from "vite";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "site");

// Preloads the one Chivo file every page needs (latin, upright), so the headline sets in its real face
// on the first paint. The file is hashed at build time, so the link is added from the bundle.
function preloadChivo(): Plugin {
  return {
    name: "lets-preload-chivo",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        const font = Object.keys(ctx.bundle ?? {}).find((f) => /chivo-latin-wght-normal.*\.woff2$/.test(f));
        if (!font) return [];
        return [{ tag: "link", attrs: { rel: "preload", href: `/${font}`, as: "font", type: "font/woff2", crossorigin: "" }, injectTo: "head-prepend" }];
      },
    },
  };
}

export default defineConfig({
  root,
  base: "/",
  appType: "mpa",
  publicDir: path.resolve(root, "public"),
  // Plain CSS, no PostCSS: an empty config stops Vite looking for a postcss.config file in parent folders.
  css: { postcss: {} },
  plugins: [preloadChivo()],
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/site"),
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: path.resolve(root, "index.html"),
        thanks: path.resolve(root, "thanks/index.html"),
        examples: path.resolve(root, "examples/index.html"),
        notFound: path.resolve(root, "404.html"),
      },
    },
  },
  preview: { port: 4173, strictPort: true },
});
