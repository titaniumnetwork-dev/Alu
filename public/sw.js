importScripts("/libcurl/index.js");
importScripts("/epoxy/index.js");
importScripts("/bare_transport.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts(__uv$config.sw);
importScripts("./workerware/workerware.js");

const ww = new WorkerWare({
  debug: true,
});

function logContext(ctx, event) {
  console.log("Context:", ctx);
  console.log("Event:", event);
  return void 0;
}

ww.use(logContext)

const uv = new UVServiceWorker();

self.addEventListener("fetch", async (event) => {
  let middleware = await ww.run(self, event)();
  if (middleware.includes(null)) {
    console.log("Aborting Request!")
    return;
  }
  event.respondWith(
    (async () => {
      if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});
