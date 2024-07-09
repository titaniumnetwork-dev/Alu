import "notyf/notyf.min.css";
import { Notyf } from "notyf";
import marketplaceManifest from "../../json/marketplace.json";
const installButtons = document.getElementsByClassName("btn-install");
import IDBManager from "./IDBManager";

type VALID_EXT_TYPES = "serviceWorker" | "theme" | "page";

// This just makes it shorter to type
interface HTMLButton extends HTMLButtonElement {}

interface ExtensionMetadata {
  title: string;
  // TODO: Add description to the manifest
  // description: string;

  // Versions should follow semantic versioning
  version: string;
  script: string;
  entryNamespace?: string;
  entryFunc?: string;
  scriptCopy: string | null;
  type: VALID_EXT_TYPES;
  themeName?: string;
}

enum EXT_RETURN {
  INSTALL_SUCCESS = 0,
  INSTALL_FAILED = -1,
  ALREADY_INSTALLED = 1,
}

type InstallReturn = {
  code: EXT_RETURN;
  slug: string;
  title?: string;
};

Array.from(installButtons).forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const ele = event.target as HTMLButton;
    const title = ele.dataset.title;
    let notification = new Notyf({
      duration: 999999,
      position: { x: "right", y: "bottom" },
      dismissible: true,
      ripple: true,
    });
    let installNotif = notification.success(`Installing ${title}...`);
    if (ele.dataset.slug) {
      let obj = await getMarketplaceObj(ele.dataset.slug);
      installExtension(obj, ele.dataset.slug)
        .then((ret) => {
          let notifMessage: string;
          let timeout = 2000;
          switch (ret.code) {
            case EXT_RETURN.INSTALL_SUCCESS:
              notifMessage = `Installed ${title} Successfully!`;
              // Unregister the service worker if it's a service worker
              if (obj.type === "serviceWorker") {
                navigator.serviceWorker.getRegistration().then((reg) => {
                  if (reg) {
                    reg.unregister().then(() => {
                      console.log("Service worker unregistered!");
                    });
                  }
                });
                
              };
              break;
            case EXT_RETURN.ALREADY_INSTALLED:
              notifMessage = `${title} is already installed!`;
              timeout = 0;
              break;
            case EXT_RETURN.INSTALL_FAILED:
              // We should NEVER get here, but just in case.
              notifMessage = `Failed to install ${title}!`;
              break;
          }
          setTimeout(() => {
            notification.dismiss(installNotif);
            notification.options.duration = 2000;
            notification.success(notifMessage);
            setTimeout(() => {
              notification.success(`Please refresh the page to see the changes!`);
            }, 200)
            notification.options.duration = 999999;
            let btn = document.querySelector(`button[data-slug="${ret.slug}"]`) as HTMLButton;
            setInstallBtnText(btn);
          }, timeout);
        })
        .catch(() => {
          notification.dismiss(installNotif);
          notification.options.duration = 2000;
          notification.error(`Failed to install ${title}!`);
          notification.options.duration = 999999;
        });
    }
  });
});

async function getMarketplaceObj(slug: string): Promise<ExtensionMetadata> {
  const manifest = (marketplaceManifest as unknown as { [key: string]: ExtensionMetadata })[slug];
  manifest.scriptCopy = btoa(await fetch(manifest.script).then((res) => res.text()));
  return manifest;
}

async function installExtension(ext: ExtensionMetadata, slug: string): Promise<InstallReturn> {
  return new Promise<InstallReturn>((resolve, reject) => {
    const request = IDBManager.GetIDB();
    const transaction = request.transaction("InstalledExtensions", "readwrite");
    const store = transaction.objectStore("InstalledExtensions");
    const extensionObject = {
      slug: slug,
      ...ext,
    };
    let slugCheck = store.get(slug);
    slugCheck.onsuccess = async () => {
      if (slugCheck.result != null) {
        resolve({ code: EXT_RETURN.ALREADY_INSTALLED, slug: slug });
      } else {
        const addRequest = store.add(extensionObject);
        addRequest.onerror = () => {
          console.error(`Error installing ${slug}!`);
          reject({ code: EXT_RETURN.INSTALL_FAILED, slug: slug });
        };
        addRequest.onsuccess = () => {
          resolve({ code: EXT_RETURN.INSTALL_SUCCESS, slug: slug });
        };
      }
    };
  });
}

document.querySelectorAll("button[data-uninstall-slug]").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    if (!confirm("Are you sure you want to uninstall this extension?")) {
      return;
    }
    let uninst = await uninstallExtension((event.target as HTMLButton).dataset.uninstallSlug!)
    let notification = new Notyf({
      duration: 999999,
      position: { x: "right", y: "bottom" },
      dismissible: true,
      ripple: true,
    });
    switch (uninst.code) {
      case EXT_RETURN.INSTALL_SUCCESS:
        notification.success(`Uninstalled ${uninst.title}!`);
        let btn = document.querySelector(`button[data-slug="${uninst.slug}"]`) as HTMLButton;
        btn.disabled = false;
        btn.textContent = "Install";
        btn.classList.remove("installed");
        (event.target as HTMLButton).classList.add("btn-hidden");
        break;
      case EXT_RETURN.INSTALL_FAILED:
        notification.error(`Failed to uninstall ${uninst.title}!`);
        break;
    }
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  })
})

async function uninstallExtension(slug: string): Promise<InstallReturn> {
  return new Promise<InstallReturn>((resolve, reject) => {
    if (!slug || slug == null) {
      reject({ code: EXT_RETURN.INSTALL_FAILED, slug: slug });
    }
    const request = IDBManager.GetIDB();
    const transaction = request.transaction("InstalledExtensions", "readwrite");
    const store = transaction.objectStore("InstalledExtensions");
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
      resolve({ code: EXT_RETURN.INSTALL_SUCCESS, slug: slug, title: slug });
    };
  });
};

function setInstallBtnText(btn: HTMLButton) {
  btn.disabled = true;
  btn.textContent = "Installed";
  btn.classList.add("installed");
}

function getInstallStatus() {
  let installBtns = document.querySelectorAll("button[data-slug]") as NodeListOf<HTMLButton>;
  let transaction = IDBManager.GetStore("InstalledExtensions", "readonly").transaction;
  let store = transaction.objectStore("InstalledExtensions");
  let cursor = store.openCursor();
  cursor.onsuccess = () => {
    let res = cursor.result;
    if (res) {
      let slug = res.value.slug;
      installBtns.forEach((btn) => {
        if (btn.dataset.slug == slug) {
          setInstallBtnText(btn);
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
  if (IDBManager.GetIDB() != null) {
    getInstallStatus();
    return;
  }
  const request = IDBManager.loadIDB("AluDB", 1);
  request.onerror = (event: Event) => {
    console.error("Database error: " + (event.target as any).errorCode);
  };
  request.onsuccess = () => {
    console.log("Database opened successfully");
    IDBManager.SetIDB(request.result);
    getInstallStatus();
  };
  request.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains("InstalledExtensions")) {
      db.createObjectStore("InstalledExtensions", { keyPath: "slug" });
      console.log("Database setup complete");
    }
  };
}
InitIDB();

document.addEventListener("astro:after-swap", () => {
  InitIDB();
});
