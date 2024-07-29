import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

type transportConfig =
  | {
      wisp: string;
      wasm?: string;
    }
  | string;

export const wispURLDefault = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
export default class TransportManager {
  connection: BareMuxConnection;
  private transport: string = "/epoxy/index.mjs";

  constructor(transport?: string) {
    this.connection = new BareMuxConnection("/baremux/worker.js");
    if (transport) {
      this.transport = transport;
    }
    if (localStorage.getItem("alu__selectedTransport") != null && !transport) {
      const selectedTransport = JSON.parse(localStorage.getItem("alu__selectedTransport")!) as { value: string };
      this.transport = selectedTransport.value;
    }
    if (localStorage.getItem("alu__selectedTransport") == null) {
      // Set the default transport for the next reload.
      localStorage.setItem("alu__selectedTransport", JSON.stringify({ value: this.transport }));
    }
  }
  async updateTransport() {
    try {
      const selectedTransport = JSON.parse(localStorage.getItem("alu__selectedTransport")!) as { value: string };
      await this.setTransport(selectedTransport.value);
    } catch {
      console.log("Failed to update transport! Falling back to old transport.");
      await this.setTransport(this.transport);
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

export async function registerAndUpdateSW(): Promise<void> {
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none",
    });
    console.log("Service worker registered!");
    await reg.update();
  } catch (err) {
    console.error("Service worker registration failed: ", err);
  }
}

export async function initTransport() {
  await TransportMgr.setTransport(TransportMgr.getTransport(), localStorage.getItem("alu__wispUrl") || wispURLDefault);
}
