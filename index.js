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
import fs from "node:fs";
import fetch from "node-fetch";
dotenv.config();

const LICENSE_SERVER_URL = "https://license.mercurywork.shop/validate?license=";
const whiteListedDomains = ["aluu.xyz", "localhost:3000"]; // Add any public domains you have here
const failureFile = fs.readFileSync("Checkfailed.html", "utf8");

if (!existsSync("./dist")) build();

const bare = createBareServer("/bare/");

const PORT = process.env.PORT || 3000;
console.log(chalk.gray("Starting Rammerhead..."));
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

async function MasqFail(req, res) {
  if (!req.headers.host) {
    return;
  }
  const unsafeSuffix = req.headers.host + ".html";
  let safeSuffix = path.normalize(unsafeSuffix).replace(/^(\.\.(\/|\\|$))+/, "");
  let safeJoin = path.join(process.cwd() + "/Masqrd", safeSuffix);
  try {
    await fs.promises.access(safeJoin); // man do I wish this was an if-then instead of a "exception on fail"
    const failureFileLocal = await fs.promises.readFile(safeJoin, "utf8");
    res.setHeader("Content-Type", "text/html");
    res.send(failureFileLocal);
    return;
  } catch (e) {
    res.setHeader("Content-Type", "text/html");
    res.send(failureFile);
    return;
  }
}

// Woooooo masqr yayyyy (said no one)
// uncomment for masqr
app.use(async (req, res, next) => {
  if (req.headers.host && whiteListedDomains.includes(req.headers.host)) {
    next();
    return;
  }
  const authheader = req.headers.authorization;
  if (req.cookies["authcheck"]) {
    next();
    return;
  }

  if (req.cookies["refreshcheck"] != "true") {
    res.cookie("refreshcheck", "true", { maxAge: 10000 }); // 10s refresh check
    MasqFail(req, res);
    return;
  }

  if (!authheader) {
    res.setHeader("WWW-Authenticate", "Basic"); // Yeah so we need to do this to get the auth params, kinda annoying and just showing a login prompt gives it away so its behind a 10s refresh check
    res.status(401);
    MasqFail(req, res);
    return;
  }

  const auth = Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");
  const pass = auth[1];

  const licenseCheck = (
    await (await fetch(LICENSE_SERVER_URL + pass + "&host=" + req.headers.host)).json()
  )["status"];
  console.log(
    LICENSE_SERVER_URL + pass + "&host=" + req.headers.host + " returned " + licenseCheck
  );
  if (licenseCheck == "License valid") {
    res.cookie("authcheck", "true", { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }); // authorize session, for like a year, by then the link will be expired lol
    res.send(`<script> window.location.href = window.location.href </script>`); // fun hack to make the browser refresh and remove the auth params from the URL
    return;
  }

  MasqFail(req, res);
  return;
});

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
  if (req.url.includes ("/games/")) {
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
  }
  next();
});
app.use("/custom-favicon", async (req, res) => {
  try {
    const { url } = req.query;
    const response = await fetch(url).then((apiRes) => apiRes.buffer());
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send("Error");
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
app.get("*", function (req, res) {
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
  } else if (req.url.endsWith("/wisp/")) {
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

console.log(chalk.gray("Starting Alu..."));
console.log(chalk.green("Alu started successfully!"));
server.on("listening", () => {
  console.log(chalk.green(`Server running at http://localhost:${PORT}/.`));
});

server.listen({
  port: PORT,
});
