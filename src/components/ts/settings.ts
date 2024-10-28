// Alu.settings.loadedContentStorage = {};
document.addEventListener("astro:before-swap", () => {
  Alu.settings.currentTab = "";
  Alu.settings.loadedContentStorage = {};
});
settingsLoad();
loadContent("setting-tab-proxy");
function settingsLoad() {
  Array.from(document.getElementsByClassName("setting-tab")).forEach((tab) => {
    const contentToLoad = document.getElementById("content-" + tab.id);
    if (contentToLoad) {
      Alu.settings.loadedContentStorage[tab.id] = contentToLoad.innerHTML;
      contentToLoad.remove();
    }

    tab.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLElement;
      loadContent(target.id);
    });
  });
}
function loadContent(tabID: string) {
  if (Alu.settings.currentTab == tabID) return;
  else Alu.settings.currentTab = tabID;
  const currentContent = document.getElementById("current-content");
  if (currentContent) {
    currentContent.style.opacity = "0";
    setTimeout(() => {
      currentContent.innerHTML = Alu.settings.loadedContentStorage[tabID];
      currentContent.style.opacity = "1";
      document.dispatchEvent(new CustomEvent("setting-tabLoad", { detail: tabID }));
    }, 250);
  }
}

function addDropdownListener() {
  const dropdown_toggles = document.getElementsByClassName("dropdown-toggle") as HTMLCollectionOf<HTMLElement>;
  Array.from(dropdown_toggles).forEach((toggle) => {
    toggle.onclick = function () {
      closeOtherDropdowns(toggle.id);
      toggleDropdown(toggle);
    };
  });
}

function toggleDropdown(toggle: HTMLElement) {
  const dropdown = document.getElementById(toggle.id + "-menu")!;
  if (dropdown.style.maxHeight == "0px" || dropdown.style.maxHeight == "") {
    dropdown.style.maxHeight = dropdown.scrollHeight + "px";
    toggle.style.borderRadius = "10px 10px 0 0";
  } else {
    dropdown.style.maxHeight = "0px";
    setTimeout(() => {
      toggle.style.borderRadius = "10px";
    }, 300);
  }
}

function closeOtherDropdowns(dropdownIDToExclude: string) {
  const dropdowns = document.getElementsByClassName("dropdown-menu") as HTMLCollectionOf<HTMLElement>;
  Array.from(dropdowns).forEach((dropdown) => {
    dropdown.style.maxHeight = "0px";
    setTimeout(() => {
      if (dropdown.id != dropdownIDToExclude + "-menu") {
        const dropdown_toggle = document.getElementById(dropdown.id.replace("-menu", ""))!;
        dropdown_toggle.style.borderRadius = "10px";
      }
    }, 300);
  });
}

function closeDropdown(dropdownID: string) {
  const dropdown = document.getElementById(dropdownID);
  if (dropdown) {
    dropdown.style.maxHeight = "0px";
    setTimeout(() => {
      const dropdown_toggle = document.getElementById(dropdownID.replace("-menu", ""))!;
      dropdown_toggle.style.borderRadius = "10px";
    }, 300);
  }
}

function getLocalStorageValue(localStorageItem: Alu.ValidStoreKeys, dropdownID: string): string | null {
  const dropdown = document.getElementById(dropdownID);
  const dropdownMenu = document.getElementById(dropdownID + "-menu") as HTMLElement;
  // Janky hack
  if (dropdownID == "dropdown__search-engine") {
    return Alu.store.get(localStorageItem).name;
  }

  if (dropdown && dropdownMenu) {
    // Find the child that matches localStorageItem.value.
    const dropdownItem = Array.from(dropdownMenu.children).find((dropdown) => {
      const itemEl = dropdown as HTMLElement;
      const item = Alu.store.get(localStorageItem);
      const find = item.value == itemEl.dataset.setting;
      if (!find && localStorageItem == "wisp" && item.isCustom) {
        // This means we are on localhost, default to custom and return it's innerText (This is a hack)
        if (!item.isCustom) {
          const wispInput = document.getElementById("wisp-url-input") as HTMLInputElement;
          Alu.store.set("wisp", { name: "Custom", value: wispInput.value, isCustom: true });
        }

        return itemEl.innerText === "Custom";
      }
      return find;
    }) as HTMLElement;
    // Set the inner text to the name in the dropdownItem.
    if (dropdownItem) {
      return dropdownItem.innerText;
    } else {
      console.error("Dropdown item not found! " + dropdownID);
      return null;
    }
  }
  console.error("Dropdown not found! " + dropdownID);
  return null;
}

function applySavedLocalStorage(localStorageItem: Alu.ValidStoreKeys, dropdownID: string) {
  const dropdown_toggle = document.getElementById(dropdownID) as HTMLElement;
  if (dropdown_toggle && Alu.store.get(localStorageItem)) {
    dropdown_toggle.innerText = getLocalStorageValue(localStorageItem, dropdownID)!;
  }
}

function applyDropdownEventListeners(dropdown: HTMLElement | null, optionalCallback?: () => void) {
  if (!dropdown) return console.error(`Dropdown not found! ${dropdown}`);
  const dropdownSibling = document.getElementById(dropdown.id + "-menu")!;
  const localStorageItem = dropdown.dataset.localStorageKey as Alu.ValidStoreKeys;
  Array.from(dropdownSibling.children).forEach((child) => {
    const childEl = child as HTMLElement;
    childEl.onclick = () => {
      const localStorageItemContent: Alu.KeyObj = {
        name: childEl.innerText,
        value: childEl.dataset.setting,
      };
      Alu.store.set(localStorageItem, localStorageItemContent);
      applySavedLocalStorage(localStorageItem, dropdown.id);
      closeDropdown(dropdownSibling.id);
      return optionalCallback?.();
    };
  });
}

function applyInputListeners(inputs: HTMLInputElement[], localStorageItem: Alu.ValidStoreKeys[]) {
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    input.addEventListener("input", () => {
      const current = Alu.store.get(localStorageItem[i]);
      const value: Alu.KeyObj = {
        name: current.name,
        value: input.value,
      };
      if (localStorageItem[i] == "wisp") {
        value.isCustom = true;
      }
      Alu.store.set(localStorageItem[i], value);
    });
  }
}

// function searxngURLInputListener(input: HTMLInputElement) {
//   input.addEventListener("input", () => {
//     Alu.store.set("search", { name: "Searx", value: input.value + "?q=" });
//   });
// }

function addThemeToDropdown(extension: ExtensionMetadata) {
  const dropdown = document.getElementById("dropdown__selected-theme-menu");
  if (dropdown) {
    // TODO: Figure out why addThemeToDropdown is being called 6 times
    // This when you go from another page and back to settings->customization.
    const duplicateItem = Array.from(dropdown.children).find((item) => {
      const itemEl = item as HTMLElement;
      return itemEl.dataset.setting == extension.themeName;
    });
    if (duplicateItem) return;
    const themeItem = document.createElement("li");
    themeItem.classList.add("dropdown-item");
    themeItem.dataset.setting = extension.themeName;
    themeItem.textContent = extension.title;
    dropdown.appendChild(themeItem);
  }
}

function setupProxySettings() {
  applySavedLocalStorage("proxy", "dropdown__selected-proxy");
  applySavedLocalStorage("search", "dropdown__search-engine");
  applySavedLocalStorage("openpage", "dropdown__open-with");
  applySavedLocalStorage("wisp", "dropdown__wisp-url");
  applySavedLocalStorage("transport", "dropdown__transport");
  // Dropdowns
  const selectedProxyDropdown = document.getElementById("dropdown__selected-proxy");
  const searchEngineDropdown = document.getElementById("dropdown__search-engine");
  const openWithDropdown = document.getElementById("dropdown__open-with");
  const currentTransportDropdown = document.getElementById("dropdown__transport");
  const wispURLDropdown = document.getElementById("dropdown__wisp-url");

  const resetSettings = document.getElementById("reset-button");
  if (resetSettings) {
    resetSettings.onclick = () => {
      localStorage.removeItem("AluStore");
      window.location.reload();
    };
  }

  // Inputs
  const wispURLInput = document.getElementById("wisp-url-input") as HTMLInputElement;
  const searxngUrlInput = document.getElementById("searxng-url-input") as HTMLInputElement;
  const bareURLInput = document.getElementById("bare-url-input") as HTMLInputElement;

  bareURLInput.value = Alu.store.get("bareUrl").value!.toString();
  wispURLInput.value = Alu.store.get("wisp").value!.toString();
  // Proxy settings
  [selectedProxyDropdown, openWithDropdown, currentTransportDropdown, wispURLDropdown].forEach((dropdown) => {
    applyDropdownEventListeners(dropdown!);
  });
  applyDropdownEventListeners(wispURLDropdown, checkCustomWisp);
  applyDropdownEventListeners(searchEngineDropdown, checkSearxng);
  checkCustomWisp();
  checkSearxng();

  // searxngURLInputListener(searxngUrlInput);
  applyInputListeners([bareURLInput, wispURLInput, searxngUrlInput], ["bareUrl", "wisp", "search"]);
}

function setupCustomizationSettings() {
  const store = window.idb.transaction("InstalledExtensions", "readonly").objectStore("InstalledExtensions");
  store.getAll().onsuccess = (event) => {
    const result = (event.target as IDBRequest).result;
    if (result) {
      result.forEach((extension: ExtensionMetadata) => {
        if (extension.type === "theme" && extension.themeName) {
          // Create a dropdown item for the theme
          addThemeToDropdown(extension);
        }
      });
    }
    applySavedLocalStorage("theme", "dropdown__selected-theme");
    applySavedLocalStorage("lang", "dropdown__selected-language");

    const themeDropdown = document.getElementById("dropdown__selected-theme");
    const languageDropdown = document.getElementById("dropdown__selected-language");
    applyDropdownEventListeners(themeDropdown!, changeTheme);
    applyDropdownEventListeners(languageDropdown!, navigateToNewLangaugePage);
  };
}

function setupCloakingSettings() {
  Array.from(document.getElementById("cloak-list")!.children).forEach((cloak) => {
    cloak.addEventListener("click", () => {
      const cloakEl = cloak as HTMLElement;
      let cloakName = cloakEl.dataset.cloakName;
      let cloakIcon = cloakEl.dataset.cloakIcon;

      const cloakItem = {
        name: cloakName!,
        value: "",
        icon: cloakIcon!,
        isCustom: false,
      };
      Alu.store.set("cloak", cloakItem);

      if (cloakName == "None") {
        Alu.store.remove("cloak");
        cloakName = "Settings | Alu";
        cloakIcon = "/favicon.svg";
      }
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = cloakIcon!;
      document.title = cloakName!;

      if (!cloak.classList.contains("selected")) {
        Array.from(document.getElementById("cloak-list")!.children).forEach((cloak2) => {
          cloak2.classList.remove("selected");
        });
        cloak.classList.add("selected");
      }
    });
  });

  const customNameInput = document.getElementById("cloak-custom-name-input") as HTMLInputElement;
  const customFaviconInput = document.getElementById("cloak-custom-favicon-input") as HTMLInputElement;
  const cloak = Alu.store.get("cloak");
  if (cloak && cloak.value) {
    if (cloak.isCustom) {
      customNameInput.value = cloak.name;
      customFaviconInput.value = cloak.icon!;
    }
  }

  document.getElementById("cloak-custom-button")!.addEventListener("click", () => {
    const cloakCustomName = document.getElementById("cloak-custom-name-input") as HTMLInputElement;
    const cloakCustomFavicon = document.getElementById("cloak-custom-favicon-input") as HTMLInputElement;
    let cloakName = cloakCustomName.value;
    let cloakIcon = cloakCustomFavicon.value;
    const cloakItem = {
      name: cloakName,
      value: "",
      icon: cloakIcon,
      isCustom: true,
    };

    Alu.store.set("cloak", cloakItem);
    if (cloakName == "None") {
      Alu.store.remove("cloak");
      cloakName = "Settings | Alu";
      cloakIcon = "/favicon.svg";
    }
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = cloakIcon;
    document.title = cloakName;
  });
}

function changeTheme() {
  const theme = Alu.store.get("theme").value;
  document.documentElement.setAttribute("data-theme", theme!.toString());
}

function setupSettings(event: CustomEvent) {
  addDropdownListener();
  if (event.detail == "setting-tab-proxy") {
    setupProxySettings();
  } else if (event.detail == "setting-tab-customization") {
    setupCustomizationSettings();
  } else if (event.detail == "setting-tab-cloaking") {
    setupCloakingSettings();
  }
}

function checkSearxng() {
  // Callback for search engine dropdown
  const searchEngine = Alu.store.get("search");
  const searxInput = document.getElementsByClassName("setting__searxng-url")[0] as HTMLElement;
  if (searchEngine.name == "Searx") {
    searxInput.style.opacity = "1";
  } else {
    searxInput.style.opacity = "0";
  }
}

function checkCustomWisp() {
  const wispURL = Alu.store.get("wisp").name;
  const wispInput = document.getElementById("wisp-url-input") as HTMLInputElement;
  if (wispURL == "Custom") {
    wispInput.parentElement!.style.opacity = "1";
    wispInput.value = Alu.store.get("wisp").value!.toString();
  } else {
    wispInput.parentElement!.style.opacity = "0";
  }
}

document.addEventListener("setting-tabLoad", (event) => {
  setupSettings(event);
});

function navigateToNewLangaugePage() {
  const value = Alu.store.get("lang").value;
  const currentLanguage = window.location.pathname.split("/")[1];
  if (value == currentLanguage) return;
  window.location.href = `/${value}/settings`;
}
document.addEventListener("astro:after-swap", () => {
  settingsLoad();
  loadContent("setting-tab-proxy");
});
loadContent("setting-tab-proxy");
settingsLoad();
