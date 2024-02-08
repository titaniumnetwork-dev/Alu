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
dotenv.config();

if (!existsSync("./dist")) build();

const PORT = process.env.PORT || 3000;

const bare = createBareServer("/bare/");
console.log(chalk.gray("Starting Bare..."));

const rh = createRammerhead();
console.log(chalk.gray("Starting Rammerhead..."));

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
  "/mainport",
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

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

const app = express();
app.use(compression());
app.use(express.static(path.join(process.cwd(), "static")));
app.use(express.static(path.join(process.cwd(), "build")));
app.use("/uv/", express.static(uvPath));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", express.static("dist/client/"));

console.log(chalk.gray("Starting Alu..."));
console.log(chalk.green("Alu started successfully!"))
server.on("listening", () => {
  console.log(chalk.green(`Server running at http://localhost:${PORT}/.`));
});


server.listen({
  port: PORT,
});
