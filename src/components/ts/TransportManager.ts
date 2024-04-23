// @ts-ignore
// For some reason, VSCode can't find the bare-mux package. It exists and compiling works, but vscode throws a fit.
import { SetTransport, registerRemoteListener } from "@mercuryworkshop/bare-mux";
// @ts-check
declare global {
  interface Window {
    __uv$config: {
      prefix: string;
      encodeUrl: (url: string) => string;
      decodeUrl: (url: string) => string;
    };
    loadFormContent: Function | null;
    loadSelectedTransport: Function | null;
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

export async function registerSW() {
  navigator.serviceWorker.ready.then(async (sw) => {
    await registerRemoteListener(sw.active!);
  });
  return new Promise(async (resolve) => {
    await navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.update().then(() => {
        console.log("Registered SW!");
        resolve(null);
      });
    });
  });
}

export async function initTransport() {
  await registerRemoteListener(navigator.serviceWorker.controller!);
  TransportMgr.setTransport(
    TransportMgr.getTransport(),
    localStorage.getItem("alu__wispUrl") || wispURLDefault
  );
}

export async function loadSelectedTransportScript(): Promise<void> {
  return new Promise((resolve) => {
    let selectedTransport = localStorage.getItem("alu__selectedTransport");
    if (!selectedTransport) {
      localStorage.setItem("alu__selectedTransport", JSON.stringify({ value: "uv" }));
      return;
    }
    let transport = JSON.parse(selectedTransport).value;
    console.log(`Loading script for ${transport}`);
    let script;
    switch (transport) {
      case "EpxMod.EpoxyClient": {
        script = document.createElement("script");
        script.src = "/epoxy/index.js";
        script.defer = true;
        break;
      }
      case "CurlMod.LibcurlClient": {
        script = document.createElement("script");
        script.src = "/libcurl/index.js";
        script.defer = true;
        break;
      }
      case "BareMod.BareClient": {
        script = document.createElement("script");
        script.src = "/bare_transport.js";
        script.defer = true;
        break;
      }
      default: {
        script = document.createElement("script");
        script.src = "/epoxy/index.js";
        script.defer = true;
        break;
      }
    }
    document.body.appendChild(script);
    script.onload = () => {
      resolve();
    };
  });
}
