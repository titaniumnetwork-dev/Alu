export declare global {
  type AluStore = {
    get: (key: Alu.ValidStoreKeys) => Alu.KeyObj;
    set: (key: Alu.ValidStoreKeys, value: Alu.KeyObj) => void;
    remove: (key: Alu.ValidStoreKeys) => void;
    reset: (key: Alu.ValidStoreKeys) => void;
  };

  namespace Alu {
    let store: AluStore;
    let settings: {
      loadedContentStorage: Record<string, string>;
      currentTab: string;
    };

    type DefaultKeys = {
      [key: string]: Key;
    };
    // tf? if I remove boolean it breaks in settings.ts. I don't know why.
    type Key = Record<string?, string | KeyObj>;

    type KeyObj = {
      name: string;
      value?: string;
      icon?: string;
      isCustom?: boolean;
    };
    type ValidStoreKeys = "proxy" | "search" | "openpage" | "wisp" | "bareUrl" | "transport" | "theme" | "lang" | "cloak";
  }
}
