const id = window.location.pathname.split("/").pop();
id && RufflePlayer ? window.addEventListener("load", ()=>{
    const e = RufflePlayer.newest().createPlayer();
    e.config = {
        preloader: !1,
        splashScreen: !1,
        unmuteOverlay: "hidden",
        autoplay: "on",
        contextMenu: !1,
        showSwfDownload: !1
    },
    e.style.width = "100%",
    e.style.height = "100%";
    const a = document.querySelector("#gameContainer");
    a == null || a.appendChild(e),
    e.load(`/games/flash/${id}.swf`).then(()=>{
        document.querySelector("#loader").classList.add("hidden"),
        document.querySelector("#gameContainer").classList.remove("hidden")
    }
    ).catch(o=>{
        console.log(o)
    }
    )
}
) : (document.querySelector("#loader").classList.add("hidden"),
document.querySelector("#error").classList.remove("hidden"));