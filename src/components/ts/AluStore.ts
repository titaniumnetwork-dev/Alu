const KEYSTORE: Alu.DefaultKeys = {
  proxy: {
    name: "Ultraviolet",
    value: "ultraviolet",
  },
  search: {
    name: "Google",
    value: "google",
  },
  openpage: {
    name: "Embed",
    value: "embed",
  },
  wisp: {
    name: "Alu (US)",
    value: "wss://aluu.xyz/wisp/",
  },
  bareUrl: {
    name: `${window.location.protocol}//${window.location.host}/bare/`,
    value: `${window.location.protocol}//${window.location.host}/bare/`,
  },
  transport: {
    name: "Epoxy",
    value: "epoxy",
  },
  searxng: {
    name: "https://searxng.site",
    value: "https://searxng.site",
  },
  theme: {
    name: "Alu",
    value: "alu",
  },
  lang: {
    name: "English",
    value: "en",
  },
};

if (localStorage.getItem("AluStore") === null) {
  localStorage.setItem("AluStore", JSON.stringify(KEYSTORE));
}

class AluStore {
  private store: Alu.DefaultKeys;
  constructor() {
    const localstore = localStorage.getItem("AluStore");
    if (!localstore) {
      localStorage.setItem("AluStore", JSON.stringify(KEYSTORE));
    }
    this.store = JSON.parse(localStorage.getItem("AluStore") || "{}");
  }
  public getStore(): Alu.DefaultKeys {
    return this.store;
  }
  public get(key: Alu.ValidStoreKeys): Alu.Key {
    return this.store[key];
  }
  public set(key: Alu.ValidStoreKeys, value: Alu.Key): void {
    this.store[key] = value;
    this.save();
  }
  public reset(key: Alu.ValidStoreKeys) {
    this.set(key, KEYSTORE[key]);
  }
  private save(): void {
    localStorage.setItem("AluStore", JSON.stringify(this.store));
  }
}

globalThis.Alu = {
  store: new AluStore(),
};
