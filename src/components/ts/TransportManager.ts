// @ts-ignore
// For some reason, VSCode can't find the bare-mux package. It exists and compiling works, but vscode throws a fit.
import { SetTransport, registerRemoteListener } from "@mercuryworkshop/bare-mux";
// @ts-check
declare global {
  interface Window {
    __uv$config: {
      prefix: string;
    };
  }
}

type transportConfig = {
  wisp: string;
  wasm?: string;
};

export const wispURLDefault =
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/";
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
  getTransport() {
    return this.transport;
  }

  setTransport(transport: string, wispURL = wispURLDefault) {
    this.transport = transport;
    let transportConfig: transportConfig = { wisp: wispURL };
    if (this.transport == "CurlMod.LibcurlClient") {
      transportConfig.wasm = "https://cdn.jsdelivr.net/npm/libcurl.js@latest/libcurl.wasm";
    }
    SetTransport(this.transport, transportConfig);
  }
}

const TransportMgr = new TransportManager();
export function initTransport() {
  registerRemoteListener(navigator.serviceWorker.controller!);
  navigator.serviceWorker
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
    });
}
