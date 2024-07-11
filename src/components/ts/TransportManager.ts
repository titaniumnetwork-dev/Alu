// @ts-ignore
// For some reason, VSCode can't find the bare-mux package. It exists and compiling works, but vscode throws a fit.
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
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
  connection: BareMuxConnection;
  private transport = "/epoxy/index.mjs";

  constructor(transport?: string) {
    this.connection = new BareMuxConnection("/baremux/worker.js");
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
  async updateTransport() {
    try {
      console.log(this.transport);
      await this.setTransport(JSON.parse(localStorage.getItem("alu__selectedTransport")!).value);
    } catch {
      console.log("Failed to update transport! Falling back to old transport.");
      this.setTransport(this.transport);
    }
  }

  getTransport() {
    return this.transport;
  }

  async setTransport(transport: string, wispURL = wispURLDefault) {
    this.transport = transport;
    let transportConfig: transportConfig = { wisp: wispURL };

    if (this.transport == "/baremod/index.mjs") {
      transportConfig = localStorage.getItem("alu__bareUrl") || window.location.origin + "/bare/";
    }

    await this.connection.setTransport(transport, [transportConfig]);
  }
}

export const TransportMgr = new TransportManager();

export async function registerSW() {
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
  TransportMgr.setTransport(
    TransportMgr.getTransport(),
    localStorage.getItem("alu__wispUrl") || wispURLDefault
  );
}
