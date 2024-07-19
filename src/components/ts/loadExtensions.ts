export async function retrieveExtensions(type: ExtType) {
  const extensionsArr: Array<Extension> = [];
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("AluDB", 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
  });

  const transaction = db.transaction("InstalledExtensions", "readwrite");
  const objectStore = transaction.objectStore("InstalledExtensions");
  const extensions: Array<Extension> = await new Promise((resolve, reject) => {
    const request = objectStore.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
  });

  extensions.forEach(async (extension: Extension) => {});
  return extensionsArr;
}
