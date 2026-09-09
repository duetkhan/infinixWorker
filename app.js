/* =========================================
   INFINIX WORKER - APP.JS
========================================= */


/* =========================================
   DEMO BALANCE
========================================= */

let balance = Number(localStorage.getItem("worker_balance") || "0");

function updateBalance() {
  const balanceElement = document.getElementById("balance");

  if (balanceElement) {
    balanceElement.textContent = balance.toFixed(2);
  }

  localStorage.setItem("worker_balance", balance.toString());
}


/* =========================================
   ADSTERRA 320x50 BANNER
========================================= */

function loadBannerAd() {

  const container = document.getElementById("banner-ad-container");

  if (!container) return;

  const wrapper = document.createElement("div");

  wrapper.style.width = "320px";
  wrapper.style.height = "50px";
  wrapper.style.maxWidth = "100%";
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";
  wrapper.style.alignItems = "center";

  container.appendChild(wrapper);

  const script1 = document.createElement("script");

  script1.textContent = `
    atOptions = {
      'key' : 'b529261b98306ae1169a6bf5b991c3d4',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
  `;

  wrapper.appendChild(script1);

  const script2 = document.createElement("script");

  script2.src =
    "https://www.highrevenueformat.com/b529261b98306ae1169a6bf5b991c3d4/invoke.js";

  wrapper.appendChild(script2);
}


/* =========================================
   ADSTERRA NATIVE BANNER
========================================= */

function loadNativeAd() {

  const container =
    document.getElementById("native-ad-container");

  if (!container) return;

  const nativeWrapper = document.createElement("div");

  nativeWrapper.style.width = "100%";
  nativeWrapper.style.minHeight = "120px";

  container.appendChild(nativeWrapper);

  const script = document.createElement("script");

  script.async = true;
  script.setAttribute("data-cfasync", "false");

  script.src =
    "https://pl28546803.profitableratecpmnetwork.com/80507bc8e3d998279cd413247931169e/invoke.js";

  nativeWrapper.appendChild(script);

  const nativeContainer = document.createElement("div");

  nativeContainer.id =
    "container-80507bc8e3d998279cd413247931169e";

  nativeWrapper.appendChild(nativeContainer);
}


/* =========================================
   POPUNDER
========================================= */

function loadPopunder() {

  const script = document.createElement("script");

  script.src =
    "https://pl28546806.profitableratecpmnetwork.com/b6/e2/25/b6e225daafa502cbf12bb14fdb9532f3.js";

  script.async = true;

  document.body.appendChild(script);
}


/* =========================================
   SMARTLINK
========================================= */

const smartlink =
  "https://www.profitableratecpmnetwork.com/xujhdqwep?key=a7974e14e4446b0e7745df0efe2ed3e9";


let smartlinkOpened = false;

function openSmartlink() {

  /*
    Prevent repeated automatic opening
    from the same action.
  */

  if (smartlinkOpened) {
    return;
  }

  smartlinkOpened = true;

  window.open(
    smartlink,
    "_blank",
    "noopener,noreferrer"
  );

  /*
    Allow another Smartlink action
    after a short cooldown.
  */

  setTimeout(() => {
    smartlinkOpened = false;
  }, 3000);
}


/* =========================================
   START WORK
========================================= */

function startWork() {

  openSmartlink();

  setTimeout(() => {

    alert(
      "Available tasks will appear here."
    );

  }, 300);
}


/* =========================================
   WATCH AD
========================================= */

function watchAd() {

  openSmartlink();

  setTimeout(() => {

    alert(
      "Ad task started. Complete the task to earn coins."
    );

  }, 300);
}


/* =========================================
   WITHDRAW
========================================= */

function openWithdraw() {

  /*
    Temporary page behavior.
    We will build the actual Withdraw page
    in a later step.
  */

  window.location.href = "withdraw.html";
}


/* =========================================
   PROFILE
========================================= */

function openProfile() {

  window.location.href = "profile.html";
}


/* =========================================
   HOME
========================================= */

function goHome() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateBalance();

    loadBannerAd();

    loadNativeAd();

    loadPopunder();

  }
);
