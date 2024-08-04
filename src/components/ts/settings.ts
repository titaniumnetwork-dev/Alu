window.loadedContentStorage = {};
window.currentlySelectedTab;
document.addEventListener("astro:before-swap", () => {
  window.currentlySelectedTab = "";
});
function settingsLoad() {
  Array.from(document.getElementsByClassName("setting-tab")).forEach((tab) => {
    const contentToLoad = document.getElementById("content-" + tab.id);
    if (contentToLoad) {
      window.loadedContentStorage[tab.id] = contentToLoad.innerHTML;
      contentToLoad.remove();
    }

    tab.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLElement;
      loadContent(target.id);
    });
  });
}
function loadContent(tabID: string) {
  if (window.currentlySelectedTab == tabID) return;
  else window.currentlySelectedTab = tabID;
  const currentContent = document.getElementById("current-content");
  if (currentContent) {
    currentContent.style.opacity = "0";
    setTimeout(() => {
      currentContent.innerHTML = window.loadedContentStorage[tabID];
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

function getLocalStorageValue(localStorageItem: Alu.ValidStoreKeys, dropdownID: string) {
  // I was kinda dumb for not doing this earlier.
  const dropdown = document.getElementById(dropdownID);
  const dropdownMenu = document.getElementById(dropdownID + "-menu") as HTMLElement;

  if (dropdown && dropdownMenu) {
    // Now we find the child that matches localStorageItem.value.
    const dropdownItem = Array.from(dropdownMenu.children).find((item) => {
      const itemEl = item as HTMLElement;
      return Alu.store.get(localStorageItem).value == itemEl.dataset.setting;
    }) as HTMLElement;
    // Now set the inner text to the name in the dropdownItem.
    return dropdownItem.innerText;
  }
}

function applySavedLocalStorage(localStorageItem: Alu.ValidStoreKeys, dropdownID: string) {
  if (Alu.store.get(localStorageItem)) {
    const dropdown_toggle = document.getElementById(dropdownID) as HTMLElement;
    if (dropdown_toggle) {
      dropdown_toggle.innerText = getLocalStorageValue(localStorageItem, dropdownID)!;
    }
  }
}

function applyDropdownEventListeners(dropdown: HTMLElement, optionalCallback?: () => void) {
  const dropdownSibling = document.getElementById(dropdown.id + "-menu")!;
  const localStorageItem = dropdown.dataset.localStorageKey as Alu.ValidStoreKeys;
  Array.from(dropdownSibling.children).forEach((child) => {
    const childEl = child as HTMLElement;
    childEl.onclick = () => {
      const localStorageItemContent: Alu.Key = {
        name: childEl.innerText,
        value: childEl.dataset.setting!,
      };
      Alu.store.set(localStorageItem, localStorageItemContent);
      applySavedLocalStorage(localStorageItem, dropdown.id);
      closeDropdown(dropdownSibling.id);
      if (typeof optionalCallback === "function") {
        optionalCallback();
      }
    };
  });
}

function applyInputListeners(input: HTMLInputElement, localStorageItem: Alu.ValidStoreKeys) {
  input.addEventListener("input", () => {
    Alu.store.set(localStorageItem, { value: input.value });
  });
}

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

loadContent("setting-tab-proxy");

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

  // Inputs
  const searxngUrlInput = document.getElementById("searxng-url-input") as HTMLInputElement;
  const bareURLInput = document.getElementById("bare-url-input") as HTMLInputElement;

  bareURLInput.value = Alu.store.get("bareUrl").value.toString();
  // Proxy settings
  [selectedProxyDropdown, openWithDropdown, currentTransportDropdown, wispURLDropdown].forEach((dropdown) => {
    applyDropdownEventListeners(dropdown!);
  });
  applyDropdownEventListeners(searchEngineDropdown!, checkSearxng);
  checkSearxng();

  applyInputListeners(searxngUrlInput, "searxng");
  applyInputListeners(bareURLInput, "bareUrl");
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
        name: cloakName,
        value: {
          name: cloakName,
          icon: cloakIcon,
          isCustom: false,
        },
        // eeyikes, make this better later.
      } as unknown as Alu.Key;
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
  const cloak = Alu.store.get("cloak") as Alu.Key;
  if (cloak && typeof cloak.value == "object") {
    if (cloak.value.isCustom) {
      customNameInput.value = cloak.value.name;
      customFaviconInput.value = cloak.value.icon;
    }
  }

  document.getElementById("cloak-custom-button")!.addEventListener("click", () => {
    const cloakCustomName = document.getElementById("cloak-custom-name-input") as HTMLInputElement;
    const cloakCustomFavicon = document.getElementById("cloak-custom-favicon-input") as HTMLInputElement;
    let cloakName = cloakCustomName.value;
    let cloakIcon = cloakCustomFavicon.value;
    const cloakItem = {
      name: cloakName,
      icon: cloakIcon,
      isCustom: true,
    };
    // @ts-expect-error - Need to make cloak typing more standardized.
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
  document.documentElement.setAttribute("data-theme", theme.toString());
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
  if (searchEngine.value == "searx") {
    searxInput.style.opacity = "1";
  } else {
    searxInput.style.opacity = "0";
  }
}

document.addEventListener("setting-tabLoad", (event) => {
  // I hate doing this :/
  setupSettings(event as CustomEvent);
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
settingsLoad();