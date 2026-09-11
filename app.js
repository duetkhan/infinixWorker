/* =========================================================
   INFINIX WORKER - APP.JS
   Core App System
   Firebase Authentication + Firestore + Smartlink
========================================================= */


/* =========================================================
   SMARTLINK
========================================================= */

const SMARTLINK_URL =
  "https://www.profitableratecpmnetwork.com/xujhdqwep?key=a7974e14e4446b0e7745df0efe2ed3";

const SMARTLINK_KEY =
  "iw_smartlink_last_open";

const SMARTLINK_COOLDOWN =
  30 * 60 * 1000;


/* =========================================================
   FIREBASE STATE
========================================================= */

let appFirebaseReady = false;
let appAuthReady = false;

let appCurrentUser = null;
let appUserProfile = null;
let appBalance = 0;

let appFirebaseInitPromise = null;


/* =========================================================
   FIREBASE SDK URLS
========================================================= */

const FIREBASE_APP_SDK =
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js";

const FIREBASE_AUTH_SDK =
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js";

const FIREBASE_FIRESTORE_SDK =
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js";

const FIREBASE_CONFIG_FILE =
  "firebase-config.js";


/* =========================================================
   LOAD SCRIPT
========================================================= */

function loadFirebaseScript(src) {

  return new Promise(function(resolve, reject) {

    const existing =
      document.querySelector(
        'script[src="' + src + '"]'
      );

    if (existing) {

      if (
        window.firebase
      ) {

        resolve();

        return;

      }

      existing.addEventListener(
        "load",
        resolve,
        { once: true }
      );

      existing.addEventListener(
        "error",
        reject,
        { once: true }
      );

      return;

    }


    const script =
      document.createElement("script");

    script.src = src;
    script.async = false;

    script.onload =
      function() {

        resolve();

      };

    script.onerror =
      function() {

        reject(
          new Error(
            "Failed to load Firebase SDK: " + src
          )
        );

      };

    document.head.appendChild(script);

  });

}


/* =========================================================
   LOAD FIREBASE CONFIG
========================================================= */

function loadFirebaseConfig() {

  return new Promise(function(resolve, reject) {

    if (
      window.firebaseAuth &&
      window.firebaseDb
    ) {

      resolve();

      return;

    }


    const existing =
      document.querySelector(
        'script[src="' +
        FIREBASE_CONFIG_FILE +
        '"]'
      );


    if (existing) {

      let attempts = 0;

      const timer =
        setInterval(
          function() {

            attempts++;

            if (
              window.firebaseAuth &&
              window.firebaseDb
            ) {

              clearInterval(timer);

              resolve();

              return;

            }


            if (attempts >= 100) {

              clearInterval(timer);

              reject(
                new Error(
                  "Firebase config initialization timeout"
                )
              );

            }

          },
          50
        );

      return;

    }


    const script =
      document.createElement("script");

    script.src =
      FIREBASE_CONFIG_FILE;

    script.async = false;

    script.onload =
      function() {

        let attempts = 0;

        const timer =
          setInterval(
            function() {

              attempts++;

              if (
                window.firebaseAuth &&
                window.firebaseDb
              ) {

                clearInterval(timer);

                resolve();

                return;

              }


              if (attempts >= 100) {

                clearInterval(timer);

                reject(
                  new Error(
                    "Firebase config did not initialize"
                  )
                );

              }

            },
            50
          );

      };

    script.onerror =
      function() {

        reject(
          new Error(
            "Failed to load firebase-config.js"
          )
        );

      };

    document.head.appendChild(script);

  });

}


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

function initializeFirebaseAppSystem() {

  if (
    appFirebaseInitPromise
  ) {

    return appFirebaseInitPromise;

  }


  appFirebaseInitPromise =
    new Promise(
      async function(resolve) {

        try {

          /*
            Some pages already load Firebase before app.js.
            Use that existing instance.
          */

          if (
            window.firebaseAuth &&
            window.firebaseDb
          ) {

            appFirebaseReady = true;

          }
          else {

            /*
              Give page-specific Firebase scripts a chance
              to load first.
            */

            let attempts = 0;

            while (
              attempts < 20 &&
              !(
                window.firebaseAuth &&
                window.firebaseDb
              )
            ) {

              await new Promise(
                function(done) {

                  setTimeout(
                    done,
                    50
                  );

                }
              );

              attempts++;

            }


            /*
              If Firebase is still unavailable,
              load it automatically.
            */

            if (
              !window.firebaseAuth ||
              !window.firebaseDb
            ) {

              if (
                !window.firebase
              ) {

                await loadFirebaseScript(
                  FIREBASE_APP_SDK
                );

              }


              await loadFirebaseScript(
                FIREBASE_AUTH_SDK
              );


              await loadFirebaseScript(
                FIREBASE_FIRESTORE_SDK
              );


              await loadFirebaseConfig();

            }


            if (
              window.firebaseAuth &&
              window.firebaseDb
            ) {

              appFirebaseReady = true;

            }

          }


          if (
            !appFirebaseReady
          ) {

            console.error(
              "Firebase is not available."
            );

            resolve(false);

            return;

          }


          /*
            Firebase authentication listener.
          */

          window.firebaseAuth.onAuthStateChanged(
            async function(user) {

              appCurrentUser =
                user || null;

              appAuthReady = true;


              if (user) {

                await loadFirebaseUserData(
                  user
                );

              }
              else {

                appUserProfile = null;
                appBalance = 0;

              }


              updateUserDisplays();
              updateBalanceDisplays();
              updateAuthButtons();

            }
          );


          resolve(true);

        }
        catch (error) {

          console.error(
            "Firebase initialization error:",
            error
          );

          appFirebaseReady = false;

          resolve(false);

        }

      }
    );


  return appFirebaseInitPromise;

}


/* =========================================================
   LOAD FIREBASE USER DATA
========================================================= */

async function loadFirebaseUserData(user) {

  if (
    !user ||
    !window.firebaseDb
  ) {

    appUserProfile = null;
    appBalance = 0;

    return;

  }


  try {

    const profileRef =
      window.firebaseDb
        .collection("profiles")
        .doc(user.uid);


    const walletRef =
      window.firebaseDb
        .collection("wallets")
        .doc(user.uid);


    const results =
      await Promise.all([
        profileRef.get(),
        walletRef.get()
      ]);


    const profileSnapshot =
      results[0];

    const walletSnapshot =
      results[1];


    if (
      profileSnapshot.exists
    ) {

      appUserProfile =
        profileSnapshot.data() || {};

    }
    else {

      appUserProfile = {};

    }


    if (
      walletSnapshot.exists
    ) {

      const walletData =
        walletSnapshot.data() || {};

      const walletBalance =
        Number(
          walletData.balance
        );


      if (
        Number.isFinite(walletBalance) &&
        walletBalance >= 0
      ) {

        appBalance =
          walletBalance;

      }
      else {

        appBalance = 0;

      }

    }
    else {

      /*
        Do not create or modify wallet here.
        Wallet creation remains controlled by the
        signup / withdrawal / reward system.
      */

      appBalance = 0;

    }

  }
  catch (error) {

    console.error(
      "Failed to load Firebase user data:",
      error
    );

    /*
      Do not fall back to localStorage.
    */

    appUserProfile = null;
    appBalance = 0;

  }

}


/* =========================================================
   LOGIN STATUS
========================================================= */

function isLoggedIn() {

  if (
    window.firebaseAuth &&
    window.firebaseAuth.currentUser
  ) {

    return true;

  }


  return false;

}


/* =========================================================
   GET FIREBASE USER
========================================================= */

function getFirebaseUser() {

  if (
    window.firebaseAuth &&
    window.firebaseAuth.currentUser
  ) {

    return (
      window.firebaseAuth.currentUser
    );

  }


  return null;

}


/* =========================================================
   GET STORED USER
========================================================= */

function getStoredUser() {

  const user =
    getFirebaseUser();


  if (!user) {

    return null;

  }


  return {

    uid:
      user.uid,

    email:
      user.email || "",

    username:
      getUsername()

  };

}


/* =========================================================
   GET USERNAME
========================================================= */

function getUsername() {

  if (
    appUserProfile &&
    typeof appUserProfile.username === "string" &&
    appUserProfile.username.trim() !== ""
  ) {

    return (
      appUserProfile.username.trim()
    );

  }


  const user =
    getFirebaseUser();


  if (
    user &&
    user.displayName
  ) {

    return (
      user.displayName
    );

  }


  return "Guest User";

}


/* =========================================================
   GET EMAIL
========================================================= */

function getUserEmail() {

  const user =
    getFirebaseUser();


  if (
    user &&
    user.email
  ) {

    return user.email;

  }


  return "";

}


/* =========================================================
   GET BALANCE
========================================================= */

function getBalance() {

  const value =
    Number(
      appBalance
    );


  if (
    !Number.isFinite(value) ||
    value < 0
  ) {

    return 0;

  }


  return value;

}


/* =========================================================
   SET BALANCE
========================================================= */

function setBalance(amount) {

  /*
    IMPORTANT:

    This function no longer writes balance to
    localStorage or Firestore.

    Client-side balance modification is unsafe.

    Actual rewards are processed by:
      /api/reward

    Actual withdrawals are processed by:
      withdraw.html transaction

    This function is retained only for compatibility
    with existing page code and UI.
  */

  let value =
    Number(amount);


  if (
    !Number.isFinite(value) ||
    value < 0
  ) {

    value = 0;

  }


  appBalance =
    value;


  updateBalanceDisplays();

}


/* =========================================================
   ADD BALANCE
========================================================= */

function addBalance(amount) {

  /*
    Direct client-side reward modification is disabled.

    Rewards must go through the secure server API.
  */

  console.warn(
    "Direct client-side balance modification is disabled."
  );

  return false;

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
    getBalance()
      .toFixed(2);


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
    getBalance()
      .toFixed(2);


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

  /*
    Firebase is now the balance source.

    Do NOT create localStorage worker_balance.
  */

  if (
    !isLoggedIn()
  ) {

    appBalance = 0;

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
    Smartlink cooldown is intentionally kept
    in localStorage.

    This is NOT account information and NOT balance.
  */

  if (
    !canOpenSmartlink()
  ) {

    return false;

  }


  localStorage.setItem(
    SMARTLINK_KEY,
    Date.now().toString()
  );


  const newWindow =
    window.open(
      SMARTLINK_URL,
      "_blank"
    );


  return !!newWindow;

}


/* =========================================================
   SMART NAVIGATION
========================================================= */

function smartNavigate(url) {

  /*
    Open Smartlink if cooldown allows.
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

async function logout() {

  try {

    if (
      window.firebaseAuth
    ) {

      await window.firebaseAuth.signOut();

    }

  }
  catch (error) {

    console.error(
      "Firebase logout error:",
      error
    );

  }


  /*
    Firebase is the source of authentication.

    Do not restore old localStorage login state.
  */

  appCurrentUser = null;
  appUserProfile = null;
  appBalance = 0;
  appAuthReady = true;


  updateUserDisplays();
  updateBalanceDisplays();
  updateAuthButtons();


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

  /*
    Firebase controls the real authentication session.

    No old localStorage authentication keys are used.
  */

  appCurrentUser = null;
  appUserProfile = null;
  appBalance = 0;

  updateUserDisplays();
  updateBalanceDisplays();
  updateAuthButtons();

}


/* =========================================================
   WAIT FOR FIREBASE AUTH
========================================================= */

function waitForFirebaseAuth() {

  return new Promise(
    function(resolve) {

      if (
        appAuthReady
      ) {

        resolve(
          getFirebaseUser()
        );

        return;

      }


      let attempts = 0;

      const timer =
        setInterval(
          function() {

            attempts++;


            if (
              appAuthReady
            ) {

              clearInterval(timer);

              resolve(
                getFirebaseUser()
              );

              return;

            }


            if (
              attempts >= 100
            ) {

              clearInterval(timer);

              resolve(
                getFirebaseUser()
              );

            }

          },
          50
        );

    }
  );

}


/* =========================================================
   REFRESH FIREBASE USER DATA
========================================================= */

async function refreshFirebaseUserData() {

  const user =
    getFirebaseUser();


  if (!user) {

    appUserProfile = null;
    appBalance = 0;

    updateUserDisplays();
    updateBalanceDisplays();

    return;

  }


  await loadFirebaseUserData(
    user
  );


  updateUserDisplays();
  updateBalanceDisplays();

}


/* =========================================================
   APP INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    /*
      Keep existing UI immediately usable.
    */

    initializeBalance();

    updateUserDisplays();

    updateAuthButtons();


    /*
      Firebase initialization happens asynchronously.
      This allows pages that load Firebase after app.js
      to continue working correctly.
    */

    initializeFirebaseAppSystem()
      .then(
        async function() {

          if (
            appFirebaseReady
          ) {

            await waitForFirebaseAuth();

            await refreshFirebaseUserData();

            updateUserDisplays();
            updateBalanceDisplays();
            updateAuthButtons();

          }

        }
      )
      .catch(
        function(error) {

          console.error(
            "Firebase app initialization failed:",
            error
          );

        }
      );

  }
);
