/* =========================================================
   INFINIX WORKER - APP.JS
   Core App System
   Login + Signup + Device User + Balance + Smartlink
========================================================= */


/* =========================================================
   SMARTLINK
========================================================= */

const SMARTLINK_URL =
  "https://www.profitableratecpmnetwork.com/xujhdqwep?key=a7974e14e4446b0e7745df0efe2ed3e9";

const SMARTLINK_KEY =
  "iw_smartlink_last_open";

/*
  Smartlink minimum interval:
  30 minutes

  This means Smartlink will not repeatedly
  open on every page/button click.
*/

const SMARTLINK_COOLDOWN =
  30 * 60 * 1000;


/* =========================================================
   USER STORAGE KEYS
========================================================= */

const USER_KEY =
  "iw_device_user";

const LOGIN_KEY =
  "worker_logged_in";


/* =========================================================
   LOGIN STATUS
========================================================= */

function isLoggedIn() {

  return (
    localStorage.getItem(LOGIN_KEY) === "true"
  );

}


/* =========================================================
   GET STORED USER
========================================================= */

function getStoredUser() {

  const data =
    localStorage.getItem(USER_KEY);

  if (!data) {

    return null;

  }


  try {

    return JSON.parse(data);

  }
  catch (error) {

    return null;

  }

}


/* =========================================================
   GET USERNAME
========================================================= */

function getUsername() {

  const user =
    getStoredUser();


  if (
    user &&
    user.username
  ) {

    return user.username;

  }


  return (
    localStorage.getItem(
      "worker_username"
    ) || "Guest User"
  );

}


/* =========================================================
   GET EMAIL
========================================================= */

function getUserEmail() {

  const user =
    getStoredUser();


  if (
    user &&
    user.email
  ) {

    return user.email;

  }


  return (
    localStorage.getItem(
      "worker_email"
    ) || ""
  );

}


/* =========================================================
   GET BALANCE
========================================================= */

function getBalance() {

  const value =
    parseFloat(
      localStorage.getItem(
        "worker_balance"
      ) || "0"
    );


  if (
    !Number.isFinite(value)
  ) {

    return 0;

  }


  return value;

}


/* =========================================================
   SET BALANCE
========================================================= */

function setBalance(amount) {

  let value =
    Number(amount);


  if (
    !Number.isFinite(value) ||
    value < 0
  ) {

    value = 0;

  }


  localStorage.setItem(
    "worker_balance",
    value.toFixed(2)
  );


  updateBalanceDisplays();

}


/* =========================================================
   ADD BALANCE
========================================================= */

function addBalance(amount) {

  const reward =
    Number(amount);


  if (
    !Number.isFinite(reward) ||
    reward <= 0
  ) {

    return;

  }


  const current =
    getBalance();


  setBalance(
    current + reward
  );

}


/* =========================================================
   UPDATE USER DISPLAYS
========================================================= */

function updateUserDisplays() {

  const username =
    getUsername();


  const email =
    getUserEmail();


  const balance =
    getBalance().toFixed(2);


  document
    .querySelectorAll(
      "[data-username]"
    )
    .forEach(
      function(element) {

        element.textContent =
          username;

      }
    );


  document
    .querySelectorAll(
      "[data-email]"
    )
    .forEach(
      function(element) {

        element.textContent =
          email;

      }
    );


  document
    .querySelectorAll(
      "[data-balance]"
    )
    .forEach(
      function(element) {

        element.textContent =
          balance;

      }
    );

}


/* =========================================================
   UPDATE BALANCE ONLY
========================================================= */

function updateBalanceDisplays() {

  const balance =
    getBalance().toFixed(2);


  document
    .querySelectorAll(
      "[data-balance]"
    )
    .forEach(
      function(element) {

        element.textContent =
          balance;

      }
    );

}


/* =========================================================
   INITIALIZE BALANCE
========================================================= */

function initializeBalance() {

  if (
    localStorage.getItem(
      "worker_balance"
    ) === null
  ) {

    localStorage.setItem(
      "worker_balance",
      "0.00"
    );

  }

}


/* =========================================================
   SMARTLINK COOLDOWN CHECK
========================================================= */

function canOpenSmartlink() {

  const lastOpen =
    parseInt(
      localStorage.getItem(
        SMARTLINK_KEY
      ) || "0",
      10
    );


  const now =
    Date.now();


  return (
    now - lastOpen >=
    SMARTLINK_COOLDOWN
  );

}


/* =========================================================
   OPEN SMARTLINK
========================================================= */

function openSmartlink() {

  /*
    If cooldown has not expired,
    do not open Smartlink again.
  */

  if (
    !canOpenSmartlink()
  ) {

    return false;

  }


  /*
    Save timestamp BEFORE opening.
    This prevents repeated triggers.
  */

  localStorage.setItem(
    SMARTLINK_KEY,
    Date.now().toString()
  );


  /*
    Open Smartlink in a new tab.
  */

  const newWindow =
    window.open(
      SMARTLINK_URL,
      "_blank"
    );


  /*
    Return whether browser allowed
    the popup.
  */

  return !!newWindow;

}


/* =========================================================
   SMART NAVIGATION
========================================================= */

function smartNavigate(url) {

  /*
    Smartlink is independent from
    rewards or task completion.

    It only opens when cooldown allows it.
  */

  openSmartlink();


  /*
    Continue to requested page.
  */

  setTimeout(
    function() {

      window.location.href =
        url;

    },
    150
  );

}


/* =========================================================
   OPEN BROWSER
========================================================= */

function openBrowser() {

  smartNavigate(
    "browser.html"
  );

}


/* =========================================================
   OPEN VIDEO DOWNLOADER
========================================================= */

function openVideoDownloader() {

  smartNavigate(
    "video-downloader.html"
  );

}


/* =========================================================
   OPEN PROFILE
========================================================= */

function openProfile() {

  smartNavigate(
    "profile.html"
  );

}


/* =========================================================
   OPEN MORE
========================================================= */

function openMore() {

  window.location.href =
    "more.html";

}


/* =========================================================
   OPEN TASK
========================================================= */

function openTask() {

  window.location.href =
    "task.html";

}


/* =========================================================
   OPEN MICRO TASK
========================================================= */

function openMicroTask() {

  window.location.href =
    "https://lsr-video-downloaders.vercel.app/offerwall.html";

}


/* =========================================================
   OPEN LOGIN
========================================================= */

function openLogin() {

  window.location.href =
    "login.html";

}


/* =========================================================
   OPEN SIGNUP
========================================================= */

function openSignup() {

  window.location.href =
    "signup.html";

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  /*
    Remove active login session.

    IMPORTANT:
    Device account remains stored so the
    same device cannot create another account.
  */

  localStorage.removeItem(
    LOGIN_KEY
  );


  localStorage.removeItem(
    "worker_username"
  );


  localStorage.removeItem(
    "worker_email"
  );


  /*
    DO NOT remove:

      iw_device_user

    This preserves:
      1 device = 1 account
  */


  window.location.href =
    "index.html";

}


/* =========================================================
   UPDATE AUTH BUTTONS
========================================================= */

function updateAuthButtons() {

  const loggedIn =
    isLoggedIn();


  /* -------------------------------------------------------
     LOGIN BUTTONS
  ------------------------------------------------------- */

  document
    .querySelectorAll(
      "[data-login-button]"
    )
    .forEach(
      function(element) {

        element.style.display =
          loggedIn
            ? "none"
            : "";

      }
    );


  /* -------------------------------------------------------
     SIGNUP BUTTONS
  ------------------------------------------------------- */

  document
    .querySelectorAll(
      "[data-signup-button]"
    )
    .forEach(
      function(element) {

        element.style.display =
          loggedIn
            ? "none"
            : "";

      }
    );


  /* -------------------------------------------------------
     LOGOUT BUTTONS
  ------------------------------------------------------- */

  document
    .querySelectorAll(
      "[data-logout-button]"
    )
    .forEach(
      function(element) {

        element.style.display =
          loggedIn
            ? ""
            : "none";

      }
    );


  /* -------------------------------------------------------
     LOGGED-IN SECTIONS
  ------------------------------------------------------- */

  document
    .querySelectorAll(
      "[data-logged-in]"
    )
    .forEach(
      function(element) {

        element.style.display =
          loggedIn
            ? ""
            : "none";

      }
    );


  /* -------------------------------------------------------
     GUEST SECTIONS
  ------------------------------------------------------- */

  document
    .querySelectorAll(
      "[data-guest]"
    )
    .forEach(
      function(element) {

        element.style.display =
          loggedIn
            ? "none"
            : "";

      }
    );

}


/* =========================================================
   LOGIN PROTECTION
========================================================= */

function requireLogin() {

  if (
    isLoggedIn()
  ) {

    return true;

  }


  window.location.href =
    "login.html";


  return false;

}


/* =========================================================
   CLEAR LOGIN SESSION
========================================================= */

function clearLoginSession() {

  localStorage.removeItem(
    LOGIN_KEY
  );


  localStorage.removeItem(
    "worker_username"
  );


  localStorage.removeItem(
    "worker_email"
  );

}


/* =========================================================
   APP INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    initializeBalance();

    updateUserDisplays();

    updateAuthButtons();

  }
);
