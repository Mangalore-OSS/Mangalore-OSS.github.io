import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const defaultPort = Number.parseInt(process.env.PORT || "4173", 10);
const host = "127.0.0.1";
const maxPortAttempts = 20;

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".htm", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".txt", "text/plain; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"]
]);

function cleanPath(requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0] || "/");
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  return path.normalize(relative);
}

async function resolveAsset(relativePath) {
  const candidate = path.resolve(rootDir, relativePath);
  if (!candidate.startsWith(rootDir + path.sep) && candidate !== rootDir) {
    return null;
  }

  try {
    const stat = await fs.stat(candidate);
    if (stat.isDirectory()) {
      const indexPath = path.join(candidate, "index.html");
      try {
        const indexStat = await fs.stat(indexPath);
        if (indexStat.isFile()) return indexPath;
      } catch {
        return null;
      }
      return null;
    }
    return stat.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

function contentTypeFor(filePath) {
  return contentTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream";
}

async function serveFile(filePath, response) {
  const data = await fs.readFile(filePath);
  response.writeHead(200, {
    "Content-Type": contentTypeFor(filePath),
    "Cache-Control": "no-cache"
  });
  response.end(data);
}

async function handler(request, response) {
  try {
    const relativePath = cleanPath(request.url || "/");
    let filePath = await resolveAsset(relativePath);

    if (!filePath && !path.extname(relativePath)) {
      filePath = await resolveAsset(path.join(relativePath, "index.html"));
    }

    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    await serveFile(filePath, response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error.message}`);
  }
}

function listenOn(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      void handler(request, response);
    });

    server.on("error", reject);
    server.listen(port, host, () => resolve(server));
  });
}

let server = null;
let port = defaultPort;
for (let attempt = 0; attempt < maxPortAttempts; attempt += 1) {
  try {
    server = await listenOn(port);
    break;
  } catch (error) {
    if (error && error.code === "EADDRINUSE") {
      port += 1;
      continue;
    }
    throw error;
  }
}

if (!server) {
  throw new Error(`Unable to bind a local port after ${maxPortAttempts} attempts`);
}

console.log(`Serving ${pathToFileURL(rootDir).href} at http://${host}:${port}/`);
