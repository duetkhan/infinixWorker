// Smartlinks
const SMARTLINK1 = "https://www.effectivegatecpm.com/mpae0kp3zc?key=554362a30b51a44282b343d46a59cd83";
const SMARTLINK2 = "https://www.effectivegatecpm.com/svxajpx9r?key=5efebfef466ae261927234ad76166944";

// Adsterra IDs
const BANNER_ID = 28446328;
const NATIVE_ID = 28446304;
const POPUNDER_ID = 28446307;

// Banner
function showBanner(id){
    var container = document.getElementById(id);
    container.innerHTML = '';
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://www.adsterra.com/track.js?id=' + BANNER_ID;
    container.appendChild(s);
}

// Popunder
function showPopunderAd(){
    // Popunder trigger
    var pop = window.open('https://www.adsterra.com/popunder?id=' + POPUNDER_ID, '_blank');
    if(pop) pop.blur();      // Background
    window.focus();           // Return focus to main window
}

// Native
function showNativeAd(){
    var container = document.createElement('div');
    container.id = 'adsterra-native-popup';
    document.body.appendChild(container);
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://www.adsterra.com/native.js?id=' + NATIVE_ID;
    container.appendChild(s);
}
