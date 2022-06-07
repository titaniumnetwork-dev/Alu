AOS.init();
window.onload = (event) => {
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
            localStorage.setItem("tabIcon", "./img/icon.png")
        } else {
            document.title = "Alu's Unblocker"
        }
    } else {
        console.log("cloaking is enabled!")
        document.querySelector("link[rel*='icon']").href = localStorage.getItem('tabIcon');
        document.title = localStorage.getItem('tabName')
    }

    if (localStorage.getItem("footerHidden") == 'true') {
        checkboxTwo.checked = true;
        hideFooter();
    }
    if (localStorage.getItem('windowCloak') == "1") {
        checkboxThree.checked = true
    }

};
let checkbox = document.getElementById('checkbox')


function toastSuccess() {
    toastr["success"]("Cloak Successful!")
    toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "2000",
    "hideDuration": "900",
    "timeOut": "100",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
    }
}
function bruh() {
    console.log("sup")
    makeItHell();
}

function cloakTab() {
    let tabCloak = document.getElementById('tab-cloak').value;
    document.title = tabCloak;
    localStorage.setItem("cloakActive", 1)
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("tabName", tabCloak);
        toastSuccess()
      } else {
        console.log("%cError! No localStorage API Support!","color: red; background-color: white; font-size: 24px; font-family: monospace;");
        toastr["error"]("<p>Failed to add to localStorage!</p> <p style='text-decoration: underline;'>Try again later or try updating your browser!</p>")
        toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "900",
        "timeOut": "3000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    }
}
function changeIcon() {
    let iconUrl = document.getElementById('icn-change').value;
    console.log("Your new icon url is: " + iconUrl);
    localStorage.setItem("cloakActive", 1);
    document.querySelector("link[rel*='icon']").href = iconUrl;
    if (typeof(Storage) !== "undefined") {
    localStorage.setItem("tabIcon", iconUrl);
    toastSuccess();
      } else {
        console.log("%cError! No localStorage API Support!","color: red; background-color: white; font-size: 24px; font-family: monospace;");
        toastr["error"]("<p>Failed to add to localStorage!</p> <p style='text-decoration: underline;'>Try again later or try updating your browser!</p>")
        toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "900",
        "timeOut": "3000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    }
}
function resetCloaks() {
        console.log(document.getElementsByTagName("title")[0].text)
        localStorage.setItem("tabIcon", "./img/icon.svg")
        console.log("localStorage items reset to default!")
        document.title = "Settings";
        localStorage.setItem("tabName", document.getElementsByTagName("title")[0].text);
        document.querySelector("link[rel*='icon']").href = "./img/icon.svg";
        localStorage.setItem("cloakActive", 0)
}

//POPULAR CLOAKS 

function googleCloak() {
    localStorage.setItem("tabName", "Google")
    localStorage.setItem("cloakActive", 1)
    localStorage.setItem("tabIcon", "https://google.com/favicon.ico")
    document.title = "Google"
    document.querySelector("link[rel*='icon']").href = "https://google.com/favicon.ico";
    toastSuccess()
}
function googleClassroomCloak() {
    localStorage.setItem("tabName", "Google Classroom")
    localStorage.setItem("cloakActive", 1)
    localStorage.setItem("tabIcon", "https://ssl.gstatic.com/classroom/favicon.png")
    document.title = "Google Classroom"
    document.querySelector("link[rel*='icon']").href = "https://ssl.gstatic.com/classroom/favicon.png";
    toastSuccess()
}
function driveCloak() {
    localStorage.setItem("tabName", "Google Drive")
    localStorage.setItem("cloakActive", 1)
    localStorage.setItem("tabIcon", "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png")
    document.title = "Google Drive"
    document.querySelector("link[rel*='icon']").href = "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
    toastSuccess()
}
function canvasCloak() {
    localStorage.setItem("tabName", "Dashboard")
    localStorage.setItem("cloakActive", 1)
    localStorage.setItem("tabIcon", "https://instructure-uploads.s3.amazonaws.com/account_21430000000000001/attachments/555889/favicon.ico?AWSAccessKeyId=AKIAJFNFXH2V2O7RPCAA&Expires=1937131715&Signature=tP2Va13xUp6AuI4ridXPQab5DMg%3D&response-cache-control=Cache-Control%3Amax-age%3D473364000.0%2C%20public&response-expires=473364000.0")
    document.title = "Dashboard"
    document.querySelector("link[rel*='icon']").href = "https://instructure-uploads.s3.amazonaws.com/account_21430000000000001/attachments/555889/favicon.ico?AWSAccessKeyId=AKIAJFNFXH2V2O7RPCAA&Expires=1937131715&Signature=tP2Va13xUp6AuI4ridXPQab5DMg%3D&response-cache-control=Cache-Control%3Amax-age%3D473364000.0%2C%20public&response-expires=473364000.0";
    toastSuccess()
}
