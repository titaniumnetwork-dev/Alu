export declare global {
  namespace Alu {
    let store: AluStore;
    let settings: {
      loadedContentStorage: Record<string, string>;
      currentTab: string;
    };

    type DefaultKeys = {
      [key: string]: Key;
    };
    type Key = Record<
      string?,
      | string
      | {
          name: string;
          value: string
          icon: string;
          isCustom: boolean;
        }
    >;
    type ValidStoreKeys = "proxy" | "search" | "openpage" | "wisp" | "bareUrl" | "transport" | "theme" | "lang" | "cloak";
  }
}
