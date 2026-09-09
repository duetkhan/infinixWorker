/* =========================================================
   INFINIX WORKER - APP.JS
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
*/
const SMARTLINK_COOLDOWN =
  30 * 60 * 1000;


/* =========================================================
   USER KEYS
========================================================= */

const USER_KEY =
  "iw_device_user";

const LOGIN_KEY =
  "worker_logged_in";


/* =========================================================
   USER STATUS
========================================================= */

function isLoggedIn() {

  return (
    localStorage.getItem(LOGIN_KEY) === "true"
  );

}


/* =========================================================
   GET USER
========================================================= */

function getStoredUser() {

  const data =
    localStorage.getItem(USER_KEY);

  if (!data) {
    return null;
  }

  try {

    return JSON.parse(data);

  } catch (error) {

    return null;

  }

}


/* =========================================================
   USERNAME
========================================================= */

function getUsername() {

  const user =
    getStoredUser();

  if (user && user.username) {

    return user.username;

  }

  return (
    localStorage.getItem(
      "worker_username"
    ) || "Guest User"
  );

}


/* =========================================================
   EMAIL
========================================================= */

function getUserEmail() {

  const user =
    getStoredUser();

  if (user && user.email) {

    return user.email;

  }

  return (
    localStorage.getItem(
      "worker_email"
    ) || ""
  );

}


/* =========================================================
   BALANCE
========================================================= */

function getBalance() {

  const value =
    parseFloat(
      localStorage.getItem(
        "worker_balance"
      ) || "0"
    );

  if (isNaN(value)) {

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
   USER DISPLAY
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
      element => {

        element.textContent =
          username;

      }
    );


  document
    .querySelectorAll(
      "[data-email]"
    )
    .forEach(
      element => {

        element.textContent =
          email;

      }
    );


  document
    .querySelectorAll(
      "[data-balance]"
    )
    .forEach(
      element => {

        element.textContent =
          balance;

      }
    );

}


/* =========================================================
   BALANCE DISPLAY
========================================================= */

function updateBalanceDisplays() {

  const balance =
    getBalance().toFixed(2);


  document
    .querySelectorAll(
      "[data-balance]"
    )
    .forEach(
      element => {

        element.textContent =
          balance;

      }
    );

}


/* =========================================================
   INITIAL BALANCE
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
   SMARTLINK - CHECK COOLDOWN
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
    now - lastOpen
    >= SMARTLINK_COOLDOWN
  );

}


/* =========================================================
   SMARTLINK - OPEN
========================================================= */

function openSmartlink() {

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
    Some browsers may block popup.
    Navigation still continues.
  */

  return !!newWindow;

}


/* =========================================================
   SMART NAVIGATION
========================================================= */

function smartNavigate(url) {

  /*
    Smartlink is controlled by cooldown.
    It is NOT connected to rewards.
  */

  openSmartlink();


  setTimeout(
    function() {

      window.location.href =
        url;

    },
    150
  );

}


/* =========================================================
   BROWSER
========================================================= */

function openBrowser() {

  smartNavigate(
    "browser.html"
  );

}


/* =========================================================
   VIDEO DOWNLOADER
========================================================= */

function openVideoDownloader() {

  smartNavigate(
    "video-downloader.html"
  );

}


/* =========================================================
   PROFILE
========================================================= */

function openProfile() {

  smartNavigate(
    "profile.html"
  );

}


/* =========================================================
   MORE
========================================================= */

function openMore() {

  window.location.href =
    "more.html";

}


/* =========================================================
   TASK
========================================================= */

function openTask() {

  window.location.href =
    "task.html";

}


/* =========================================================
   MICRO TASK
========================================================= */

function openMicroTask() {

  window.location.href =
    "https://lsr-video-downloaders.vercel.app/offerwall.html";

}


/* =========================================================
   LOGIN PAGE
========================================================= */

function openLogin() {

  window.location.href =
    "login.html";

}


/* =========================================================
   SIGNUP PAGE
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
    Remove login session.
    Keep device account so another
    account cannot be created.
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
    IMPORTANT:
    iw_device_user is NOT removed.

    This keeps:
    1 device = 1 user
  */


  window.location.href =
    "index.html";

}


/* =========================================================
   AUTH BUTTON DISPLAY
========================================================= */

function updateAuthButtons() {

  const loggedIn =
    isLoggedIn();


  /*
    Login buttons
  */

  document
    .querySelectorAll(
      "[data-login-button]"
    )
    .forEach(
      element => {

        element.style.display =
          loggedIn
            ? "none"
            : "";

      }
    );


  /*
    Signup buttons
  */

  document
    .querySelectorAll(
      "[data-signup-button]"
    )
    .forEach(
      element => {

        element.style.display =
          loggedIn
            ? "none"
            : "";

      }
    );


  /*
    Logout buttons
  */

  document
    .querySelectorAll(
      "[data-logout-button]"
    )
    .forEach(
      element => {

        element.style.display =
          loggedIn
            ? ""
            : "none";

      }
    );


  /*
    Logged-in user sections
  */

  document
    .querySelectorAll(
      "[data-logged-in]"
    )
    .forEach(
      element => {

        element.style.display =
          loggedIn
            ? ""
            : "none";

      }
    );


  /*
    Guest sections
  */

  document
    .querySelectorAll(
      "[data-guest]"
    )
    .forEach(
      element => {

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
   LOGOUT ALL SESSION DATA
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
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    initializeBalance();

    updateUserDisplays();

    updateAuthButtons();

  }
);
