// AlusUB Themes by wearr
// pls don't copy my work ❤️

//Init
window.onload = (event) => {
    let themeInit = localStorage.getItem("themeInit");
    if (!themeInit) {
        // Theme Not Init! 
        // Initializing Now!
        localStorage.setItem('themeInit', "1") // Theme Init Success!
        localStorage.setItem("siteTheme", "dark")
    } else {
        console.log('ThemeInit Already Initialized!')
    }
}

//Theme Selector

let activated = "false"
function dropdown() {
    if (activated == "false") { // Must be closed
        activated = "true"
        document.getElementById('item-wrapper').style.height = "240px"
        setTimeout(() => {
        document.getElementById('item').style.display = "flex"
        document.getElementById('item').style.opacity = "100"
        document.getElementById('item').style.border = "2px solid white"
        }, 50);
        setTimeout(() => {
        document.getElementById('item-2').style.display = "flex"
        document.getElementById('item-2').style.opacity = "100"
        document.getElementById('item-2').style.border = "2px solid white"
        }, 150);
        setTimeout(() => {
        document.getElementById('item-3').style.display = "flex"
        document.getElementById('item-3').style.opacity = "100"
        document.getElementById('item-3').style.border = "2px solid white"
        }, 200);
        setTimeout(() => {
            document.getElementById('item-4').style.display = "flex"
            document.getElementById('item-4').style.opacity = "100"
            document.getElementById('item-4').style.border = "2px solid white"
        }, 250);
    } else {  // Activated must equal true
        activated = "false"
        document.getElementById('item-wrapper').style.height = "0px"
        setTimeout(() => {
        document.getElementById('item').style.display = "none"
        document.getElementById('item').style.opacity = "0"
        document.getElementById('item').style.border = "none"
        }, 200);
        setTimeout(() => {
        document.getElementById('item-2').style.display = "none"
        document.getElementById('item-2').style.opacity = "0"
        document.getElementById('item-2').style.border = "none"
        }, 150);
        setTimeout(() => {
        document.getElementById('item-3').style.display = "none"
        document.getElementById('item-3').style.opacity = "0"
        document.getElementById('item-3').style.border = "none"
        }, 50);
        setTimeout(() => {
        document.getElementById('item-4').style.display = "none"
        document.getElementById('item-4').style.opacity = "0"
        document.getElementById('item-4').style.border = "none"
        }, 50);
    }
}
function dark() {
    localStorage.setItem('siteTheme', "dark");
    window.location.reload();
}
function light() {
    localStorage.setItem('siteTheme', "light");
    window.location.reload();
}
function nocss() {
    localStorage.setItem('siteTheme', "noCSS");
    window.location.reload();
}
function rainbowVomit() {
    if(confirm("FLASHING LIGHTS WARNING!!! \nALU TAKES NO RESPONSIBILITY FOR ANY HEALTH ISSUES") == true) {
        console.log("loading rainbow");
        localStorage.setItem('siteTheme', "rainbow");
        window.location.reload();
    } else {
        console.log('Load cancelled.');
    }
}