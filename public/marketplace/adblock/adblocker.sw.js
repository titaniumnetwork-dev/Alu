let lowes = [];

async function loadLowes() {
  await fetch("/marketplace/adblock/peterlowes.json")
    .then(response => response.json())
    .then(data => {
      data.rules.forEach((rule) => {
        lowes.push(rule["remote-domains"]);
      });
    });
  console.log("Loaded Peter Lowes' List!");
  console.log(lowes);
}

loadLowes();

function registerFetchListener() {
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      (async () => {
        console.log(event.request.url);
        if (lowes.some((lowe) => __uv$config.decodeUrl(event.request.url).includes(lowe))) {
          return new Response("Blocked by Peter Lowes", {status: 403});
        }
        if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
          return await uv.fetch(event);
        }
        return await fetch(event.request);
      })()
    );
  });
}

registerFetchListener();
