/* =========================================================
   CANONICAL OCEAN
   FIREBASE SIGNUP
   NEW EMAIL VERIFICATION FLOW

   FLOW:
   First Name
   Second Name
   Email
   ↓ Verify Email →
   Verification Email Sent
   ↓
   User verifies email
   ↓
   Signup page returns
   ↓
   Email Verified Successfully
   ↓
   Password
   Confirm Password
   ↓
   Create Account
   ↓
   Dashboard
========================================================= */


/* =========================================================
   FIREBASE IMPORTS
========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  applyActionCode
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

  apiKey:
    "AIzaSyArdwTI-xT0aASyVejFsHb0hnLn_lrF3s4",

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

const signupForm =
  document.getElementById("signupForm");

const dynamicFields =
  document.getElementById("dynamicFields");

const accountTypeInput =
  document.getElementById("accountType");

const sectionDescription =
  document.getElementById("sectionDescription");

const typeCards =
  document.querySelectorAll(".type-card");

const signupButton =
  document.getElementById("createAccountBtn") ||
  signupForm?.querySelector(".submit-btn");

const verifyEmailBtn =
  document.getElementById("verifyEmailBtn");

const emailInput =
  document.getElementById("email");

const verificationNote =
  document.getElementById("verificationNote");

const emailVerifiedState =
  document.getElementById("emailVerifiedState");

const googleSignupBtn =
  document.getElementById("googleSignupBtn");


/* =========================================================
   STATE
========================================================= */

let emailVerificationSent = false;

let emailVerifiedMode = false;

let verifiedEmail = "";


/* =========================================================
   FIELD HELPERS
========================================================= */

function createInput(
  name,
  label,
  placeholder = "",
  type = "text",
  required = true,
  full = false
) {

  return `
    <div class="form-group ${full ? "full" : ""}">

      <label for="${name}">
        ${label}
      </label>

      <input
        type="${type}"
        id="${name}"
        name="${name}"
        placeholder="${placeholder}"
        ${required ? "required" : ""}
      >

    </div>
  `;

}


function createSelect(
  name,
  label,
  options = [],
  required = true,
  full = false
) {

  return `
    <div class="form-group ${full ? "full" : ""}">

      <label for="${name}">
        ${label}
      </label>

      <select
        id="${name}"
        name="${name}"
        ${required ? "required" : ""}
      >

        <option value="">
          Select ${label}
        </option>

        ${options.map(option => `
          <option value="${option}">
            ${option}
          </option>
        `).join("")}

      </select>

    </div>
  `;

}


/* =========================================================
   LOCATION FIELDS
========================================================= */

function locationFields() {

  return `

    ${createInput(
      "village",
      "Village Name",
      "Enter village name"
    )}

    ${createInput(
      "taluka",
      "Taluka Name",
      "Enter taluka name"
    )}

    ${createInput(
      "district",
      "District Name",
      "Enter district name"
    )}

    ${createInput(
      "state",
      "State",
      "Enter state"
    )}

    ${createInput(
      "country",
      "Country",
      "India"
    )}

    ${createInput(
      "zipCode",
      "ZIP / PIN Code",
      "Enter ZIP / PIN code"
    )}

  `;

}


/* =========================================================
   PERSONAL FIELDS
========================================================= */

function personalFields() {

  sectionDescription.textContent =
    "Personal account · website access";

  return `

    <div class="form-grid">

      ${createInput(
        "firstName",
        "First Name",
        "Enter first name"
      )}

      ${createInput(
        "secondName",
        "Second Name",
        "Enter second name"
      )}

    </div>

  `;

}


/* =========================================================
   RETAIL FIELDS
========================================================= */

function retailFields() {

  sectionDescription.textContent =
    "Retail partnership · business account";

  return `

    <div class="form-grid">

      ${createInput(
        "businessName",
        "Business / Store Name",
        "Enter store or business name",
        "text",
        true,
        true
      )}

      ${createInput(
        "contactPerson",
        "Owner / Contact Person",
        "Enter contact person"
      )}

      ${createInput(
        "phone",
        "Business Phone",
        "+91 XXXXX XXXXX",
        "tel"
      )}

      ${createInput(
        "gstin",
        "GSTIN",
        "Enter GSTIN",
        "text",
        false
      )}

      ${createInput(
        "pan",
        "PAN",
        "Enter PAN",
        "text",
        false
      )}

      ${createSelect(
        "retailCategory",
        "Retail Category",
        [
          "Supermarket",
          "Grocery Store",
          "Convenience Store",
          "Restaurant",
          "Cafe",
          "Hotel",
          "Catering",
          "Other"
        ]
      )}

      ${createInput(
        "outlets",
        "Number of Outlets",
        "e.g. 1"
      )}

      ${createSelect(
        "monthlyRequirement",
        "Expected Monthly Requirement",
        [
          "Below 500 Cases",
          "500 – 1,000 Cases",
          "1,000 – 5,000 Cases",
          "5,000+ Cases"
        ]
      )}

      ${createInput(
        "address",
        "Business Address",
        "Enter complete business address",
        "text",
        true,
        true
      )}

      ${locationFields()}

    </div>

  `;

}


/* =========================================================
   DISTRIBUTION FIELDS
========================================================= */

function distributionFields() {

  sectionDescription.textContent =
    "Wholesale & distribution · business account";

  return `

    <div class="form-grid">

      ${createInput(
        "businessName",
        "Business / Firm Name",
        "Enter firm name",
        "text",
        true,
        true
      )}

      ${createInput(
        "contactPerson",
        "Primary Contact Person",
        "Enter contact person"
      )}

      ${createInput(
        "phone",
        "Business Phone",
        "+91 XXXXX XXXXX",
        "tel"
      )}

      ${createInput(
        "gstin",
        "GSTIN",
        "Enter GSTIN"
      )}

      ${createInput(
        "pan",
        "PAN",
        "Enter PAN"
      )}

      ${createSelect(
        "distributorType",
        "Distributor Type",
        [
          "Authorized Distributor",
          "Super Stockist",
          "Wholesale Distributor",
          "Regional Distributor",
          "Institutional Distributor"
        ]
      )}

      ${createInput(
        "territory",
        "Distribution Territory",
        "District / Region / Area",
        "text",
        true,
        true
      )}

      ${createSelect(
        "warehouseCapacity",
        "Warehouse / Storage Capacity",
        [
          "Below 500 Cases",
          "500 – 1,000 Cases",
          "1,000 – 5,000 Cases",
          "5,000+ Cases"
        ]
      )}

      ${createSelect(
        "existingBrands",
        "Existing Beverage Distribution",
        [
          "None",
          "Packaged Drinking Water",
          "Soft Drinks",
          "Energy Drinks",
          "Juices",
          "Multiple Beverage Brands"
        ]
      )}

      ${createSelect(
        "monthlyRequirement",
        "Expected Monthly Requirement",
        [
          "Below 500 Cases",
          "500 – 1,000 Cases",
          "1,000 – 5,000 Cases",
          "5,000+ Cases"
        ]
      )}

      ${createSelect(
        "deliveryVehicle",
        "Delivery Vehicle Availability",
        [
          "Available",
          "Partially Available",
          "Not Available"
        ]
      )}

      ${createInput(
        "address",
        "Business Address",
        "Enter complete business address",
        "text",
        true,
        true
      )}

      ${locationFields()}

    </div>

  `;

}


/* =========================================================
   LOAD ACCOUNT FIELDS
========================================================= */

function loadFields(type) {

  accountTypeInput.value = type;


  if (type === "personal") {

    dynamicFields.innerHTML =
      personalFields();

  }

  else if (type === "retail") {

    dynamicFields.innerHTML =
      retailFields();

  }

  else if (type === "distribution") {

    dynamicFields.innerHTML =
      distributionFields();

  }

  else {

    accountTypeInput.value =
      "personal";

    dynamicFields.innerHTML =
      personalFields();

  }

}


/* =========================================================
   ACCOUNT TYPE BUTTONS
========================================================= */

typeCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      /*
        Do not allow account type change
        after verification email has been sent.
      */

      if (emailVerificationSent) {
        return;
      }


      typeCards.forEach(item => {

        item.classList.remove(
          "active"
        );

      });


      card.classList.add(
        "active"
      );


      loadFields(
        card.dataset.type
      );

    }
  );

});


/* =========================================================
   GET VALUE
========================================================= */

function getValue(name) {

  const field =
    document.getElementById(name);

  if (!field) {
    return "";
  }

  return field.value.trim();

}


/* =========================================================
   COLLECT FORM DATA
========================================================= */

function collectSignupData() {

  const formData =
    new FormData(signupForm);

  const data =
    Object.fromEntries(
      formData.entries()
    );


  data.accountType =
    accountTypeInput.value;


  data.email =
    getValue("email");


  return data;

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function validateEmail() {

  const email =
    getValue("email");

  const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (!pattern.test(email)) {

    showNote(
      "error",
      `
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>Please enter a valid email address.</span>
      `
    );

    emailInput?.focus();

    return false;

  }


  return true;

}


/* =========================================================
   PASSWORD VALIDATION
========================================================= */

function validatePassword() {

  const password =
    getValue("password");

  const confirmPassword =
    getValue("confirmPassword");


  if (password.length < 8) {

    alert(
      "Password must be at least 8 characters long."
    );

    document
      .getElementById("password")
      ?.focus();

    return false;

  }


  if (
    password !==
    confirmPassword
  ) {

    alert(
      "Password and Confirm Password do not match."
    );

    document
      .getElementById("confirmPassword")
      ?.focus();

    return false;

  }


  return true;

}


/* =========================================================
   PHONE VALIDATION
========================================================= */

function validatePhone() {

  const phone =
    document.getElementById("phone");


  if (!phone) {
    return true;
  }


  const number =
    phone.value.replace(
      /\D/g,
      ""
    );


  if (
    number.length < 10 ||
    number.length > 15
  ) {

    alert(
      "Please enter a valid phone number."
    );

    phone.focus();

    return false;

  }


  return true;

}


/* =========================================================
   SHOW NOTE
========================================================= */

function showNote(
  type,
  html
) {

  if (!verificationNote) {
    return;
  }


  verificationNote.className =
    "verification-note show";


  if (type === "success") {

    verificationNote.classList.add(
      "verified"
    );

  }


  if (type === "error") {

    verificationNote.classList.add(
      "error"
    );

  }


  verificationNote.innerHTML =
    html;

}


/* =========================================================
   VERIFICATION EMAIL SENT MESSAGE
========================================================= */

function showVerificationSent(
  email
) {

  showNote(
    "success",
    `
      <i class="fa-solid fa-envelope-circle-check"></i>

      <span>
        <strong>Verification link sent.</strong>
        We have sent an email verification link to
        <strong>${escapeHtml(email)}</strong>.
        Please check your inbox and click the
        verification link to verify your email address.
      </span>
    `
  );

}


/* =========================================================
   VERIFICATION SUCCESS MESSAGE
========================================================= */

function showVerificationSuccess() {

  showNote(
    "success",
    `
      <i class="fa-solid fa-circle-check"></i>

      <span>
        <strong>Email verified successfully.</strong>
        Your email address has been verified.
        You can now tap <strong>Create Account</strong>
        to continue to your Canonical Ocean dashboard.
      </span>
    `
  );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   SET EMAIL VERIFIED UI
========================================================= */

function setEmailVerifiedUI() {

  emailVerifiedMode =
    true;


  if (emailInput) {

    emailInput.readOnly =
      true;

    emailInput.value =
      verifiedEmail ||
      emailInput.value;

    emailInput.classList.add(
      "verified"
    );

  }


  if (verifyEmailBtn) {

    verifyEmailBtn.disabled =
      true;

    verifyEmailBtn.innerHTML = `
      <i class="fa-solid fa-check"></i>
    `;

    verifyEmailBtn.classList.add(
      "verified"
    );

  }


  if (emailVerifiedState) {

    emailVerifiedState.classList.add(
      "show"
    );

  }


  showVerificationSuccess();


  /*
    Account type cannot change
    after email verification.
  */

  typeCards.forEach(card => {

    card.style.pointerEvents =
      "none";

    card.style.opacity =
      "0.65";

  });


  /*
    Create Account is now active.
  */

  if (signupButton) {

    signupButton.disabled =
      false;

    signupButton.innerHTML = `
      <span>Create Account</span>
      <i class="fa-solid fa-arrow-right"></i>
    `;

  }

}


/* =========================================================
   VERIFY EMAIL BUTTON
========================================================= */

if (verifyEmailBtn) {

  verifyEmailBtn.addEventListener(
    "click",
    async () => {

      /*
        Do not send another verification
        after email is verified.
      */

      if (emailVerifiedMode) {
        return;
      }


      /*
        Validate email
      */

      if (!validateEmail()) {
        return;
      }


      const email =
        getValue("email");


      /*
        If user has already created
        the Firebase account in this browser,
        use current user.
      */

      let user =
        auth.currentUser;


      try {

        /*
          First click:
          create Firebase account.
        */

        if (!user) {

          const password =
            getValue("password");


          /*
            Password is required
            before creating Firebase account.
          */

          if (password.length < 8) {

            showNote(
              "error",
              `
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>
                  Please create a password of at least
                  8 characters before verifying your email.
                </span>
              `
            );

            document
              .getElementById("password")
              ?.focus();

            return;

          }


          const credential =
            await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );


          user =
            credential.user;


          /*
            Personal name
          */

          const firstName =
            getValue("firstName");

          const secondName =
            getValue("secondName");

          const fullName =
            `${firstName} ${secondName}`.trim();


          if (fullName) {

            await updateProfile(
              user,
              {
                displayName:
                  fullName
              }
            );

          }

        }


        /*
          Make sure current email
          matches the entered email.
        */

        if (
          user.email &&
          user.email.toLowerCase() !==
          email.toLowerCase()
        ) {

          showNote(
            "error",
            `
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>
                The signed-in email does not match
                the email entered above.
              </span>
            `
          );

          return;

        }


        /*
          Send Firebase verification email.
        */

        await sendEmailVerification(
          user,
          {
            url:
              "https://canonicalocean.com/signup/",
            handleCodeInApp: false
          }
        );


        /*
          Remember email and account type.
        */

        localStorage.setItem(
          "canonicalOceanSignupEmail",
          email
        );


        localStorage.setItem(
          "canonicalOceanAccountType",
          accountTypeInput.value
        );


        emailVerificationSent =
          true;


        /*
          Show message:
          Verification link sent.
        */

        showVerificationSent(
          email
        );


        /*
          Disable account selection.
        */

        typeCards.forEach(card => {

          card.style.pointerEvents =
            "none";

          card.style.opacity =
            "0.65";

        });


        /*
          Arrow becomes disabled.
        */

        verifyEmailBtn.disabled =
          true;

        verifyEmailBtn.innerHTML = `
          <i class="fa-solid fa-envelope-circle-check"></i>
        `;


      }

      catch (error) {

        console.error(
          "Email Verification Error:",
          error
        );

        handleFirebaseError(
          error
        );

      }

    }
  );

}


/* =========================================================
   CHECK EMAIL VERIFICATION
========================================================= */

async function handleEmailVerification() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const mode =
    params.get("mode");

  const oobCode =
    params.get("oobCode");


  /*
    Firebase verification action link
    can directly open signup page.
  */

  if (
    mode !== "verifyEmail" ||
    !oobCode
  ) {

    /*
      Check local Firebase session
      after returning to signup.
    */

    if (
      auth.currentUser &&
      auth.currentUser.emailVerified
    ) {

      verifiedEmail =
        auth.currentUser.email;

      setEmailVerifiedUI();

    }

    return;

  }


  try {

    /*
      Apply Firebase verification code.
    */

    await applyActionCode(
      auth,
      oobCode
    );


    /*
      Reload Firebase user.
    */

    if (auth.currentUser) {

      await auth.currentUser.reload();

      verifiedEmail =
        auth.currentUser.email;

    }
    else {

      verifiedEmail =
        localStorage.getItem(
          "canonicalOceanSignupEmail"
        ) || "";

    }


    /*
      Verification completed.
    */

    setEmailVerifiedUI();


    /*
      Remove Firebase parameters
      from browser URL.
    */

    window.history.replaceState(
      {},
      document.title,
      "/signup/"
    );

  }

  catch (error) {

    console.error(
      "Email verification failed:",
      error
    );


    showNote(
      "error",
      `
        <i class="fa-solid fa-circle-exclamation"></i>

        <span>
          <strong>Email verification failed.</strong>
          This verification link may be expired
          or already used. Please request a new
          verification email.
        </span>
      `
    );

  }

}


/* =========================================================
   SAVE USER PROFILE
========================================================= */

async function saveUserProfile(
  user,
  data
) {

  const uid =
    user.uid;


  const isBusiness =
    data.accountType === "retail" ||
    data.accountType === "distribution";


  const profile = {

    uid,

    accountType:
      data.accountType,

    email:
      user.email ||
      data.email,

    displayName:
      user.displayName ||
      "",

    emailVerified:
      user.emailVerified,

    status:
      user.emailVerified
        ? (
            isBusiness
              ? "pending_business_approval"
              : "active"
          )
        : "pending_email_verification",

    createdAt:
      serverTimestamp()

  };


  Object.keys(data).forEach(
    key => {

      if (
        key !== "password" &&
        key !== "confirmPassword" &&
        key !== "terms"
      ) {

        profile[key] =
          data[key];

      }

    }
  );


  await setDoc(
    doc(
      db,
      "users",
      uid
    ),
    profile,
    {
      merge: true
    }
  );


  /*
    BUSINESS PARTNER PROFILE
  */

  if (isBusiness) {

    const partner = {

      uid,

      accountType:
        data.accountType,

      email:
        user.email ||
        data.email,

      status:
        user.emailVerified
          ? "pending_business_approval"
          : "pending_email_verification",

      createdAt:
        serverTimestamp()

    };


    Object.keys(data).forEach(
      key => {

        if (
          key !== "password" &&
          key !== "confirmPassword" &&
          key !== "terms"
        ) {

          partner[key] =
            data[key];

        }

      }
    );


    await setDoc(
      doc(
        db,
        "partners",
        uid
      ),
      partner,
      {
        merge: true
      }
    );

  }

}


/* =========================================================
   CREATE ACCOUNT AFTER EMAIL VERIFIED
========================================================= */

async function createAccountAfterVerification() {

  const user =
    auth.currentUser;


  if (!user) {

    alert(
      "Your verification session has expired. Please sign in again."
    );

    window.location.href =
      "/b2b/login/";

    return;

  }


  await user.reload();


  if (!user.emailVerified) {

    showNote(
      "error",
      `
        <i class="fa-solid fa-circle-exclamation"></i>

        <span>
          <strong>Email verification required.</strong>
          Please verify your email address before
          creating your account.
        </span>
      `
    );

    return;

  }


  /*
    Collect current form data.
  */

  const data =
    collectSignupData();


  /*
    Remove password fields from
    Firestore data later.
  */

  try {

    if (signupButton) {

      signupButton.disabled =
        true;

      signupButton.innerHTML = `
        <span>Opening Dashboard...</span>
        <i class="fa-solid fa-spinner fa-spin"></i>
      `;

    }


    /*
      Save / update Firestore.
    */

    await saveUserProfile(
      user,
      data
    );


    /*
      Clear temporary email.
    */

    localStorage.removeItem(
      "canonicalOceanSignupEmail"
    );


    /*
      Keep account type until redirect.
    */

    const accountType =
      data.accountType ||
      localStorage.getItem(
        "canonicalOceanAccountType"
      ) ||
      "personal";


    /*
      Redirect directly.
    */

    redirectAfterLogin(
      accountType,
      user
    );

  }

  catch (error) {

    console.error(
      "Create Account Error:",
      error
    );


    if (signupButton) {

      signupButton.disabled =
        false;

      signupButton.innerHTML = `
        <span>Create Account</span>
        <i class="fa-solid fa-arrow-right"></i>
      `;

    }


    handleFirebaseError(
      error
    );

  }

}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      /*
        STEP 1:
        Email verification completed.
        Create Account = Dashboard.
      */

      if (emailVerifiedMode) {

        await createAccountAfterVerification();

        return;

      }


      /*
        User must verify email first.
      */

      showNote(
        "error",
        `
          <i class="fa-solid fa-circle-exclamation"></i>

          <span>
            <strong>Please verify your email first.</strong>
            Enter your email address and tap the
            arrow button to receive the verification link.
          </span>
        `
      );

    }
  );

}


/* =========================================================
   GOOGLE SIGNUP
========================================================= */

async function googleSignup() {

  try {

    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );


    const user =
      result.user;


    const data =
      collectSignupData();


    data.email =
      user.email;


    /*
      Google email is already verified.
    */

    await saveUserProfile(
      user,
      data
    );


    redirectAfterLogin(
      data.accountType,
      user
    );

  }

  catch (error) {

    console.error(
      "Google Signup Error:",
      error
    );

    handleFirebaseError(
      error
    );

  }

}


/* =========================================================
   GOOGLE BUTTON
========================================================= */

if (googleSignupBtn) {

  googleSignupBtn.addEventListener(
    "click",
    async () => {

      googleSignupBtn.disabled =
        true;


      try {

        await googleSignup();

      }

      finally {

        googleSignupBtn.disabled =
          false;

      }

    }
  );

}


/* =========================================================
   REDIRECT AFTER LOGIN
========================================================= */

function redirectAfterLogin(
  accountType,
  user
) {

  if (!user) {
    return;
  }


  /*
    PERSONAL
  */

  if (
    accountType === "personal"
  ) {

    localStorage.removeItem(
      "canonicalOceanSignupEmail"
    );

    localStorage.removeItem(
      "canonicalOceanAccountType"
    );


    window.location.href =
      "/account/dashboard/";

    return;

  }


  /*
    RETAIL
  */

  if (
    accountType === "retail"
  ) {

    window.location.href =
      "/b2b/dashboard/";

    return;

  }


  /*
    DISTRIBUTION
  */

  if (
    accountType === "distribution"
  ) {

    window.location.href =
      "/b2b/dashboard/";

    return;

  }


  /*
    DEFAULT
  */

  window.location.href =
    "/account/dashboard/";

}


/* =========================================================
   FIREBASE ERROR HANDLER
========================================================= */

function handleFirebaseError(
  error
) {

  console.error(
    error
  );


  let message =
    "Something went wrong. Please try again.";


  switch (
    error.code
  ) {

    case "auth/email-already-in-use":

      message =
        "This email is already registered. Please sign in.";

      break;


    case "auth/invalid-email":

      message =
        "Please enter a valid email address.";

      break;


    case "auth/weak-password":

      message =
        "Password is too weak. Use at least 8 characters.";

      break;


    case "auth/invalid-action-code":

      message =
        "This verification link is invalid or has already been used.";

      break;


    case "auth/expired-action-code":

      message =
        "This verification link has expired. Please request a new one.";

      break;


    case "auth/popup-closed-by-user":

      message =
        "Google sign-in was cancelled.";

      break;


    case "auth/popup-blocked":

      message =
        "Your browser blocked the Google sign-in popup.";

      break;


    case "auth/network-request-failed":

      message =
        "Network error. Please check your internet connection.";

      break;


    case "auth/operation-not-allowed":

      message =
        "This sign-in method is not enabled in Firebase.";

      break;


    case "auth/too-many-requests":

      message =
        "Too many attempts. Please wait and try again.";

      break;

  }


  showNote(
    "error",
    `
      <i class="fa-solid fa-circle-exclamation"></i>

      <span>
        ${escapeHtml(message)}
      </span>
    `
  );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadFields(
  "personal"
);


/* =========================================================
   CHECK VERIFICATION LINK
========================================================= */

handleEmailVerification();


/* =========================================================
   CONSOLE
========================================================= */

console.log(
  "Canonical Ocean Signup initialized."
);
      
