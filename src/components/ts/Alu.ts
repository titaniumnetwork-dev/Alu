import AluStore from "./AluStore";
import IDBManager from "./IDBManager";

async function instantiateAlu(): Promise<void> {
  return new Promise((resolve) => {
    if (globalThis.Alu) return;
    globalThis.Alu = {
      store: new AluStore(),
      eventList: {},
      settings: {
        loadedContentStorage: {},
        currentTab: "",
      },
    };
  
    if (!window.idb) {
      const db = IDBManager.loadIDB("AluDB", 1);
      db.onupgradeneeded = () => {
        window.idb = db.result;
        IDBManager.SetIDB(window.idb);
        IDBManager.CreateStore("InstalledExtensions", { keyPath: "slug" });
      };
      db.onsuccess = () => {
        window.idb = db.result;
        IDBManager.SetIDB(window.idb);
        resolve();
      };
    }
  });
}

export default instantiateAlu;
