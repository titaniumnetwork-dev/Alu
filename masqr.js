import path from "path";

const failureFile = fs.readFileSync("Checkfailed.html", "utf8");

export async function masqrCheck(config) {
  return async (req, res, next) => {
    if (req.headers.host && config.whitelist.includes(req.headers.host)) {
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
      res.setHeader("WWW-Authenticate", "Basic");
      res.status(401);
      MasqFail(req, res);
      return;
    }

    const auth = Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");
    const pass = auth[1];

    const licenseCheck = (
      await (await fetch(config.licenseServer + pass + "&host=" + req.headers.host)).json()
    )["status"];
    console.log(
      config.licenseServer + pass + "&host=" + req.headers.host + " returned " + licenseCheck
    );
    if (licenseCheck == "License valid") {
      res.cookie("authcheck", "true", {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }); // authorize session, for like a year, by then the link will be expired lol
      res.send(`<script> window.location.href = window.location.href </script>`); // fun hack to make the browser refresh and remove the auth params from the URL
      return;
    }

    MasqFail(req, res);
    return;
  };
}

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
