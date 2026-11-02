import { createServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const server = await createServer({ configFile: false, root, plugins: [react()], resolve: { alias: { "@": path.join(root, "src") } }, server: { middlewareMode: true }, appType: "custom" });
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
try {
  const { prerender } = await server.ssrLoadModule("/src/prerender.tsx");
  const template = await readFile(path.join(root, "dist/index.html"), "utf8");
  for (const lang of ["en", "ar", "ku"]) for (const page of ["/about", "/faq", "/opening-hours", "/duhok"]) {
    const { html, seo, url, alternates } = prerender(lang, page);
    const route = (lang === "en" ? "" : `/${lang}`) + page;
    let output = template.replace('<html lang="en">', `<html lang="${lang}" dir="${lang === "en" ? "ltr" : "rtl"}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escape(seo.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${escape(seo.description)}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${escape(seo.title)}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${escape(seo.description)}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${escape(url)}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*("\s*\/?>)/, `$1${escape(seo.title)}$2`)
      .replace(/(<meta name="twitter:description" content=")[^"]*("\s*\/?>)/, `$1${escape(seo.description)}$2`);
    for (const a of [...alternates, { lang: "x-default", url: alternates[0].url }]) {
      const pattern = new RegExp(`(<link rel="alternate" hreflang="${a.lang}" href=")[^"]*("\\s*\\/?>)`);
      output = output.replace(pattern, `$1${escape(a.url)}$2`);
    }
    output = output.replace("</head>", `  <link rel="canonical" href="${escape(url)}" />\n  </head>`);
    const start = output.indexOf('<div id="root">');
    const end = output.indexOf('</div>', start);
    if (start < 0 || end < 0) throw new Error(`Cannot locate root for ${route}`);
    output = output.slice(0, start) + `<div id="root">${html}</div>` + output.slice(end + 6);
    const dir = path.join(root, "dist", route.slice(1));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), output);
  }
  console.log("Prerendered 12 localized information pages.");
} finally { await server.close(); }
