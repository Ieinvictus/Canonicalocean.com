/* =========================================================
   CANONICAL OCEAN
   FIREBASE SIGNUP
   EMAIL VERIFICATION FLOW
   GOOGLE SIGNUP
   FIRESTORE PROFILE
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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

  /*
    IMPORTANT:
    This is the corrected API key.
  */

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


/* =========================================================
   GOOGLE PROVIDER
========================================================= */

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

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const confirmPasswordInput =
  document.getElementById("confirmPassword");

const verifyEmailBtn =
  document.getElementById("verifyEmailBtn");

const emailVerifiedState =
  document.getElementById("emailVerifiedState");

const verificationNote =
  document.getElementById("verificationNote");

const createAccountBtn =
  document.getElementById("createAccountBtn");

const googleSignupBtn =
  document.getElementById("googleSignupBtn");


/* =========================================================
   STATE
========================================================= */

let emailVerificationSent =
  false;

let emailVerifiedMode =
  false;

let verifiedEmail =
  "";

let accountCreated =
  false;


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


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
   SHOW MESSAGE
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


  verificationNote.classList.remove(
    "verified",
    "error"
  );


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
   SUCCESS — EMAIL SENT
========================================================= */

function showVerificationSent(
  email
) {

  showNote(
    "success",
    `
      <i class="fa-solid fa-envelope-circle-check"></i>

      <span>
        <strong>Verification link sent successfully.</strong>
        We've sent a verification link to
        <strong>${escapeHtml(email)}</strong>.
        Please check your email and click the
        verification link to verify your email address.
      </span>
    `
  );

}


/* =========================================================
   SUCCESS — EMAIL VERIFIED
========================================================= */

function showVerificationSuccess() {

  showNote(
    "success",
    `
      <i class="fa-solid fa-circle-check"></i>

      <span>
        <strong>Email verified successfully.</strong>
        Your email address has been verified.
        Tap <strong>Create Account</strong>
        to continue to your Canonical Ocean dashboard.
      </span>
    `
  );

}


/* =========================================================
   ERROR
========================================================= */

function showErrorMessage(
  message
) {

  showNote(
    "error",
    `
      <i class="fa-solid fa-circle-exclamation"></i>

      <span>
        <strong>Unable to continue.</strong>
        ${escapeHtml(message)}
      </span>
    `
  );

}


/* =========================================================
   INPUT CREATOR
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


/* =========================================================
   SELECT CREATOR
========================================================= */

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

        ${options.map(
          option => `
            <option value="${option}">
              ${option}
            </option>
          `
        ).join("")}

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
   LOAD ACCOUNT TYPE
========================================================= */

function loadFields(
  type
) {

  accountTypeInput.value =
    type;


  if (
    type === "retail"
  ) {

    dynamicFields.innerHTML =
      retailFields();

    return;

  }


  if (
    type === "distribution"
  ) {

    dynamicFields.innerHTML =
      distributionFields();

    return;

  }


  dynamicFields.innerHTML =
    personalFields();

}


/* =========================================================
   ACCOUNT TYPE BUTTONS
========================================================= */

typeCards.forEach(
  card => {

    card.addEventListener(
      "click",
      () => {

        if (
          emailVerificationSent ||
          emailVerifiedMode
        ) {

          return;

        }


        typeCards.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        card.classList.add(
          "active"
        );


        loadFields(
          card.dataset.type
        );

      }
    );

  }
);


/* =========================================================
   COLLECT FORM DATA
========================================================= */

function collectSignupData() {

  const formData =
    new FormData(
      signupForm
    );


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


  if (
    !pattern.test(email)
  ) {

    showErrorMessage(
      "Please enter a valid email address."
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


  if (
    password.length < 8
  ) {

    showErrorMessage(
      "Password must be at least 8 characters long."
    );

    passwordInput?.focus();

    return false;

  }


  if (
    password !==
    confirmPassword
  ) {

    showErrorMessage(
      "Password and Confirm Password do not match."
    );

    confirmPasswordInput?.focus();

    return false;

  }


  return true;

}


/* =========================================================
   PHONE VALIDATION
========================================================= */

function validatePhone() {

  const phone =
    document.getElementById(
      "phone"
    );


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

    showErrorMessage(
      "Please enter a valid phone number."
    );

    phone.focus();

    return false;

  }


  return true;

}


/* =========================================================
   TERMS VALIDATION
========================================================= */

function validateTerms() {

  const terms =
    document.getElementById(
      "terms"
    );


  if (
    !terms ||
    !terms.checked
  ) {

    showErrorMessage(
      "Please accept the Terms and Privacy Policy."
    );

    terms?.focus();

    return false;

  }


  return true;

}


/* =========================================================
   DISABLE ACCOUNT TYPE
========================================================= */

function lockAccountType() {

  typeCards.forEach(
    card => {

      card.style.pointerEvents =
        "none";

      card.style.opacity =
        "0.65";

    }
  );

}


/* =========================================================
   VERIFIED UI
========================================================= */

function setVerifiedUI() {

  emailVerifiedMode =
    true;

  emailVerificationSent =
    true;


  if (emailInput) {

    emailInput.readOnly =
      true;

    if (verifiedEmail) {

      emailInput.value =
        verifiedEmail;

    }

  }


  if (verifyEmailBtn) {

    verifyEmailBtn.disabled =
      true;

    verifyEmailBtn.innerHTML = `
      <i class="fa-solid fa-check"></i>
    `;

  }


  if (emailVerifiedState) {

    emailVerifiedState.classList.add(
      "show"
    );

  }


  lockAccountType();


  /*
    Password is no longer required
    for the second Create Account step.
  */

  if (passwordInput) {

    passwordInput.required =
      false;

  }


  if (confirmPasswordInput) {

    confirmPasswordInput.required =
      false;

  }


  if (createAccountBtn) {

    createAccountBtn.disabled =
      false;

    createAccountBtn.innerHTML = `
      <span>Create Account</span>
      <i class="fa-solid fa-arrow-right"></i>
    `;

  }


  showVerificationSuccess();

}


/* =========================================================
   SEND VERIFICATION EMAIL
========================================================= */

async function sendVerificationEmail() {

  /*
    Email
  */

  if (!validateEmail()) {
    return;
  }


  /*
    Password
  */

  if (!validatePassword()) {
    return;
  }


  /*
    Terms
  */

  if (!validateTerms()) {
    return;
  }


  const email =
    getValue("email");


  const password =
    getValue("password");


  /*
    Loading
  */

  if (verifyEmailBtn) {

    verifyEmailBtn.disabled =
      true;

    verifyEmailBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
    `;

  }


  try {

    let user =
      auth.currentUser;


    /* =====================================================
       CREATE USER
    ===================================================== */

    if (!user) {

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );


      user =
        credential.user;


      accountCreated =
        true;


      /* ===================================================
         DISPLAY NAME
      =================================================== */

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


    /* =====================================================
       EMAIL MATCH
    ===================================================== */

    if (
      user.email &&
      user.email.toLowerCase() !==
      email.toLowerCase()
    ) {

      throw new Error(
        "The current Firebase account does not match the email entered above."
      );

    }


   
/* =====================================================
       FIREBASE EMAIL ACTION SETTINGS
    ===================================================== */

    const actionCodeSettings = {

      url:
        "https://canonicalocean.com/signup/",

      handleCodeInApp:
        false

    };


    /* =====================================================
       SEND VERIFICATION EMAIL
    ===================================================== */

    await sendEmailVerification(
      user,
      actionCodeSettings
    );


    /* =====================================================
       SAVE ONLY SAFE TEMP DATA
       NEVER SAVE PASSWORD
    ===================================================== */

    localStorage.setItem(
      "canonicalOceanSignupEmail",
      email
    );


    localStorage.setItem(
      "canonicalOceanAccountType",
      accountTypeInput.value
    );


    /*
      Store that signup has started.
    */

    localStorage.setItem(
      "canonicalOceanVerificationPending",
      "true"
    );


    emailVerificationSent =
      true;


    /* =====================================================
       SUCCESS MESSAGE
    ===================================================== */

    showVerificationSent(
      email
    );


    /* =====================================================
       LOCK EMAIL
    ===================================================== */

    if (emailInput) {

      emailInput.readOnly =
        true;

    }


    /* =====================================================
       LOCK ACCOUNT TYPE
    ===================================================== */

    lockAccountType();


    /* =====================================================
       CHANGE ARROW
    ===================================================== */

    if (verifyEmailBtn) {

      verifyEmailBtn.innerHTML = `
        <i class="fa-solid fa-envelope-circle-check"></i>
      `;

    }


  }

  catch (error) {

    console.error(
      "CANONICAL OCEAN EMAIL VERIFICATION ERROR:",
      error
    );


    if (verifyEmailBtn) {

      verifyEmailBtn.disabled =
        false;

      verifyEmailBtn.innerHTML = `
        <i class="fa-solid fa-arrow-right"></i>
      `;

    }


    handleFirebaseError(
      error
    );

  }

}


/* =========================================================
   VERIFY EMAIL BUTTON
========================================================= */

if (verifyEmailBtn) {

  verifyEmailBtn.addEventListener(
    "click",
    sendVerificationEmail
  );

}


/* =========================================================
   HANDLE EMAIL VERIFICATION LINK
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


  /* =====================================================
     CASE 1
     Firebase sends oobCode to signup
  ===================================================== */

  if (
    mode === "verifyEmail" &&
    oobCode
  ) {

    try {

      await applyActionCode(
        auth,
        oobCode
      );


      if (auth.currentUser) {

        await auth.currentUser.reload();

        verifiedEmail =
          auth.currentUser.email || "";

      }
      else {

        verifiedEmail =
          localStorage.getItem(
            "canonicalOceanSignupEmail"
          ) || "";

      }


      localStorage.setItem(
        "canonicalOceanEmailVerified",
        "true"
      );


      setVerifiedUI();


      /*
        Remove Firebase parameters.
      */

      window.history.replaceState(
        {},
        document.title,
        "/signup/"
      );


      return;

    }

    catch (error) {

      console.error(
        "FIREBASE ACTION CODE ERROR:",
        error
      );


      let message =
        "This verification link is invalid or has expired.";


      if (
        error?.code ===
        "auth/invalid-action-code"
      ) {

        message =
          "This verification link has already been used or is no longer valid.";

      }


      if (
        error?.code ===
        "auth/expired-action-code"
      ) {

        message =
          "This verification link has expired. Please request a new verification email.";

      }


      showErrorMessage(
        message
      );

      return;

    }

  }


  /* =====================================================
     CASE 2
     Firebase verifies email on its hosted page
     and redirects back to signup.
  ===================================================== */

  if (
    auth.currentUser
  ) {

    try {

      await auth.currentUser.reload();


      if (
        auth.currentUser.emailVerified
      ) {

        verifiedEmail =
          auth.currentUser.email || "";


        localStorage.setItem(
          "canonicalOceanEmailVerified",
          "true"
        );


        setVerifiedUI();

      }

    }

    catch (error) {

      console.warn(
        "Firebase user reload failed:",
        error
      );

    }

  }

}


/* =========================================================
   SAVE FIRESTORE USER PROFILE
========================================================= */

async function saveUserProfile(
  user,
  data
) {

  const isBusiness =
    data.accountType === "retail" ||
    data.accountType === "distribution";


  const profile = {

    uid:
      user.uid,

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
      isBusiness
        ? "pending_business_approval"
        : "active",

    createdAt:
      serverTimestamp()

  };


  /*
    Add form data.
    Password is NEVER saved.
  */

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


  /* =====================================================
     USERS
  ===================================================== */

  await setDoc(
    doc(
      db,
      "users",
      user.uid
    ),
    profile,
    {
      merge: true
    }
  );


  /* =====================================================
     BUSINESS PARTNER
  ===================================================== */

  if (isBusiness) {

    await setDoc(
      doc(
        db,
        "partners",
        user.uid
      ),
      {
        ...profile,

        partnerStatus:
          "pending_business_approval"

      },
      {
        merge: true
      }
    );

  }

}


/* =========================================================
   CREATE ACCOUNT
   AFTER EMAIL VERIFICATION
========================================================= */

async function createAccount() {

  try {

    const user =
      auth.currentUser;


    if (!user) {

      showErrorMessage(
        "Your signup session has expired. Please sign in again."
      );

      return;

    }


    /*
      Refresh Firebase user.
    */

    await user.reload();


    /*
      Check email verification.
    */

    if (
      !user.emailVerified
    ) {

      showErrorMessage(
        "Please verify your email address first."
      );

      return;

    }


    /*
      Button loading.
    */

    if (createAccountBtn) {

      createAccountBtn.disabled =
        true;

      createAccountBtn.innerHTML = `
        <span>Opening Dashboard...</span>
        <i class="fa-solid fa-spinner fa-spin"></i>
      `;

    }


    const data =
      collectSignupData();


    /*
      Make sure verified email
      is used.
    */

    data.email =
      user.email;


    /*
      Save Firestore profile.
    */

    await saveUserProfile(
      user,
      data
    );


    /*
      Account type.
    */

    const accountType =
      localStorage.getItem(
        "canonicalOceanAccountType"
      ) ||
      data.accountType ||
      "personal";


    /*
      Clear temporary data.
    */

    localStorage.removeItem(
      "canonicalOceanSignupEmail"
    );

    localStorage.removeItem(
      "canonicalOceanAccountType"
    );

    localStorage.removeItem(
      "canonicalOceanVerificationPending"
    );

    localStorage.removeItem(
      "canonicalOceanEmailVerified"
    );


    /*
      Direct dashboard.
    */

    redirectAfterLogin(
      accountType
    );

  }

  catch (error) {

    console.error(
      "CREATE ACCOUNT ERROR:",
      error
    );


    if (createAccountBtn) {

      createAccountBtn.disabled =
        false;

      createAccountBtn.innerHTML = `
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
   CREATE ACCOUNT BUTTON / FORM
========================================================= */

if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      /*
        BEFORE VERIFICATION
      */

      if (!emailVerifiedMode) {

        showErrorMessage(
          "Please verify your email address first. Tap the arrow beside your email to receive the verification link."
        );

        return;

      }


      /*
        AFTER VERIFICATION
      */

      await createAccount();

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
      Google accounts have
      verified email status.
    */

    await user.reload();


    if (
      !user.emailVerified
    ) {

      throw new Error(
        "Google account email could not be verified."
      );

    }


    /*
      Save profile.
    */

    await saveUserProfile(
      user,
      data
    );


    /*
      Direct dashboard.
    */

    redirectAfterLogin(
      data.accountType
    );

  }

  catch (error) {

    console.error(
      "GOOGLE SIGNUP ERROR:",
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


      googleSignupBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Connecting...
      `;


      try {

        await googleSignup();

      }

      finally {

        googleSignupBtn.disabled =
          false;

        googleSignupBtn.innerHTML = `
          <i class="fa-brands fa-google"></i>
          Continue with Google
        `;

      }

    }
  );

}


/* =========================================================
   REDIRECT AFTER ACCOUNT
========================================================= */

function redirectAfterLogin(
  accountType
) {

  /*
    PERSONAL
  */

  if (
    accountType === "personal"
  ) {

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
    "Firebase Error Code:",
    error?.code
  );

  console.error(
    "Firebase Error Message:",
    error?.message
  );


  let message =
    "Something went wrong. Please try again.";


  switch (
    error?.code
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
        "Password must be at least 8 characters long.";

      break;


    case "auth/operation-not-allowed":

      message =
        "Email/Password sign-in is not enabled in Firebase. Enable it from Authentication → Sign-in method.";

      break;


    case "auth/unauthorized-continue-uri":

      message =
        "canonicalocean.com is not authorized for Firebase email verification. Add canonicalocean.com under Firebase Authentication → Settings → Authorized domains.";

      break;


    case "auth/invalid-continue-uri":

      message =
        "The Firebase verification return URL is invalid. Check the Authorized Domains settings.";

      break;


    case "auth/network-request-failed":

      message =
        "Network connection failed. Please check your internet connection and try again.";

      break;


    case "auth/too-many-requests":

      message =
        "Too many attempts were made. Please wait a few minutes and try again.";

      break;


    case "auth/requires-recent-login":

      message =
        "Please sign in again before continuing.";

      break;


    case "auth/invalid-action-code":

      message =
        "This verification link is invalid or has already been used.";

      break;


    case "auth/expired-action-code":

      message =
        "This verification link has expired. Please request a new verification email.";

      break;


    case "auth/user-disabled":

      message =
        "This account has been disabled. Please contact Canonical Ocean support.";

      break;


    case "auth/user-not-found":

      message =
        "No account was found for this email address.";

      break;


    default:

      if (
        error?.message
      ) {

        message =
          error.message
            .replace(
              /^Firebase:\s*/i,
              ""
            )
            .replace(
              /\s*\(auth\/.*\)\.?$/i,
              ""
            );

      }

      else if (
        error instanceof Error &&
        error.message
      ) {

        message =
          error.message;

      }

      break;

  }


  showErrorMessage(
    message
  );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadFields(
  "personal"
);


/* =========================================================
   CHECK EMAIL VERIFICATION
========================================================= */

handleEmailVerification();


/* =========================================================
   READY
========================================================= */

console.log(
  "Canonical Ocean Signup initialized successfully."
);
