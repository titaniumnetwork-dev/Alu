AOS.init();
window.onload = (event) => {
if (typeof localStorage !== 'undefined') {
    var firstTime = localStorage.getItem("first_time");
        if(!firstTime) {
        // first time loaded!
        resetCloaks();
        localStorage.setItem("first_time","1");
        console.log("first time loaded!")
        localStorage.setItem("cloakActive", 0)
    }
        if (localStorage.getItem("cloakActive") == 0) {
            if (localStorage.getItem("tabName") != null) {
                localStorage.setItem("tabName", document.getElementsByTagName("title")[0].text)
                localStorage.setItem("tabIcon", "./img/icon.svg")
            } else {
                document.title = "Alu's Unblocker"
            }
        } else {
            console.log("cloaking is enabled!")
            document.querySelector("link[rel*='icon']").href = localStorage.getItem('tabIcon');
            document.title = localStorage.getItem('tabName')
        }

        if (localStorage.getItem("footerHidden") == 'true') {
            hideFooter();
        }
        } else {
            console.log('no localstorage API exists!')
        }
}
// Smaller Screen Navigation ( Less than 1080p :D ) 
function showMobileNav() {
    setTimeout(() => {
    document.getElementById('mobile-header').style.maxHeight = "40vh";
    document.getElementById('nav-icon').style.display = "none"
    document.getElementById('mobile-header').style.transition = "max-height 350ms ease-in"
}, 400);
    document.getElementById('nav-toggle').style.marginRight = "-50%"
    document.getElementById('nav-toggle-disable').style.display = "flex"
    document.getElementById('nav-toggle-disable').style.top = "3%"
}
function hideMobileNav() {
    document.getElementById('mobile-header').style.maxHeight = "0vh";
    document.getElementById('nav-toggle-disable').style.top = "-10%"
    document.getElementById('nav-toggle').style.marginRight = "0.1%"
    setTimeout(() => {
        document.getElementById('nav-icon').style.display = "flex"
    }, 400);
}
function copyDiscord() {
    var tooltip = document.getElementById("myTooltip")
    navigator.clipboard.writeText("wearr#4222");
    tooltip.innerHTML = "Copied!"
}
function outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy";
}