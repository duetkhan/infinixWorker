const admin = require("firebase-admin");

function getFirebaseAdmin() {
  if (admin.apps.length) {
    return admin.app();
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : "";

  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !privateKey
  ) {
    throw new Error("Firebase Admin environment variables are missing.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey
    })
  });
}


// ============================================================
// SERVER-SIDE REWARD CONFIGURATION
// ============================================================

const REWARDS = {
  visit_web: {
    amount: 3.00,
    dailyLimit: 10
  },

  watch_earn: {
    amount: 1.50,
    dailyLimit: 30
  }
};


// ============================================================
// HELPERS
// ============================================================

function sendJson(res, status, data) {
  res.status(status).json(data);
}


function todayKey() {
  // Bangladesh date (UTC+6)
  const now = new Date(
    Date.now() + 6 * 60 * 60 * 1000
  );

  return now.toISOString().slice(0, 10);
}


function cleanRewardType(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}


// ============================================================
// API
// ============================================================

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return sendJson(res, 405, {
      success: false,
      error: "METHOD_NOT_ALLOWED"
    });
  }


  let firebaseApp;

  try {
    firebaseApp = getFirebaseAdmin();
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);

    return sendJson(res, 500, {
      success: false,
      error: "SERVER_CONFIGURATION_ERROR"
    });
  }


  try {

    // --------------------------------------------------------
    // FIREBASE ID TOKEN
    // --------------------------------------------------------

    const authorization =
      req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return sendJson(res, 401, {
        success: false,
        error: "AUTH_REQUIRED"
      });
    }

    const idToken =
      authorization.substring(7).trim();

    if (!idToken) {
      return sendJson(res, 401, {
        success: false,
        error: "AUTH_REQUIRED"
      });
    }


    // --------------------------------------------------------
    // VERIFY USER
    // --------------------------------------------------------

    const decodedToken =
      await firebaseApp
        .auth()
        .verifyIdToken(idToken);

    const userId = decodedToken.uid;


    // --------------------------------------------------------
    // REQUEST DATA
    // --------------------------------------------------------

    const body =
      req.body && typeof req.body === "object"
        ? req.body
        : {};

    const rewardType =
      cleanRewardType(body.rewardType);

    const clientClaimId =
      typeof body.claimId === "string"
        ? body.claimId.trim()
        : "";


    // --------------------------------------------------------
    // VALIDATE REWARD TYPE
    // --------------------------------------------------------

    if (!rewardType || !REWARDS[rewardType]) {
      return sendJson(res, 400, {
        success: false,
        error: "INVALID_REWARD_TYPE"
      });
    }


    if (!clientClaimId) {
      return sendJson(res, 400, {
        success: false,
        error: "CLAIM_ID_REQUIRED"
      });
    }


    const rewardConfig =
      REWARDS[rewardType];

    const rewardAmount =
      Number(rewardConfig.amount);

    const dailyLimit =
      Number(rewardConfig.dailyLimit);


    // --------------------------------------------------------
    // FIRESTORE REFERENCES
    // --------------------------------------------------------

    const db =
      firebaseApp.firestore();

    const walletRef =
      db.collection("wallets").doc(userId);

    const profileRef =
      db.collection("profiles").doc(userId);

    const claimRef =
      db.collection("submissions").doc(clientClaimId);


    const dateKey =
      todayKey();

    const dailyRef =
      db
        .collection("rewardDaily")
        .doc(
          `${userId}_${dateKey}_${rewardType}`
        );


    // --------------------------------------------------------
    // ATOMIC REWARD TRANSACTION
    // --------------------------------------------------------

    const result =
      await db.runTransaction(async transaction => {

        // Read all documents first.

        const [
          walletSnap,
          profileSnap,
          claimSnap,
          dailySnap
        ] = await Promise.all([
          transaction.get(walletRef),
          transaction.get(profileRef),
          transaction.get(claimRef),
          transaction.get(dailyRef)
        ]);


        // ----------------------------------------------------
        // DUPLICATE CLAIM
        // ----------------------------------------------------

        if (claimSnap.exists) {
          throw new Error("REWARD_ALREADY_CLAIMED");
        }


        // ----------------------------------------------------
        // DAILY LIMIT
        // ----------------------------------------------------

        const currentCount =
          dailySnap.exists
            ? Number(dailySnap.data().count || 0)
            : 0;


        if (currentCount >= dailyLimit) {
          throw new Error("DAILY_LIMIT_REACHED");
        }


        // ----------------------------------------------------
        // EXISTING BALANCE
        // ----------------------------------------------------

        const oldBalance =
          walletSnap.exists
            ? Number(walletSnap.data().balance || 0)
            : 0;

        const oldPendingBalance =
          walletSnap.exists
            ? Number(
                walletSnap.data().pending_balance || 0
              )
            : 0;

        const oldTotalEarned =
          walletSnap.exists
            ? Number(
                walletSnap.data().total_earned || 0
              )
            : 0;


        const newBalance =
          oldBalance + rewardAmount;

        const newTotalEarned =
          oldTotalEarned + rewardAmount;


        // ----------------------------------------------------
        // WALLET
        // ----------------------------------------------------

        transaction.set(
          walletRef,
          {
            balance: newBalance,
            pending_balance: oldPendingBalance,
            total_earned: newTotalEarned,
            total_withdrawn:
              walletSnap.exists
                ? Number(
                    walletSnap.data().total_withdrawn || 0
                  )
                : 0,
            user_id: userId,
            updated_at:
              admin.firestore.FieldValue.serverTimestamp()
          },
          {
            merge: true
          }
        );


        // ----------------------------------------------------
        // PROFILE BALANCE
        // ----------------------------------------------------

        if (profileSnap.exists) {

          transaction.set(
            profileRef,
            {
              balance: newBalance,
              updated_at:
                admin.firestore.FieldValue.serverTimestamp()
            },
            {
              merge: true
            }
          );

        }


        // ----------------------------------------------------
        // CLAIM RECORD
        // ----------------------------------------------------

        transaction.create(
          claimRef,
          {
            userId: userId,
            rewardType: rewardType,
            reward: rewardAmount,
            clientClaimId: clientClaimId,
            claimedAt:
              admin.firestore.FieldValue.serverTimestamp()
          }
        );


        // ----------------------------------------------------
        // DAILY COUNTER
        // ----------------------------------------------------

        transaction.set(
          dailyRef,
          {
            userId: userId,
            date: dateKey,
            rewardType: rewardType,
            count: currentCount + 1,
            totalReward:
              Number(
                (
                  (currentCount + 1) *
                  rewardAmount
                ).toFixed(2)
              ),
            updatedAt:
              admin.firestore.FieldValue.serverTimestamp()
          },
          {
            merge: true
          }
        );


        return {
          balance: newBalance,
          reward: rewardAmount,
          count: currentCount + 1,
          dailyLimit: dailyLimit
        };
      });


    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    return sendJson(res, 200, {
      success: true,
      balance: result.balance,
      reward: result.reward,
      dailyCount: result.count,
      dailyLimit: result.dailyLimit
    });


  } catch (error) {

    console.error("Reward API error:", error);


    if (error.message === "REWARD_ALREADY_CLAIMED") {
      return sendJson(res, 409, {
        success: false,
        error: "REWARD_ALREADY_CLAIMED"
      });
    }


    if (error.message === "DAILY_LIMIT_REACHED") {
      return sendJson(res, 429, {
        success: false,
        error: "DAILY_LIMIT_REACHED"
      });
    }


    if (
      error.code === "auth/id-token-expired" ||
      error.code === "auth/argument-error" ||
      error.code === "auth/invalid-id-token"
    ) {
      return sendJson(res, 401, {
        success: false,
        error: "INVALID_AUTH_TOKEN"
      });
    }


    return sendJson(res, 500, {
      success: false,
      error: "REWARD_SERVER_ERROR"
    });
  }
};
