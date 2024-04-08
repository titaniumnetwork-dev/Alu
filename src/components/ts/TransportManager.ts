// @ts-ignore
// For some reason, VSCode can't find the bare-mux package. It exists and compiling works, but vscode throws a fit.
import { SetTransport, registerRemoteListener } from "@mercuryworkshop/bare-mux";
// @ts-check
declare global {
  interface Window {
    __uv$config: {
      prefix: string;
      encodeUrl: (url: string) => string;
    };
    loadFormContent: Function | null;
  }
}

type transportConfig =
  | {
      wisp: string;
      wasm?: string;
    }
  | string;

export const wispURLDefault =
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
export default class TransportManager {
  private transport = "EpxMod.EpoxyClient";

  constructor(transport?: string) {
    if (transport) {
      this.transport = transport;
    }
    if (localStorage.getItem("alu__selectedTransport") != null && !transport) {
      this.transport = JSON.parse(localStorage.getItem("alu__selectedTransport")!).value;
    }
    if (localStorage.getItem("alu__selectedTransport") == null) {
      // Set the default transport for the next reload.
      localStorage.setItem("alu__selectedTransport", JSON.stringify({ value: this.transport }));
    }
  }
  updateTransport() {
    try {
      this.setTransport(JSON.parse(localStorage.getItem("alu__selectedTransport")!).value);
      console.log(this.transport);
    } catch {
      console.log("Failed to update transport! Falling back to old transport.");
      this.setTransport(this.transport);
    }
  }

  getTransport() {
    return this.transport;
  }

  setTransport(transport: string, wispURL = wispURLDefault) {
    this.transport = transport;
    let transportConfig: transportConfig = { wisp: wispURL };

    if (this.transport == "BareMod.BareClient") {
      transportConfig = localStorage.getItem("alu__bareUrl") || window.location.origin + "/bare/";
    }

    SetTransport(this.transport, transportConfig);
  }
}

export const TransportMgr = new TransportManager();
export async function initTransport() {
  return new Promise(async (resolve) => {
    await registerRemoteListener(navigator.serviceWorker.controller!);
    await navigator.serviceWorker
      .register("/sw.js", {
        scope: window.__uv$config.prefix,
      })
      .then((registration) => {
        registration.update().then(() => {
          TransportMgr.setTransport(
            TransportMgr.getTransport(),
            localStorage.getItem("alu__wispUrl") || wispURLDefault
          );
        });
        resolve(null);
      });
  });
}
