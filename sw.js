import { fetchEvent } from "./osana/fetch.js";

self.addEventListener("fetch", event => event.respondWith(fetchEvent(event)));
