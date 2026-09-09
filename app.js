/* =========================================================
   INFINIX WORKER - APP.JS
   Smartlink + Local User/Balance
========================================================= */

const SMARTLINK_URL =
  "https://www.profitableratecpmnetwork.com/xujhdqwep?key=a7974e14e4446b0e7745df0efe2ed3e9";

const SMARTLINK_KEY = "iw_smartlink_last_open";

/*
  Minimum interval between Smartlink triggers.
  30 minutes = limited frequency.
*/
const SMARTLINK_COOLDOWN = 30 * 60 * 1000;


/* =========================================================
   LOCAL USER DATA
========================================================= */

function getUsername() {
  return localStorage.getItem("worker_username") || "Guest User";
}

function getBalance() {
  const value = parseFloat(
    localStorage.getItem("worker_balance") || "0"
  );

  return isNaN(value) ? 0 : value;
}

function setBalance(amount) {
  const value = Number(amount) || 0;

  localStorage.setItem(
    "worker_balance",
    value.toFixed(2)
  );

  updateBalanceDisplays();
}

function addBalance(amount) {
  const current = getBalance();

  setBalance(current + Number(amount || 0));
}


/* =========================================================
   USER DISPLAY
========================================================= */

function updateUserDisplays() {

  const username = getUsername();
  const balance = getBalance().toFixed(2);

  document.querySelectorAll("[data-username]").forEach(el => {
    el.textContent = username;
  });

  document.querySelectorAll("[data-balance]").forEach(el => {
    el.textContent = balance;
  });
}


function updateBalanceDisplays() {

  const balance = getBalance().toFixed(2);

  document.querySelectorAll("[data-balance]").forEach(el => {
    el.textContent = balance;
  });
}


/* =========================================================
   SMARTLINK COOLDOWN
========================================================= */

function canOpenSmartlink() {

  const lastOpen = parseInt(
    localStorage.getItem(SMARTLINK_KEY) || "0"
  );

  const now = Date.now();

  return (now - lastOpen) >= SMARTLINK_COOLDOWN;
}


/* =========================================================
   OPEN SMARTLINK
========================================================= */

function openSmartlink() {

  if (!canOpenSmartlink()) {
    return false;
  }

  localStorage.setItem(
    SMARTLINK_KEY,
    Date.now().toString()
  );

  /*
    Open in a new tab.
    User's original page remains available.
  */
  window.open(
    SMARTLINK_URL,
    "_blank",
    "noopener,noreferrer"
  );

  return true;
}


/* =========================================================
   NAVIGATION + SMARTLINK
========================================================= */

function smartNavigate(url) {

  /*
    First genuine navigation click:
    Smartlink may open if cooldown expired.
    
    Navigation itself always continues.
  */
  openSmartlink();

  setTimeout(() => {
    window.location.href = url;
  }, 150);

}


/* =========================================================
   BROWSER CARD
========================================================= */

function openBrowser() {

  smartNavigate("browser.html");

}


/* =========================================================
   VIDEO DOWNLOADER CARD
========================================================= */

function openVideoDownloader() {

  smartNavigate("video-downloader.html");

}


/* =========================================================
   PROFILE
========================================================= */

function openProfile() {

  smartNavigate("profile.html");

}


/* =========================================================
   MORE
========================================================= */

function openMore() {

  window.location.href = "more.html";

}


/* =========================================================
   TASK
========================================================= */

function openTask() {

  window.location.href = "task.html";

}


/* =========================================================
   MICRO TASK / OFFERWALL
========================================================= */

function openMicroTask() {

  window.location.href =
    "https://lsr-video-downloaders.vercel.app/offerwall.html";

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem("worker_username");

  localStorage.removeItem("worker_email");

  localStorage.removeItem("worker_logged_in");

  /*
    Balance/history are intentionally not deleted here.
    If your real authentication is added later,
    Supabase logout should be called here.
  */

  window.location.href = "index.html";

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  if (!localStorage.getItem("worker_balance")) {
    localStorage.setItem(
      "worker_balance",
      "0.00"
    );
  }

  if (!localStorage.getItem("worker_username")) {
    localStorage.setItem(
      "worker_username",
      "Guest User"
    );
  }

  updateUserDisplays();

});
