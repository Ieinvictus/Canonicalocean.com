/* =========================================================
   CANONICAL OCEAN
   FIREBASE SIGNUP
   EMAIL VERIFICATION
   GOOGLE SIGNUP
   FIRESTORE PROFILE

   FLOW:

   SIGNUP
      ↓
   CREATE FIREBASE USER
      ↓
   SEND VERIFICATION EMAIL
      ↓
   USER VERIFIES EMAIL
      ↓
   NO AUTOMATIC REDIRECT
      ↓
   USER MANUALLY RETURNS TO SIGNUP
      ↓
   FORM DATA RESTORED
      ↓
   EMAIL VERIFIED
      ↓
   CREATE ACCOUNT
      ↓
   LOGIN PAGE
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
  updateProfile
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
   LOCAL STORAGE
========================================================= */

const SIGNUP_DRAFT_KEY =
  "canonicalOceanSignupDraft";

const VERIFICATION_EMAIL_KEY =
  "canonicalOceanVerificationEmail";

const ACCOUNT_TYPE_KEY =
  "canonicalOceanAccountType";


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

  return String(value ?? "")
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
   SHOW NOTE
========================================================= */

function showNote(type, html) {

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
   VERIFICATION SENT
========================================================= */

function showVerificationSent(email) {

  showNote(
    "success",
    `
      <i class="fa-solid fa-envelope-circle-check"></i>

      <span>
        <strong>Verification link sent successfully.</strong>
        We've sent a verification link to
        <strong>${escapeHtml(email)}</strong>.
        Please open the email and verify your email address.
        After verification, return to this signup page
        to continue.
      </span>
    `
  );

}


/* =========================================================
   EMAIL VERIFIED
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
        to continue.
      </span>
    `
  );

}


/* =========================================================
   ERROR
========================================================= */

function showErrorMessage(message) {

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
   FIREBASE ERROR HANDLER
========================================================= */

function handleFirebaseError(error) {

  console.error(
    "================================="
  );

  console.error(
    "FIREBASE ERROR CODE:",
    error?.code
  );

  console.error(
    "FIREBASE ERROR MESSAGE:",
    error?.message
  );

  console.error(
    "FULL FIREBASE ERROR:",
    error
  );

  console.error(
    "================================="
  );


  let message =
    error?.message ||
    "Unknown Firebase error.";


  switch (error?.code) {

    case "auth/invalid-email":

      message =
        "Please enter a valid email address.";

      break;


    case "auth/email-already-in-use":

      message =
        "This email address is already registered. Please sign in.";

      break;


    case "auth/weak-password":

      message =
        "Password must be at least 6 characters.";

      break;


    case "auth/invalid-api-key":

      message =
        "Firebase API key is invalid.";

      break;


    case "auth/api-key-not-valid":

      message =
        "Firebase API key is not valid. Please check the Firebase Web App configuration.";

      break;


    case "auth/network-request-failed":

      message =
        "Network error. Please check your internet connection.";

      break;


    case "auth/too-many-requests":

      message =
        "Too many attempts. Please wait and try again.";

      break;


    case "auth/popup-closed-by-user":

      message =
        "Google sign-up was cancelled.";

      break;


    case "auth/popup-blocked":

      message =
        "Your browser blocked the Google sign-up popup.";

      break;


    case "auth/operation-not-allowed":

      message =
        "This sign-in method is not enabled in Firebase Authentication.";

      break;

  }


  showErrorMessage(message);

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
            <option value="${escapeHtml(option)}">
              ${escapeHtml(option)}
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

function loadFields(type) {

  accountTypeInput.value =
    type;


  if (type === "retail") {

    dynamicFields.innerHTML =
      retailFields();

    return;

  }


  if (type === "distribution") {

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

typeCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      if (
        emailVerificationSent ||
        emailVerifiedMode
      ) {
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


      /*
        Save selected account type
      */

      localStorage.setItem(
        ACCOUNT_TYPE_KEY,
        card.dataset.type
      );

    }
  );

});


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
   SAVE SIGNUP DRAFT
   PASSWORD IS NEVER SAVED
========================================================= */

function saveSignupDraft() {

  if (!signupForm) {
    return;
  }


  const formData =
    new FormData(
      signupForm
    );


  const draft = {};


  for (
    const [key, value]
    of formData.entries()
  ) {

    /*
      NEVER store password.
    */

    if (
      key === "password" ||
      key === "confirmPassword"
    ) {
      continue;
    }


    /*
      Terms checkbox can be
      accepted again after return.
    */

    if (key === "terms") {
      continue;
    }


    draft[key] =
      String(value);

  }


  draft.accountType =
    accountTypeInput?.value ||
    "personal";


  draft.email =
    getValue("email");


  localStorage.setItem(
    SIGNUP_DRAFT_KEY,
    JSON.stringify(draft)
  );


  localStorage.setItem(
    ACCOUNT_TYPE_KEY,
    draft.accountType
  );

}


/* =========================================================
   RESTORE SIGNUP DRAFT
========================================================= */

function restoreSignupDraft() {

  const saved =
    localStorage.getItem(
      SIGNUP_DRAFT_KEY
    );


  if (!saved) {
    return;
  }


  let draft;


  try {

    draft =
      JSON.parse(saved);

  }

  catch (error) {

    console.error(
      "SIGNUP DRAFT ERROR:",
      error
    );

    return;

  }


  const accountType =
    draft.accountType ||
    localStorage.getItem(
      ACCOUNT_TYPE_KEY
    ) ||
    "personal";


  /*
    Activate correct account card.
  */

  typeCards.forEach(card => {

    card.classList.toggle(
      "active",
      card.dataset.type === accountType
    );

  });


  /*
    Build correct fields.
  */

  loadFields(
    accountType
  );


  /*
    Restore saved values.
  */

  Object.entries(draft).forEach(
    ([name, value]) => {

      if (
        name === "password" ||
        name === "confirmPassword" ||
        name === "terms" ||
        name === "accountType"
      ) {
        return;
      }


      const field =
        document.getElementById(name);


      if (field) {

        field.value =
          value ?? "";

      }

    }
  );


  /*
    Restore email.
  */

  if (
    emailInput &&
    draft.email
  ) {

    emailInput.value =
      draft.email;

  }

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


  if (password.length < 8) {

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
   DYNAMIC FIELD VALIDATION
========================================================= */

function validateDynamicFields() {

  if (!signupForm) {
    return false;
  }


  const fields =
    signupForm.querySelectorAll(
      "input, select, textarea"
    );


  for (const field of fields) {

    if (
      field.type === "hidden" ||
      field.type === "checkbox"
    ) {
      continue;
    }


    if (
      field.required &&
      !field.value.trim()
    ) {

      const label =
        field.labels?.[0]?.textContent?.trim() ||
        "This field";


      showErrorMessage(
        `${label} is required.`
      );

      field.focus();

      return false;

    }

  }


  return true;

}


/* =========================================================
   LOCK ACCOUNT TYPE
========================================================= */

function lockAccountType() {

  typeCards.forEach(card => {

    card.style.pointerEvents =
      "none";

    card.style.opacity =
      "0.65";

  });

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
    Password is not needed anymore.
    Firebase Auth user already exists.
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
    Validate email
  */

  if (!validateEmail()) {
    return;
  }


  /*
    Validate password
  */

  if (!validatePassword()) {
    return;
  }


  /*
    Validate terms
  */

  if (!validateTerms()) {
    return;
  }


  /*
    Validate dynamic fields
  */

  if (!validateDynamicFields()) {
    return;
  }


  const email =
    getValue("email");


  const password =
    getValue("password");


  /*
    SAVE EVERYTHING EXCEPT PASSWORD
  */

  saveSignupDraft();


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
       CREATE FIREBASE USER
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


      /*
        Save display name
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
       CHECK ALREADY VERIFIED
    ===================================================== */

    await user.reload();

    user =
      auth.currentUser;


    if (
      user &&
      user.emailVerified
    ) {

      verifiedEmail =
        user.email || email;

      setVerifiedUI();

      return;

    }


    /* =====================================================
       SEND EMAIL

       IMPORTANT:
       NO ActionCodeSettings
       NO continue URL
       NO automatic redirect
    ===================================================== */

    await sendEmailVerification(
      user
    );


    /* =====================================================
       SAVE VERIFICATION STATE
    ===================================================== */

    verifiedEmail =
      email;


    emailVerificationSent =
      true;


    localStorage.setItem(
      VERIFICATION_EMAIL_KEY,
      email
    );


    localStorage.setItem(
      ACCOUNT_TYPE_KEY,
      accountTypeInput.value
    );


    /* =====================================================
       LOCK EMAIL
    ===================================================== */

    if (emailInput) {

      emailInput.readOnly =
        true;

    }


    lockAccountType();


    /* =====================================================
       SUCCESS MESSAGE
    ===================================================== */

    showVerificationSent(
      email
    );

  }

  catch (error) {

    handleFirebaseError(
      error
    );

  }

  finally {

    if (
      verifyEmailBtn &&
      !emailVerifiedMode
    ) {

      verifyEmailBtn.disabled =
        false;

      verifyEmailBtn.innerHTML = `
        <i class="fa-solid fa-arrow-right"></i>
      `;

    }

  }

}


/* =========================================================
   CHECK EMAIL VERIFICATION
========================================================= */

async function checkEmailVerification() {

  try {

    let user =
      auth.currentUser;


    /*
      User has not signed in
      in this browser/session.
    */

    if (!user) {
      return;
    }


    /*
      Refresh Firebase user data.
    */

    await user.reload();


    user =
      auth.currentUser;


    if (!user) {
      return;
    }


    /*
      EMAIL VERIFIED
    */

    if (
      user.emailVerified
    ) {

      verifiedEmail =
        user.email || "";


      localStorage.setItem(
        VERIFICATION_EMAIL_KEY,
        verifiedEmail
      );


      setVerifiedUI();

      return;

    }


    /*
      Verification is still pending.
    */

    const savedEmail =
      localStorage.getItem(
        VERIFICATION_EMAIL_KEY
      );


    if (
      savedEmail &&
      user.email &&
      savedEmail.toLowerCase() ===
      user.email.toLowerCase()
    ) {

      verifiedEmail =
        user.email;


      emailVerificationSent =
        true;


      if (emailInput) {

        emailInput.value =
          user.email;

        emailInput.readOnly =
          true;

      }


      lockAccountType();


      showVerificationSent(
        user.email
      );

    }

  }

  catch (error) {

    console.error(
      "EMAIL VERIFICATION CHECK ERROR:",
      error
    );

  }

}


/* =========================================================
   CREATE FIRESTORE PROFILE
========================================================= */

async function createFirestoreProfile(
  user,
  data
) {

  if (!user) {

    throw new Error(
      "No authenticated Firebase user found."
    );

  }


  const accountType =
    data.accountType ||
    "personal";


  /* =======================================================
     PERSONAL / P2P
  ======================================================= */

  if (
    accountType === "personal"
  ) {

    await setDoc(
      doc(
        db,
        "users",
        user.uid
      ),
      {

        uid:
          user.uid,

        accountType:
          "personal",

        firstName:
          data.firstName || "",

        secondName:
          data.secondName || "",

        name:
          `${data.firstName || ""} ${data.secondName || ""}`.trim(),

        email:
          user.email ||
          data.email ||
          "",

        emailVerified:
          true,

        status:
          "active",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()

      },
      {
        merge: true
      }
    );

    return;

  }


  /* =======================================================
     RETAIL / DISTRIBUTION
  ======================================================= */

  await setDoc(
    doc(
      db,
      "partners",
      user.uid
    ),
    {

      uid:
        user.uid,

      accountType:
        accountType,

      businessName:
        data.businessName || "",

      contactPerson:
        data.contactPerson || "",

      phone:
        data.phone || "",

      email:
        user.email ||
        data.email ||
        "",

      gstin:
        data.gstin || "",

      pan:
        data.pan || "",

      retailCategory:
        data.retailCategory || "",

      distributorType:
        data.distributorType || "",

      territory:
        data.territory || "",

      outlets:
        data.outlets || "",

      warehouseCapacity:
        data.warehouseCapacity || "",

      existingBrands:
        data.existingBrands || "",

      monthlyRequirement:
        data.monthlyRequirement || "",

      deliveryVehicle:
        data.deliveryVehicle || "",

      address:
        data.address || "",

      village:
        data.village || "",

      taluka:
        data.taluka || "",

      district:
        data.district || "",

      state:
        data.state || "",

      country:
        data.country ||
        "India",

      zipCode:
        data.zipCode || "",

      status:
        "pending",

      emailVerified:
        true,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp()

    },
    {
      merge: true
    }
  );

}


/* =========================================================
   REDIRECT AFTER CREATE ACCOUNT
========================================================= */

function redirectAfterAccountCreation(
  accountType
) {

  /*
    P2P / Personal
  */

  if (
    accountType === "personal"
  ) {

    window.location.href =
      "/account/login/";

    return;

  }


  /*
    Retail Partner
  */

  if (
    accountType === "retail"
  ) {

    window.location.href =
      "/b2b/login/";

    return;

  }


  /*
    Distribution Partner
  */

  if (
    accountType === "distribution"
  ) {

    window.location.href =
      "/b2b/login/";

    return;

  }


  /*
    Fallback
  */

  window.location.href =
    "/b2b/login/";

}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

async function createAccount() {

  try {

    let user =
      auth.currentUser;


    if (!user) {

      showErrorMessage(
        "Your Firebase session has expired. Please verify your email again."
      );

      return;

    }


    /* =====================================================
       REFRESH USER
    ===================================================== */

    await user.reload();

    user =
      auth.currentUser;


    /* =====================================================
       VERIFIED CHECK
    ===================================================== */

    if (
      !user ||
      !user.emailVerified
    ) {

      showErrorMessage(
        "Please verify your email address before creating your account."
      );

      return;

    }


    /* =====================================================
       TERMS
    ===================================================== */

    if (!validateTerms()) {
      return;
    }


    /* =====================================================
       FORM DATA
    ===================================================== */

    if (!validateDynamicFields()) {
      return;
    }


    /* =====================================================
       PHONE
    ===================================================== */

    if (!validatePhone()) {
      return;

    }


    const data =
      collectSignupData();


    data.email =
      user.email ||
      data.email;


    data.emailVerified =
      true;


    /* =====================================================
       LOADING
    ===================================================== */

    if (createAccountBtn) {

      createAccountBtn.disabled =
        true;

      createAccountBtn.innerHTML = `
        <span>Creating Account...</span>
        <i class="fa-solid fa-spinner fa-spin"></i>
      `;

    }


    /* =====================================================
       FIRESTORE
    ===================================================== */

    await createFirestoreProfile(
      user,
      data
    );


    /* =====================================================
       CLEAR DRAFT
       ONLY AFTER SUCCESS
    ===================================================== */

    localStorage.removeItem(
      SIGNUP_DRAFT_KEY
    );

    localStorage.removeItem(
      VERIFICATION_EMAIL_KEY
    );

    localStorage.removeItem(
      ACCOUNT_TYPE_KEY
    );


    accountCreated =
      true;


    /* =====================================================
       REDIRECT TO LOGIN
    ===================================================== */

    redirectAfterAccountCreation(
      data.accountType
    );

  }

  catch (error) {

    console.error(
      "CREATE ACCOUNT ERROR:",
      error
    );


    handleFirebaseError(
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

  }

}


/* =========================================================
   GOOGLE SIGNUP
========================================================= */

async function googleSignup() {

  if (!validateTerms()) {
    return;
  }


  if (googleSignupBtn) {

    googleSignupBtn.disabled =
      true;

    googleSignupBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Connecting...
    `;

  }


  try {

    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );


    const user =
      result.user;


    if (!user) {

      throw new Error(
        "Google authentication failed."
      );

    }


    /*
      Google account email is already
      authenticated by Google.
    */

    const displayName =
      user.displayName || "";


    const nameParts =
      displayName
        .trim()
        .split(/\s+/);


    const firstName =
      nameParts.shift() || "";


    const secondName =
      nameParts.join(" ") || "";


    const accountType =
      accountTypeInput.value ||
      "personal";


    const data =
      collectSignupData();


    data.accountType =
      accountType;


    data.firstName =
      data.firstName ||
      firstName;


    data.secondName =
      data.secondName ||
      secondName;


    data.email =
      user.email || "";


    data.emailVerified =
      true;


    /*
      Validate business fields.
    */

    if (
      accountType !== "personal"
    ) {

      if (
        !validateDynamicFields()
      ) {

        return;

      }

    }


    await createFirestoreProfile(
      user,
      data
    );


    accountCreated =
      true;


    redirectAfterAccountCreation(
      accountType
    );

  }

  catch (error) {

    handleFirebaseError(
      error
    );

  }

  finally {

    if (
      googleSignupBtn &&
      !accountCreated
    ) {

      googleSignupBtn.disabled =
        false;

      googleSignupBtn.innerHTML = `
        <i class="fa-brands fa-google"></i>
        Continue with Google
      `;

    }

  }

}


/* =========================================================
   VERIFY EMAIL BUTTON
========================================================= */

if (verifyEmailBtn) {

  verifyEmailBtn.addEventListener(
    "click",
    async () => {

      if (emailVerifiedMode) {
        return;
      }


      await sendVerificationEmail();

    }
  );

}


/* =========================================================
   CREATE ACCOUNT BUTTON
========================================================= */

if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      /*
        Create Account only works
        after email verification.
      */

      if (!emailVerifiedMode) {

        showErrorMessage(
          "Please verify your email address first."
        );

        return;

      }


      await createAccount();

    }
  );

}


/* =========================================================
   GOOGLE BUTTON
========================================================= */

if (googleSignupBtn) {

  googleSignupBtn.addEventListener(
    "click",
    googleSignup
  );

}


/* =========================================================
   INITIAL ACCOUNT TYPE
========================================================= */

function initializeAccountType() {

  const activeCard =
    document.querySelector(
      ".type-card.active"
    );


  if (activeCard) {

    loadFields(
      activeCard.dataset.type
    );

    return;

  }


  loadFields(
    "personal"
  );

}


/* =========================================================
   RESTORE PAGE
========================================================= */

async function restorePageState() {

  /*
    FIRST:
    Restore all saved form information.
  */

  restoreSignupDraft();


  /*
    THEN:
    Check saved verification email.
  */

  const savedEmail =
    localStorage.getItem(
      VERIFICATION_EMAIL_KEY
    );


  if (
    savedEmail &&
    emailInput &&
    !emailInput.value
  ) {

    emailInput.value =
      savedEmail;

  }


  /*
    Finally check Firebase.
  */

  await checkEmailVerification();

}


/* =========================================================
   INITIALIZE
========================================================= */

initializeAccountType();


/*
  Run after DOM is ready.
*/

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await restorePageState();

  }
);


/*
  Also run immediately because
  module script is normally loaded
  after the HTML elements.
*/

restorePageState();


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

auth.onAuthStateChanged(
  async user => {

    if (!user) {
      return;
    }


    try {

      await user.reload();


      const currentUser =
        auth.currentUser;


      if (
        currentUser &&
        currentUser.emailVerified
      ) {

        verifiedEmail =
          currentUser.email || "";


        setVerifiedUI();

      }

    }

    catch (error) {

      console.error(
        "AUTH STATE ERROR:",
        error
      );

    }

  }
);
