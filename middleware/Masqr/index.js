import path from "path";
import fs from "fs";

export async function masqrCheck(config) {
  return async (req, res, next) => {
    try {
      const loadedHtmlFile = fs.readFileSync(process.cwd() + "/" + config.htmlFile, "utf8");
      if (config.whitelist.includes(req.hostname)) {
        next();
        return;
      }
      const authheader = req.headers.authorization;

      if (!req.cookies) {
        // Send an error
        return res.send("Request failed!");
      }

      if (req.cookies.authcheck) {
        next();
        return;
      }
      if (!authheader) {
        res.setHeader("WWW-Authenticate", "Basic");
        res.status(401);
        MasqrFail(req, res, loadedHtmlFile);
        return;
      }
      // If we are at this point, then the request should be a valid masqr request, and we are going to check the license server
      const auth = Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");
      const pass = auth[1];
      const licenseCheck = (await (await fetch(config.licenseServer + pass + "&host=" + req.headers.host)).json())["status"];
      if (licenseCheck === "License valid") {
        // Authenticated, set cookie for a year
        res.cookie("authcheck", "true", {
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
        res.send(`<script>window.location.href = window.location.href</script>`); // fun hack to make the browser refresh and remove the auth params from the URL
        return;
      } else {
        res.setHeader("WWW-Authenticate", "Basic");
        res.status(401);
        MasqrFail(req, res, loadedHtmlFile);
        return;
      }
    } catch (err) {
      console.error(err);
      res.status(500);
      res.send("Internal server error");
      return;
    }
  };
}
async function MasqrFail(req, res, failureFile) {
  if (!req.headers.host) {
    return;
  }
  const unsafeSuffix = req.headers.host + ".html";
  const safeSuffix = path.normalize(unsafeSuffix).replace(/^(\.\.(\/|\\|$))+/, "");
  const safeJoin = path.join(process.cwd() + "/Masqrd", safeSuffix);
  try {
    await fs.promises.access(safeJoin); // man do I wish this was an if-then instead of a "exception on fail"
    const failureFileLocal = await fs.promises.readFile(safeJoin, "utf8");
    res.setHeader("Content-Type", "text/html");
    res.send(failureFileLocal);
    return;
  } catch (e) {
    res.setHeader("Content-Type", "text/html");
    res.status(401);
    res.send(failureFile);
    return;
  }
}
