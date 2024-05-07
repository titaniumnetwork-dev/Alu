import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "http";
import path from "node:path";
import createRammerhead from "rammerhead/src/server/index.js";
import compression from "compression";
import { build } from "astro";
import chalk from "chalk";
import { existsSync } from "fs";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import wisp from "wisp-server-node";
import fetch from "node-fetch";
import { masqrCheck } from "./masqr.js";
dotenv.config();

const whiteListedDomains = ["aluu.xyz", "localhost:3000"];
const LICENSE_SERVER_URL = "https://license.mercurywork.shop/validate?license=";
const WISP_ENABLED = process.env.USE_WISP;
const MASQR_ENABLED = process.env.MASQR_ENABLED;

if (!existsSync("./dist")) build({});

function log(message) {
  console.log(chalk.gray("[Alu] " + message));
}

const bare = createBareServer("/bare/");

const PORT = process.env.PORT || 3000;
log("Starting Rammerhead...");
const rh = createRammerhead();
const rammerheadScopes = [
  "/rammerhead.js",
  "/hammerhead.js",
  "/transport-worker.js",
  "/task.js",
  "/iframe-task.js",
  "/worker-hammerhead.js",
  "/messaging",
  "/sessionexists",
  "/deletesession",
  "/newsession",
  "/editsession",
  "/needpassword",
  "/syncLocalStorage",
  "/api/shuffleDict",
];
const rammerheadSession = /^\/[a-z0-9]{32}/;
const app = express();
app.use(compression({ threshold: 0, filter: () => true }));
app.use(cookieParser());

// Set process.env.MASQR_ENABLED to "true" to enable masqr protection.
if (MASQR_ENABLED == "true") {
  log("Starting Masqr...");
  app.use(await masqrCheck({ whitelist: whiteListedDomains, licenseServer: LICENSE_SERVER_URL }));
}

app.use(express.static(path.join(process.cwd(), "static")));
app.use(express.static(path.join(process.cwd(), "build")));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  if (req.url.includes("/games/")) {
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
  }
  next();
});
app.use("/custom-favicon", async (req, res) => {
  try {
    const { url } = req.query;
    const response = await fetch(`https://www.google.com/s2/favicons?domain=${url}&sz=128`);
    const buffer = new Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch {
    
  }
});
app.use("/", express.static("dist/client/"));
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/client/favicon.svg"));
});
app.get("/robots.txt", (req, res) => {
  if (req.headers.host && whiteListedDomains.includes(req.headers.host)) {
    res.sendFile(path.join(process.cwd(), "dist/client/robots-allow.txt"));
  } else {
    res.sendFile(path.join(process.cwd(), "dist/client/robots-deny.txt"));
  }
});
app.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    const response = await fetch(`http://api.duckduckgo.com/ac?q=${query}&format=json`).then(
      (apiRes) => apiRes.json()
    );

    res.send(response);
  } catch (err) {
    res.redirect(302, "/404.html");
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/client/404.html"));
});

let server = createServer();
server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else if (shouldRouteRh(req)) {
    routeRhRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else if (shouldRouteRh(req)) {
    routeRhUpgrade(req, socket, head);
    /* Kinda hacky, I need to do a proper dynamic import. */
  } else if (req.url.endsWith("/wisp/") && WISP_ENABLED == "true") {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

function shouldRouteRh(req) {
  const url = new URL(req.url, "http://0.0.0.0");
  return rammerheadScopes.includes(url.pathname) || rammerheadSession.test(url.pathname);
}

function routeRhRequest(req, res) {
  rh.emit("request", req, res);
}

function routeRhUpgrade(req, socket, head) {
  rh.emit("upgrade", req, socket, head);
}

log("Starting Alu...");
console.log(chalk.green("[Alu] Alu started successfully!"));
server.on("listening", () => {
  console.log(chalk.green(`[Alu] Server running at http://localhost:${PORT}/.`));
});

server.listen({
  port: PORT,
});
