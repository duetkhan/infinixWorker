// SMARTLINK
const SMARTLINK1 = "https://www.effectivegatecpm.com/mpae0kp3zc?key=554362a30b51a44282b343d46a59cd83";
const SMARTLINK2 = "https://www.effectivegatecpm.com/svxajpx9r?key=5efebfef466ae261927234ad76166944";

/* ============ BANNER 320x50 ============ */
function showBanner(containerId){
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    window.atOptions = {
        'key' : 'b529261b98306ae1169a6bf5b991c3d4',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highperformanceformat.com/b529261b98306ae1169a6bf5b991c3d4/invoke.js";
    container.appendChild(script);
}

/* ============ POPUNDER ============ */
function showPopunderAd(){
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://pl28546806.effectivegatecpm.com/b6/e2/25/b6e225daafa502cbf12bb14fdb9532f3.js";
    document.body.appendChild(script);
}

/* ============ NATIVE BANNER ============ */
function showNativeAd(){
    const container = document.createElement("div");
    container.id = "container-80507bc8e3d998279cd413247931169e";
    document.body.appendChild(container);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync","false");
    script.src = "https://pl28546803.effectivegatecpm.com/80507bc8e3d998279cd413247931169e/invoke.js";
    document.body.appendChild(script);
}
