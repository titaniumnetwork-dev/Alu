// AlusUB Themes by wearr
// pls don't copy my work ❤️

//Init
window.onload = (event) => {
    let themeInit = localStorage.getItem("themeInit");
    if (!themeInit) {
        // Theme Not Init! 
        // Initializing Now!
        localStorage.setItem('themeInit', "1") // Theme Init Success!
        localStorage.setItem("siteTheme", "Dark")
    } else {
        console.log('ThemeInit Already Initialized!')
    }
}

//Theme Selector

function changeTheme() {
    let theme = document.getElementById('themes').value
    localStorage.setItem('siteTheme', document.getElementById('themes').value)
    if (localStorage.getItem('siteTheme') == "Dark") {
        console.log('Dark theme selected!')
    }
    if (localStorage.getItem('siteTheme') == "Light") {
        console.log('Light!')
    }
    document.getElementById('themes').value = ""
}






// AAAAAAAAAAAAAAAAAAAAAAAAa
function lightTheme() {
    document.getElementById('body').style.backgroundColor = "#FFFFFF"
    document.getElementById('body').style.transition = "350ms ease-in-out"
    // index theme
    document.getElementById('title-background').style.backgroundColor = "#FF0266"
    document.getElementById('sidenav').style.backgroundColor = "#000000"
    document.getElementById('card').style.backgroundColor = "#FF0266"
    document.getElementById('gi-title').style.color = "rgb(51, 51, 51)"
    document.getElementById('gi-card').style.backgroundColor = "#FF0266"
    document.getElementById('title-text').style.color = "rgb(51, 51, 51)"
    document.getElementById('subtitle-text').style.color = "rgb(71 71 71)"
    document.getElementById('proxies-button').style.color = "rgb(71 71 71)"
    document.getElementById('proxies-button').style.borderColor = "#FF0266"

    document.getElementById('footer').style.backgroundImage = "url(/img/lightwaves.svg)"
    setTimeout(() => {
        document.getElementById('body').style.transition = ""
    }, 400);
}
