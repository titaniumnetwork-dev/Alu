const a = window.location.pathname.split("/").pop();

if (a && UnityLoader) {
  let t = function () {
      setTimeout(() => {
        n.Module.canvas.style.height = "100%"
      }, 1000)
      requestAnimationFrame(t)
  };
  // UnityLoader.Error.handler = e => {
  //   throw document.querySelector("#loader").classList.add("hidden"),
  //   document.querySelector("#error").classList.remove("hidden"),
  //   e
  // };
  const n = UnityLoader.instantiate("gameContainer", `/games/${a}/data.json`, {
    onProgress: (e, r) => { },
    Module: {
      onRuntimeInitialized: () => {
        document.querySelector("#loader").classList.add("hidden"),
          document.querySelector("#gameContainer").classList.remove("hidden")
      }
      ,
      wasmRequest: function (e, r) {
        e(this.wasmBinary).then(function (o) {
          r(o.instance)
        })
      },
      print: () => { },
      printErr: () => { }
    }
  });
  requestAnimationFrame(t)
} else
  document.querySelector("#loader").classList.add("hidden"),
  document.querySelector("#error").classList.remove("hidden");
