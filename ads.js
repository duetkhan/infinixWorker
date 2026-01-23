// Smartlinks
const SMARTLINK1 = "https://www.effectivegatecpm.com/mpae0kp3zc?key=554362a30b51a44282b343d46a59cd83";
const SMARTLINK2 = "https://www.effectivegatecpm.com/svxajpx9r?key=5efebfef466ae261927234ad76166944";

// Banner
function showBanner(id){
    const container = document.getElementById(id);
    container.innerHTML = `
    <script>
      atOptions = {
        'key' : 'b529261b98306ae1169a6bf5b991c3d4',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    <\/script>
    <script src="https://www.highperformanceformat.com/b529261b98306ae1169a6bf5b991c3d4/invoke.js"><\/script>
    `;
}

// Popunder
function showPopunderAd(){
    const s = document.createElement('script');
    s.src = "https://pl28546806.effectivegatecpm.com/b6/e2/25/b6e225daafa502cbf12bb14fdb9532f3.js";
    document.body.appendChild(s);
}

// Native Banner (4:1 layout)
function showNativeAd(){
    const container = document.createElement('div');
    container.id = "container-80507bc8e3d998279cd413247931169e";
    document.body.appendChild(container);

    const s = document.createElement('script');
    s.async = true;
    s.setAttribute("data-cfasync","false");
    s.src = "https://pl28546803.effectivegatecpm.com/80507bc8e3d998279cd413247931169e/invoke.js";
    document.body.appendChild(s);
}
