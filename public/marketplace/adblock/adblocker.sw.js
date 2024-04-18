importScripts("/libcurl/index.js");
importScripts("/epoxy/index.js");
importScripts("/bare_transport.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts(__uv$config.sw);

const uv = new UVServiceWorker();

let lowes = [];
let loadLowes = async () => {
  await fetch ("/marketplace/adblock/peterlowes.json")
  .then(response => response.json()).then(data => {
    data.rules.forEach((rule) => {
      lowes.push(rule["remote-domains"]);
    })
  })
  console.log("Loaded Peter Lowes' List!");
  console.log(lowes)
}
loadLowes();


self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (lowes.some((lowe) => __uv$config.decodeUrl(event.request.url).includes(lowe))){
        return new Response("Blocked by Peter Lowes", {status: 403});
      }
      if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});
