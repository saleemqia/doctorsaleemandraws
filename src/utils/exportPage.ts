import JSZip from "jszip";

// Eagerly load all source files as raw strings at build time.
const rawModules = import.meta.glob("/src/**/*.{ts,tsx,jsx,js,css}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css"];
const INDEX_FILES = EXTENSIONS.map((e) => `/index${e}`);

function resolveSpecifier(spec: string, fromFile: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) {
    base = "/src/" + spec.slice(2);
  } else if (spec.startsWith("./") || spec.startsWith("../")) {
    const dir = fromFile.substring(0, fromFile.lastIndexOf("/"));
    const parts = (dir + "/" + spec).split("/");
    const stack: string[] = [];
    for (const p of parts) {
      if (p === "" || p === ".") continue;
      if (p === "..") stack.pop();
      else stack.push(p);
    }
    base = "/" + stack.join("/");
  } else {
    return null; // external package
  }

  if (rawModules[base]) return base;
  for (const ext of EXTENSIONS) {
    if (rawModules[base + ext]) return base + ext;
  }
  for (const idx of INDEX_FILES) {
    if (rawModules[base + idx]) return base + idx;
  }
  return null;
}

const IMPORT_RE =
  /(?:import\s+(?:[^"';]+?\s+from\s+)?|export\s+(?:[^"';]+?\s+from\s+)|import\s*\()\s*["']([^"']+)["']/g;

function collectDeps(entry: string): Set<string> {
  const visited = new Set<string>();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop()!;
    if (visited.has(file)) continue;
    const src = rawModules[file];
    if (src === undefined) continue;
    visited.add(file);

    IMPORT_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = IMPORT_RE.exec(src)) !== null) {
      const resolved = resolveSpecifier(m[1], file);
      if (resolved && !visited.has(resolved)) stack.push(resolved);
    }
  }
  return visited;
}

export async function exportPageSource(
  entryFile: string,
  zipName: string,
): Promise<void> {
  if (!rawModules[entryFile]) {
    throw new Error(`Entry file not found: ${entryFile}`);
  }
  const files = collectDeps(entryFile);
  const zip = new JSZip();
  for (const f of files) {
    // Strip leading "/" so files sit under "src/..." in the zip.
    zip.file(f.replace(/^\//, ""), rawModules[f]);
  }
  zip.file(
    "README.txt",
    `Exported source for: ${entryFile}\nGenerated: ${new Date().toISOString()}\nFiles: ${files.size}\n\nThis archive contains only the React/TS/CSS source files reachable from the page entry. External npm packages and project config are not included.\n`,
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function entryForPath(pathname: string): {
  entry: string;
  zipName: string;
} {
  if (pathname.startsWith("/admin")) {
    return { entry: "/src/pages/Admin.tsx", zipName: "admin-page-source.zip" };
  }
  if (pathname.startsWith("/login")) {
    return { entry: "/src/pages/Login.tsx", zipName: "login-page-source.zip" };
  }
  if (pathname === "/" || pathname === "") {
    return { entry: "/src/pages/Index.tsx", zipName: "index-page-source.zip" };
  }
  return { entry: "/src/pages/NotFound.tsx", zipName: "notfound-page-source.zip" };
}
