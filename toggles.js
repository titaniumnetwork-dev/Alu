window.onload = (event) => { 

}
let footerHidden = false;
function checkedTwo() {
    if (checkboxTwo.checked !== true) {
        hideFooter();
    } else {
        showFooter();
    }
}

function checked() {
    if (checkbox.checked !== true) {
        console.log("enabled!")
    } else {
        console.log("disabled!")
    }
}

function checkedThree() {
    if (checkboxThree.checked !== true) {
        localStorage.setItem('windowCloak', "1")
        window.location.reload();
    } else {
        localStorage.setItem('windowCloak', "0")
    }
}


function hideFooter() {
    document.getElementById('footer').style.display = "none"
    footerHidden = true;
    localStorage.setItem("footerHidden", 'true')
}

function showFooter() {
    document.getElementById('footer').style.display = ""
    footerHidden = false;
    localStorage.setItem("footerHidden", 'false')
}
