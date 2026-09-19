/* =========================================================
   CANONICAL OCEAN
   FIREBASE SIGN IN
   Email/Password + Google + Firestore
========================================================= */


/* =========================================================
   FIREBASE IMPORTS
========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

  apiKey:
    "AIzaSyArdwTI-xT0aTSyVejFsHb0hnLn_lrF3s4",

  authDomain:
    "canonical-ocean-portal.firebaseapp.com",

  projectId:
    "canonical-ocean-portal",

  storageBucket:
    "canonical-ocean-portal.firebasestorage.app",

  messagingSenderId:
    "823443511342",

  appId:
    "1:823443511342:web:46a3d24bb3f2105ac227bf",

  measurementId:
    "G-86YWK7QTVB"

};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);

const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});


/* =========================================================
   ELEMENTS
========================================================= */

const typeCards =
  document.querySelectorAll(".type-card");

const accountType =
  document.getElementById("accountType");

const loginForm =
  document.getElementById("loginForm");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const togglePassword =
  document.getElementById("togglePassword");

const statusBox =
  document.getElementById("status");

const forgotPassword =
  document.getElementById("forgotPassword");

const passkeyBtn =
  document.getElementById("passkeyBtn");

const googleBtn =
  document.getElementById("googleLoginBtn");


/* =========================================================
   ACCOUNT TYPE
========================================================= */

if (typeCards.length) {

  typeCards.forEach(card => {

    card.addEventListener("click", () => {

      typeCards.forEach(item => {
        item.classList.remove("active");
      });

      card.classList.add("active");

      accountType.value =
        card.dataset.type;

    });

  });

}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

if (
  togglePassword &&
  passwordInput
) {

  togglePassword.addEventListener(
    "click",
    () => {

      const icon =
        togglePassword.querySelector("i");

      if (
        passwordInput.type ===
        "password"
      ) {

        passwordInput.type =
          "text";

        if (icon) {

          icon.classList.remove(
            "fa-eye"
          );

          icon.classList.add(
            "fa-eye-slash"
          );

        }

      } else {

        passwordInput.type =
          "password";

        if (icon) {

          icon.classList.remove(
            "fa-eye-slash"
          );

          icon.classList.add(
            "fa-eye"
          );

        }

      }

    }
  );

}


/* =========================================================
   STATUS
========================================================= */

function showStatus(
  message,
  type = "success"
) {

  if (!statusBox) {
    return;
  }

  statusBox.textContent =
    message;

  statusBox.className =
    "status show " + type;

}


/* =========================================================
   CLEAR STATUS
========================================================= */

function clearStatus() {

  if (!statusBox) {
    return;
  }

  statusBox.textContent = "";

  statusBox.className =
    "status";

}


/* =========================================================
   FIREBASE ERROR MESSAGE
========================================================= */

function firebaseErrorMessage(error) {

  switch (error.code) {

    case "auth/invalid-credential":

      return "Invalid email or password.";

    case "auth/invalid-login-credentials":

      return "Invalid email or password.";

    case "auth/user-not-found":

      return "Invalid email or password.";

    case "auth/wrong-password":

      return "Invalid email or password.";

    case "auth/invalid-email":

      return "Please enter a valid email address.";

    case "auth/too-many-requests":

      return "Too many login attempts. Please try again later.";

    case "auth/user-disabled":

      return "This account has been disabled.";

    case "auth/network-request-failed":

      return "Network error. Please check your internet connection.";

    case "auth/popup-closed-by-user":

      return "Google sign-in was cancelled.";

    case "auth/popup-blocked":

      return "Your browser blocked the Google sign-in popup.";

    case "auth/account-exists-with-different-credential":

      return "An account already exists with this email using another sign-in method.";

    default:

      return "Unable to sign in. Please try again.";

  }

}


/* =========================================================
   GET USER PROFILE
========================================================= */

async function getUserProfile(user) {

  const userRef =
    doc(
      db,
      "users",
      user.uid
    );

  const userSnap =
    await getDoc(userRef);


  if (!userSnap.exists()) {

    return null;

  }


  return userSnap.data();

}


/* =========================================================
   CHECK ACCOUNT
========================================================= */

async function checkAccountAccess(user) {

  const profile =
    await getUserProfile(user);


  if (!profile) {

    await signOut(auth);

    showStatus(
      "Your account profile was not found. Please contact support.",
      "error"
    );

    return null;

  }


  /* =========================================
     EMAIL VERIFICATION
  ========================================= */

  /*
    Google users normally have verified email.
    Email/password users must verify.
  */

  if (
    !user.emailVerified &&
    user.providerData.some(
      provider =>
        provider.providerId ===
        "password"
    )
  ) {

    await signOut(auth);

    showStatus(
      "Please verify your email before signing in.",
      "error"
    );

    return null;

  }


  /* =========================================
     ACCOUNT STATUS
  ========================================= */

  const status =
    profile.status || "";


  if (
    status === "blocked" ||
    status === "disabled" ||
    status === "suspended"
  ) {

    await signOut(auth);

    showStatus(
      "Your account is currently disabled. Please contact support.",
      "error"
    );

    return null;

  }


  /*
    Pending email verification is allowed
    only if Firebase now says verified.
  */

  if (
    status ===
    "pending_email_verification" &&
    !user.emailVerified
  ) {

    await signOut(auth);

    showStatus(
      "Please verify your email before accessing your account.",
      "error"
    );

    return null;

  }


  return profile;

}


/* =========================================================
   REDIRECT
========================================================= */

function redirectByAccountType(
  profile
) {

  const type =
    profile.accountType;


  /*
    Personal
  */

  if (
    type === "personal"
  ) {

    window.location.href =
      "/account/";

    return;

  }


  /*
    Retail
  */

  if (
    type === "retail"
  ) {

    window.location.href =
      "/b2b/dashboard/";

    return;

  }


  /*
    Distribution
  */

  if (
    type === "distribution"
  ) {

    window.location.href =
      "/b2b/dashboard/";

    return;

  }


  /*
    Company / HR
    Future implementation
  */

  if (
    type === "company" ||
    profile.role === "hr_admin"
  ) {

    window.location.href =
      "/company/hr/dashboard/";

    return;

  }


  /*
    Employee
    Future implementation
  */

  if (
    profile.role === "employee"
  ) {

    window.location.href =
      "/company/employee/dashboard/";

    return;

  }


  /*
    Unknown account type
  */

  showStatus(
    "Your account type is not configured. Please contact support.",
    "error"
  );

}


/* =========================================================
   SAVE SESSION MARKER
========================================================= */

function saveLoginSession(
  profile
) {

  const loginTime =
    Date.now();

  const expiresAt =
    loginTime +
    (
      24 *
      60 *
      60 *
      1000
    );


  localStorage.setItem(
    "canonicalLoginAt",
    String(loginTime)
  );

  localStorage.setItem(
    "canonicalSessionExpiresAt",
    String(expiresAt)
  );

  /*
    Store only non-sensitive
    account information.
  */

  localStorage.setItem(
    "canonicalAccountType",
    profile.accountType || ""
  );

}


/* =========================================================
   CLEAR SESSION
========================================================= */

function clearLocalSession() {

  localStorage.removeItem(
    "canonicalLoginAt"
  );

  localStorage.removeItem(
    "canonicalSessionExpiresAt"
  );

  localStorage.removeItem(
    "canonicalAccountType"
  );

}


/* =========================================================
   EMAIL + PASSWORD LOGIN
========================================================= */

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      clearStatus();


      const email =
        emailInput
          ? emailInput.value.trim()
          : "";

      const password =
        passwordInput
          ? passwordInput.value
          : "";


      /* =====================================
         VALIDATION
      ===================================== */

      if (!email || !password) {

        showStatus(
          "Please enter your email and password.",
          "error"
        );

        return;

      }


      if (
        !email.includes("@")
      ) {

        showStatus(
          "Please enter a valid email address.",
          "error"
        );

        return;

      }


      /* =====================================
         BUTTON
      ===================================== */

      const submitButton =
        loginForm.querySelector(
          "button[type='submit']"
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.dataset.originalText =
          submitButton.innerHTML;

        submitButton.innerHTML = `
          <span>Signing in...</span>
          <i class="fa-solid fa-spinner fa-spin"></i>
        `;

      }


      try {

        /* ===================================
           FIREBASE LOGIN
        =================================== */

        const result =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );


        const user =
          result.user;


        /* ===================================
           CHECK FIRESTORE ACCOUNT
        =================================== */

        const profile =
          await checkAccountAccess(
            user
          );


        if (!profile) {
          return;
        }


        /* ===================================
           SAVE SESSION
        =================================== */

        saveLoginSession(
          profile
        );


        showStatus(
          "Sign in successful. Redirecting...",
          "success"
        );


        /* ===================================
           REDIRECT
        =================================== */

        setTimeout(() => {

          redirectByAccountType(
            profile
          );

        }, 500);

      }

      catch (error) {

        console.error(
          "Firebase Login Error:",
          error
        );

        showStatus(
          firebaseErrorMessage(error),
          "error"
        );

      }

      finally {

        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.innerHTML =
            submitButton.dataset.originalText ||
            `
              <span>Sign In</span>
              <i class="fa-solid fa-arrow-right"></i>
            `;

        }

      }

    }
  );

}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

if (googleBtn) {

  googleBtn.addEventListener(
    "click",
    async () => {

      clearStatus();


      googleBtn.disabled =
        true;


      const originalHTML =
        googleBtn.innerHTML;


      googleBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Signing in...
      `;


      try {

        /* ===================================
           GOOGLE AUTH
        =================================== */

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );


        const user =
          result.user;


        /* ===================================
           CHECK FIRESTORE
        =================================== */

        const profile =
          await checkAccountAccess(
            user
          );


        if (!profile) {
          return;
        }


        /* ===================================
           SAVE SESSION
        =================================== */

        saveLoginSession(
          profile
        );


        showStatus(
          "Google sign in successful. Redirecting...",
          "success"
        );


        setTimeout(() => {

          redirectByAccountType(
            profile
          );

        }, 500);

      }

      catch (error) {

        console.error(
          "Google Login Error:",
          error
        );

        showStatus(
          firebaseErrorMessage(error),
          "error"
        );

      }

      finally {

        googleBtn.disabled =
          false;

        googleBtn.innerHTML =
          originalHTML;

      }

    }
  );

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

if (forgotPassword) {

  forgotPassword.addEventListener(
    "click",
    async event => {

      event.preventDefault();

      clearStatus();


      const email =
        emailInput
          ? emailInput.value.trim()
          : "";


      if (!email) {

        showStatus(
          "Enter your email address first.",
          "error"
        );

        if (emailInput) {
          emailInput.focus();
        }

        return;

      }


      if (
        !email.includes("@")
      ) {

        showStatus(
          "Please enter a valid email address.",
          "error"
        );

        return;

      }


      try {

        await sendPasswordResetEmail(
          auth,
          email
        );


        /*
          Deliberately generic message.
          This avoids revealing whether
          an email exists in the system.
        */

        showStatus(
          "If an account exists for this email, a password reset link has been sent.",
          "success"
        );

      }

      catch (error) {

        console.error(
          "Password Reset Error:",
          error
        );


        /*
          Also use generic response
          for security.
        */

        showStatus(
          "If an account exists for this email, a password reset link has been sent.",
          "success"
        );

      }

    }
  );

}


/* =========================================================
   24 HOUR LOCAL SESSION CHECK
========================================================= */

async function checkSessionExpiry() {

  const expiresAt =
    localStorage.getItem(
      "canonicalSessionExpiresAt"
    );


  if (!expiresAt) {
    return;
  }


  if (
    Date.now() >=
    Number(expiresAt)
  ) {

    clearLocalSession();


    try {

      await signOut(auth);

    }

    catch (error) {

      console.error(
        "Logout error:",
        error
      );

    }


    window.location.href =
      "/signin/?expired=1";

  }

}


/* =========================================================
   CHECK EVERY MINUTE
========================================================= */

checkSessionExpiry();


setInterval(
  checkSessionExpiry,
  60 * 1000
);


/* =========================================================
   PASSKEY
========================================================= */

if (passkeyBtn) {

  passkeyBtn.addEventListener(
    "click",
    async () => {

      showStatus(
        "Passkey / fingerprint login will be enabled after WebAuthn setup.",
        "success"
      );

    }
  );

}


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    /*
      Firebase automatically keeps
      the authentication state.

      We don't redirect from the login
      page here because the user may
      still need to see an error.
    */

    if (user) {

      console.log(
        "Firebase user:",
        user.uid
      );

    }

  }
);


/* =========================================================
   GOOGLE BUTTON COMPATIBILITY
========================================================= */

/*
  If your HTML uses another ID,
  for example:

  #googleBtn

  you can change the selector above.
*/


console.log(
  "Canonical Ocean Firebase Login initialized."
);
