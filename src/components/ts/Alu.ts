import AluStore from "./AluStore";

function instantiateAlu() {
  if (globalThis.Alu) return;
  globalThis.Alu = {
    store: new AluStore(),
    settings: {
      loadedContentStorage: {},
      currentTab: "",
    }
  };
}

export default instantiateAlu;