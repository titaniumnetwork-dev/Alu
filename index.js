import { uvPath } from "@nebula-services/ultraviolet";
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
import helmet from "helmet";
dotenv.config();

if (!existsSync("./dist")) build();

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
const bare = createBareServer("/bare/");
console.log(chalk.gray("Starting Bare..."));

const app = express();
app.use(compression({ threshold: 0, filter: () => true }));
app.use(express.static(path.join(process.cwd(), "static")));
app.use(express.static(path.join(process.cwd(), "build")));
app.use("/uv/", express.static(uvPath));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(function (req, res, next) {
  if (req.originalUrl.includes("/games")) {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
  }
  next();
});
app.use("/", express.static("dist/client/"));
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
  res.redirect(302, "/404.html");
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
