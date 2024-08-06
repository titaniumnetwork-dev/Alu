import AluStore from "./AluStore";

function instantiateAlu() {
  if (globalThis.Alu) return;
  globalThis.Alu = {
    store: new AluStore(),
    loadedContentStorage: {},
  };
}

export default instantiateAlu;