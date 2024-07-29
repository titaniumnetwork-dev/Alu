export declare global {
  namespace Alu {
    let store: AluStore;

    type DefaultKeys = {
      [key: string]: AluKey;
    };
    type Key = Record<string, string>;
    type ValidStoreKeys = "proxy" | "search" | "openpage" | "wisp" | "bareUrl" | "transport" | "searxng" | "theme" | "lang" | "cloak";
  }
}
