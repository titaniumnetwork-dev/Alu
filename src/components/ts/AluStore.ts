const KEYSTORE: AluDefaultKeys = {
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
    value: "alu",
  },
  bareUrl: {
    name: `${window.location.protocol}//${window.location.host}/bare/`,
    value: `${window.location.protocol}//${window.location.host}/bare/`,
  },
  theme: {
    name: "Alu",
    value: "alu",
  },
  transport: {
    name: "Epoxy",
    value: "epoxy",
  },
  searxng: {
    name: "https://searxng.site",
    value: "https://searxng.site",
  },
};

if (localStorage.getItem("AluStore") === null) {
  localStorage.setItem("AluStore", JSON.stringify(KEYSTORE));
}

class AluStore {
  private store: AluDefaultKeys = KEYSTORE;
  constructor() {
    const localstore = localStorage.getItem("AluStore");
    if (!localstore) {
      localStorage.setItem("AluStore", JSON.stringify(KEYSTORE));
    }
    this.store = JSON.parse(localStorage.getItem("AluStore") || "{}");
  }
  public getStore(): AluDefaultKeys {
    return this.store;
  }
  public get(key: string): AluKey {
    return this.store[key];
  }
  public set(key: string, value: AluKey): void {
    this.store[key] = value;
    this.save();
  }
  private save(): void {
    localStorage.setItem("AluStore", JSON.stringify(this.store));
  }
}

window.AluStore = new AluStore();
