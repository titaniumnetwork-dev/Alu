const getWSProtocol = () => {
  if (location.protocol === "https:") {
    return "wss://";
  } else {
    return "ws://";
  }
};

const KEYSTORE: Pyrus.DefaultKeys = {
  proxy: {
    name: "Auto",
    value: "auto",
  },
  search: {
    name: "Google",
    value: "https://google.com/search?q=",
  },
  openpage: {
    name: "Embed",
    value: "embed",
  },
  wisp: {
    name: "Pyrus (US)",
    value: getWSProtocol() + window.location.host + "/wisp/",
  },
  bareUrl: {
    value: `${window.location.protocol}//${window.location.host}/bare/`,
  },
  transport: {
    name: "Epoxy",
    value: "/epoxy/index.mjs",
  },
  theme: {
    name: "Pyrus",
    value: "alu",
  },
};

if (localStorage.getItem("PyrusStore") === null) {
  localStorage.setItem("PyrusStore", JSON.stringify(KEYSTORE));
}

class PyrusStore {
  #store: Pyrus.DefaultKeys;
  constructor() {
    const localstore = localStorage.getItem("PyrusStore");
    if (!localstore) {
      localStorage.setItem("PyrusStore", JSON.stringify(KEYSTORE));
    }
    this.#store = JSON.parse(localStorage.getItem("PyrusStore") || "{}");
  }
  public getStore(): Pyrus.DefaultKeys {
    return this.#store;
  }
  public get(key: Pyrus.ValidStoreKeys): Pyrus.Key {
    return this.#store[key];
  }
  public set(key: Pyrus.ValidStoreKeys, value: Pyrus.Key): void {
    this.#store[key] = value;
    this.save();
  }
  public reset(key: Pyrus.ValidStoreKeys) {
    this.set(key, KEYSTORE[key]);
  }
  public remove(key: Pyrus.ValidStoreKeys) {
    delete this.#store[key];
    this.save();
  }
  private save(): void {
    localStorage.setItem("PyrusStore", JSON.stringify(this.#store));
  }
}

export default PyrusStore;
