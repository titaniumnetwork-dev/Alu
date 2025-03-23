import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

type transportConfig = {
  wisp: string;
};
export default class TransportManager {
  private transport: Pyrus.Key;
  connection: BareMuxConnection;

  constructor(transport?: Pyrus.Key) {
    this.connection = new BareMuxConnection("/baremux/worker.js");
    if (transport) {
      this.transport = transport;
    }
    this.transport = Pyrus.store.get("transport");
  }
  async updateTransport() {
    try {
      const selectedTransport = Pyrus.store.get("transport");
      await this.setTransport(selectedTransport);
    } catch (err) {
      throw new Error("Failed to update transport! Try reloading. \nError: " + err);
    }
  }

  getTransport() {
    return this.transport;
  }

  async setTransport(transport: Pyrus.Key, wispURL: string = Pyrus.store.get("wisp").value) {
    this.transport = transport;
    const transportConfig: transportConfig = { wisp: wispURL };

    if (this.transport.value == "/baremod/index.mjs") {
      return await this.connection.setTransport(transport.value.toString(), [Pyrus.store.get("bareUrl").value]);
    }

    await this.connection.setTransport(transport.value.toString(), [transportConfig]);
  }
}

export const TransportMgr = new TransportManager();

export async function initTransport() {
  return await TransportMgr.setTransport(TransportMgr.getTransport(), Pyrus.store.get("wisp").value);
}

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
