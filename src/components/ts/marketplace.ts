import marketplaceManifest from "../../json/marketplace.json";
import IDBManager, { loadIDBPromise } from "./IDBManager";
import Toast from "./toast";
const installButtons = document.getElementsByClassName("btn-install");

const extManifest = marketplaceManifest as ExtensionMetadataJSON;

const EXT_RETURN = {
  INSTALL_FAILED: -1,
  INSTALL_SUCCESS: 0,
  ALREADY_INSTALLED: 1,
}

Array.from(installButtons).forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const ele = event.target as HTMLButton;
    const title = ele.dataset.title;
    if (ele.dataset.slug) {
      const ext = await getMarketplaceExt(ele.dataset.slug);
      const install = await installExtension(ext, ele.dataset.slug)
      switch (install.code) {
        case EXT_RETURN.INSTALL_SUCCESS:
          Toast.success(`Installed ${title} Successfully!`);
          if (ext.type === "serviceWorker") {
            navigator.serviceWorker.getRegistration().then((reg) => {
              if (reg) {
                // Unregister the SW so that the installed plugin is loaded when the page is refreshed (automatically)
                reg.unregister();
              }
            });
          }
          break;
        case EXT_RETURN.ALREADY_INSTALLED:
          Toast.success(`${title} is already installed!`);
          break;
        case EXT_RETURN.INSTALL_FAILED:
          Toast.error(`Failed to install ${title}!`);
      }
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      const btn = document.querySelector(`button[data-slug="${install.slug}"]`) as HTMLButton;
      setInstallBtnText(btn);
    }
  });
});

async function getMarketplaceExt(slug: string) {
  const manifest = extManifest[slug];
  if (manifest == null) {
    throw new Error("Extension not found!");
  }
  // This is for the scriptCopy field, which is a uint8 array of the script
  const contents = await fetch(manifest.script).then((res) => res.text());
  const encoder = new TextEncoder();
  manifest.scriptCopy = encoder.encode(contents);
  return manifest;
}

async function installExtension(ext: ExtensionMetadata, slug: string) {
  return new Promise<InstallReturn>((resolve, reject) => {
    const request = IDBManager.GetIDB();
    const transaction = request.transaction("InstalledExtensions", "readwrite");
    const store = transaction.objectStore("InstalledExtensions");
    const extensionObject = {
      slug: slug,
      ...ext,
    };
    const slugCheck = store.get(slug);
    slugCheck.onsuccess = () => {
      if (slugCheck.result == null) {
        const addRequest = store.add(extensionObject);
        addRequest.onerror = () => {
          console.error(`Error installing ${slug}!`);
          reject({ code: EXT_RETURN.INSTALL_FAILED, slug: slug });
        };
        addRequest.onsuccess = () => {
          resolve({ code: EXT_RETURN.INSTALL_SUCCESS, slug: slug });
        };
      } else {
        resolve({ code: EXT_RETURN.ALREADY_INSTALLED, slug: slug });
      }
    };
  });
}

function addUninstallEventListeners() {
  document.querySelectorAll("button[data-uninstall-slug]").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      if (!confirm("Are you sure you want to uninstall this extension?")) {
        return;
      }
      const button = event.target as HTMLButton;
      const uninst = await uninstallExtension(button.dataset.uninstallSlug!);
      switch (uninst.code) {
        case EXT_RETURN.INSTALL_SUCCESS:
          Toast.success(`Uninstalled ${uninst.title}!`);
          const btn = document.querySelector(`button[data-slug="${uninst.slug}"]`) as HTMLButton;
          btn.disabled = false;
          btn.textContent = "Install";
          btn.classList.remove("installed");
          (event.target as HTMLButton).classList.add("btn-hidden");
          break;
        case EXT_RETURN.INSTALL_FAILED:
          Toast.error(`Failed to uninstall ${uninst.title}!`);
          break;
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  });
}

addUninstallEventListeners();
document.addEventListener("astro:after-swap", () => {
  addUninstallEventListeners();
});

async function uninstallExtension(slug: string): Promise<InstallReturn> {
  return new Promise<InstallReturn>((resolve, reject) => {
    if (!slug || slug == null) {
      reject({ code: EXT_RETURN.INSTALL_FAILED, slug: slug });
    }
    const request = IDBManager.GetIDB();
    const transaction = request.transaction("InstalledExtensions", "readwrite");
    const store = transaction.objectStore("InstalledExtensions");

    const ext = store.get(slug);
    ext.onsuccess = async () => {
      if (ext.result == null) {
        reject({ code: EXT_RETURN.INSTALL_FAILED, slug: slug });
      }
      if (ext.result.type === "theme") {
        const theme = Alu.store.get("theme");
        if (theme.value == ext.result.themeName) {
          Alu.store.reset("theme");
        }
      }
      const deleteRequest = store.delete(slug);
      deleteRequest.onerror = () => {
        console.error(`Error uninstalling ${slug}!`);
        reject({ code: EXT_RETURN.INSTALL_FAILED, slug: slug, title: slug });
      };
      deleteRequest.onsuccess = () => {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.unregister().then(() => {
              console.log("Service worker unregistered!");
            });
          }
        });
        resolve({ code: EXT_RETURN.INSTALL_SUCCESS, slug: slug, title: ext.result.title });
      };
    };
  });
}

function setInstallBtnText(btn: HTMLButton) {
  btn.disabled = true;
  btn.textContent = "Installed";
  btn.classList.add("installed");
}

function getInstallStatus() {
  const installBtns = document.querySelectorAll("button[data-slug]");
  const transaction = IDBManager.GetStore("InstalledExtensions", "readonly").transaction;
  const store = transaction.objectStore("InstalledExtensions");
  const cursor = store.openCursor();
  cursor.onsuccess = () => {
    const res = cursor.result;
    if (res) {
      const slug = res.value.slug;
      installBtns.forEach((btn) => {
        const button = btn as HTMLButton;
        if (button.dataset.slug == slug) {
          setInstallBtnText(button);
          document.querySelector(`button[data-uninstall-slug="${slug}"]`)!.classList.remove("btn-hidden");
        }
      });
      res.continue();
    }
  };
}

async function InitIDB() {
  if (!window.indexedDB) {
    console.error("This browser doesn't support IndexedDB");
    document.getElementById("support-warning")!.innerText = "Your browser doesn't support IndexedDB. Please use a different browser!";
    return;
  }
  await loadIDBPromise("AluDB", 1);
  if (IDBManager.GetIDB() != null) {
    getInstallStatus();
    return;
  }
}
InitIDB();

document.addEventListener("astro:after-swap", async () => {
  InitIDB();
});
