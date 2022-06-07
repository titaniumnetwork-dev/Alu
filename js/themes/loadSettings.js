var cssId = 'main';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link') 
{
let linkref = localStorage.getItem('siteTheme')
let head  = document.getElementsByTagName('head')[0];
let link  = document.createElement('link');
link.href = "/css/" + linkref + "/settings.css"
link.type = 'text/css';
link.id   = cssId;
link.rel  = 'stylesheet';
head.appendChild(link);
}

var cssId = 'boilerplate';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link') 
{
let linkref = localStorage.getItem('siteTheme')
let head  = document.getElementsByTagName('head')[0];
let link  = document.createElement('link');
link.href = "/css/" + linkref + "/boilerplate.css"
link.type = 'text/css';
link.id   = cssId;
link.rel  = 'stylesheet';
head.appendChild(link);
}

if (localStorage.getItem('siteTheme') == "rainbow") {
    var script = document.createElement('script');
    script.onload = function () {
        //do stuff with the script
    };
    script.src = "/js/site/rainbow.js";

    document.head.appendChild(script); //or something of the likes
}


