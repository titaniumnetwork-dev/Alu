// loadJS("FILE_PATH_HERE", true/false for async)
// EX. loadJS("./main.js", true) loads main.js as async!
function loadJS(FILE_URL, async = true) {
  let scriptEle = document.createElement("script");

  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);

  document.body.appendChild(scriptEle);

  // success event 
  scriptEle.addEventListener("load", () => {
    console.log("File Load Success!")
  });
   // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("File Load Fail. Error:", ev);
  });
}