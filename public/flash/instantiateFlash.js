const id = window.location.pathname.split("/").pop();
if (id && RufflePlayer) {
    document.title = `Flash Game - ${id}`;
    window.addEventListener("load", loadRuffle);
} else {
    document.querySelector("#loader").classList.add("hidden");
    document.querySelector("#error").classList.remove("hidden");
}

function loadRuffle() {
  const ruffle = RufflePlayer.newest().createPlayer();
  ruffle.config = {
      splashScreen: false,
      unmuteOverlay: "hidden",
      autoplay: "on",
      contextMenu: "on",
      showSwfDownload: false
  };
  ruffle.style.width = "100%";
  ruffle.style.height = "100%";
  const gameContainer = document.querySelector("#gameContainer");
  if (gameContainer != null) {
      gameContainer.appendChild(ruffle);
  }
  ruffle.load(`/games/flash/${id}.swf`).then(() => {
      let loader = document.querySelector("#loader");
      loader.classList.remove("loading");
      loader.classList.add("hidden");
      document.querySelector("#gameContainer").classList.remove("hidden");
  });
  // Stop the event listener, saves miniscule amount of memory
  window.removeEventListener("load", loadRuffle);
}