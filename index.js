import { createBareServer } from "@tomphttp/bare-server-node"
import { uvPath } from "@nebula-services/ultraviolet"
import http from 'node:http';
import path from 'node:path';
import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import dotenv from 'dotenv';
import compression from "compression"
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");
app.use(compression());
app.use(express.static(path.join(process.cwd(), "static")));
app.use(express.static(path.join(process.cwd(), "build")));
app.use("/uv/", express.static(uvPath));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  })
);
app.use("/", express.static('dist/client/'));
app.use(ssrHandler);

app.get('*', function(req, res){
  res.status(200).sendFile("404.html", {root: path.resolve("dist/client")});
});

server.on("request", (req, res) => {
    if (bareServer.shouldRoute(req)) {
      bareServer.routeRequest(req, res);
    } else {
      app(req, res);
    }
  });
  
  server.on("upgrade", (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
      bareServer.routeUpgrade(req, socket, head);
    } else {
      socket.end();
    }
  });
  
  server.on("listening", () => {
    console.log(`Server running at http://localhost:${PORT}/.`);
  });
  
  server.listen({
    port: PORT
  });