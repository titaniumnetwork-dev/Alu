export declare global {
  namespace Alu {
    let store: AluStore;
    // Settings Content Store (orig. window.loadedContentStorage)
    let settings: {
      contentStore: {
        [key: string]: string;
      }
      currentPage: string;
    }

    type DefaultKeys = {
      [key: string]: AluKey;
    };
    type Key = Record<string?, string>;
    type ValidStoreKeys = "proxy" | "search" | "openpage" | "wisp" | "bareUrl" | "transport" | "searxng" | "theme" | "lang" | "cloak";
  }
}
