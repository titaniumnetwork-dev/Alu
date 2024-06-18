importScripts("/workerware/WWError.js");
const dbg = console.log.bind(console, "[WorkerWare]");

const defaultOpt = {
  debug: false,
};

// type middlewareManifest = {
//     function: Function,
//     name?: string,
//     events: string[], // Should be a union of validEvents.
// }

const validEvents = [
  "abortpayment",
  "activate",
  "backgroundfetchabort",
  "backgroundfetchclick",
  "backgroundfetchfail",
  "backgroundfetchsuccess",
  "canmakepayment",
  "contentdelete",
  "cookiechange",
  "fetch",
  "install",
  "message",
  "messageerror",
  "notificationclick",
  "notificationclose",
  "paymentrequest",
  "periodicsync",
  "push",
  "pushsubscriptionchange",
  "sync",
];

class WorkerWare {
  constructor(opt) {
    this._opt = opt;
    this._middlewares = [];
  }
  use(middleware) {
    let validateMW = this.validateMiddleware(middleware);
    if (validateMW.error) throw new WWError(validateMW.error);
    // This means the middleware is an anonymous function, or the user is silly and named their function "function"
    if (middleware.function.name == "function") middleware.name = crypto.randomUUID();
    if (!middleware.name) middleware.name = middleware.function.name;
    if (this._opt.debug) dbg("Adding middleware:", middleware.name);
    this._middlewares.push(middleware);
  }
  run(event) {
    const middlewares = this._middlewares;
    const returnList = [];
    let fn = async () => {
      for (let i = 0; i < middlewares.length; i++) {
        if (middlewares[i].events.includes(event.type)) {
          returnList.push(await middlewares[i].function(event));
        }
      }
      return returnList;
    };
    return fn;
  }
  runMW(id, event) {
    const middlewares = this._middlewares;
    if (this._opt.debug) dbg("Running middleware:", id);
    if (middlewares.includes(id)) {
      return middlewares[id](event);
    }
  }
  validateMiddleware(middleware) {
    if (!middleware.function)
      return {
        error: "middleware.function is required",
      };
    if (typeof middleware.function !== "function")
      return {
        error: "middleware.function must be typeof function",
      };
    if (!middleware.events)
      return {
        error: "middleware.events is required",
      };
    if (!Array.isArray(middleware.events))
      return {
        error: "middleware.events must be an array",
      };
    if (middleware.events.some((ev) => !validEvents.includes(ev)))
      return {
        error: "Invalid event type! Must be one of the following: " + validEvents.join(", "),
      };
    return {
      error: undefined,
    };
  }
}
