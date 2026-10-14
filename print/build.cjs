// Builds the print files from the HTML sources in this folder.
// Usage: npm i --no-save playwright-core  then  node print/build.cjs   (Chromium path: CHROME or /opt/pw-browsers/chromium)
const path = require("path");
const { chromium } = require("playwright-core");
const dir = __dirname, out = path.join(dir, "out");
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium" });
  const p = await b.newPage();
  await p.goto("file://" + path.join(dir, "rx.html")); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(out, "Rx-Dr-Saleem-Andraws.pdf"), width: "210mm", height: "297mm", printBackground: true, preferCSSPageSize: true });
  await p.goto("file://" + path.join(dir, "card.html")); await p.waitForSelector("body[data-ok]");
  await p.pdf({ path: path.join(out, "Business-Card-Dr-Saleem-Andraws.pdf"), width: "66mm", height: "78mm", printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log("done");
})();
