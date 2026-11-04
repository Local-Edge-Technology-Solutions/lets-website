// Fills the empty #root in the built index.html with the server-rendered page,
// so crawlers and visitors without JavaScript get the real content.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const outDir = path.resolve(process.argv[2] ?? "dist/public");
const serverDir = path.resolve(process.argv[3] ?? "dist/server");
const { render } = await import(pathToFileURL(path.join(serverDir, "entry-server.js")).href);

const file = path.join(outDir, "index.html");
const html = fs.readFileSync(file, "utf8");
const marker = '<div id="root"></div>';
const count = html.split(marker).length - 1;
if (count !== 1) {
  throw new Error(`Expected exactly one empty <div id="root"></div> in ${file}, found ${count}`);
}
fs.writeFileSync(file, html.replace(marker, `<div id="root">${render()}</div>`));
console.log(`Prerendered ${file}`);
