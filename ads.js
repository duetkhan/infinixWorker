// Smartlinks
const SMARTLINK1 = "https://www.effectivegatecpm.com/mpae0kp3zc?key=554362a30b51a44282b343d46a59cd83";
const SMARTLINK2 = "https://www.effectivegatecpm.com/svxajpx9r?key=5efebfef466ae261927234ad76166944";

// Adsterra IDs
const BANNER_ID = 28446328;
const NATIVE_ID = 28446304;
const POPUNDER_ID = 28446307;

function showBanner(id){
    document.getElementById(id).innerHTML = `<iframe src="https://ad.adsterra.com/${BANNER_ID}" width="320" height="50" frameborder="0"></iframe>`;
}

function showPopundeeAd(){
    window.open(`https://ad.adsterra.com/${POPUNDER_ID}`,"_blank");
}

function showNativeAd(){
    const win = window.open(`https://ad.adsterra.com/${NATIVE_ID}`,"_blank","width=320,height=200");
    setTimeout(()=>win.close(),5000); // auto close after 5s
}
