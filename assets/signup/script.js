/* =========================================================
   CANONICAL OCEAN
   FIREBASE SIGNUP
   Email/Password + Google + Firestore
   Email Verification → Direct Dashboard
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
  serverTimestamp,
  updateDoc
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
  signupForm?.querySelector(".submit-btn");


/* =========================================================
   STATE
========================================================= */

let emailVerifiedMode = false;

let verifiedUser = null;


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
   PERSONAL
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
   RETAIL
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
   DISTRIBUTION
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

  accountTypeInput.value =
    type;


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

      if (emailVerifiedMode) {
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
   EMAIL VALIDATION
========================================================= */

function validateEmail() {

  const email =
    getValue("email");

  const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (!pattern.test(email)) {

    alert(
      "Please enter a valid email address."
    );

    document
      .getElementById("email")
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
   VERIFICATION NOTE
========================================================= */

function showVerificationNote(
  email,
  verified = false
) {

  let note =
    document.getElementById(
      "verificationNote"
    );


  if (!note) {

    note =
      document.createElement(
        "div"
      );

    note.id =
      "verificationNote";

    note.className =
      "verification-note";

    signupForm.parentNode.insertBefore(
      note,
      signupForm
    );

  }


  if (verified) {

    note.innerHTML = `
      <i class="fa-solid fa-circle-check"></i>

      <span>
        <strong>Email verified successfully.</strong>
        Your Canonical Ocean account is ready.
        Tap <strong>Create Account</strong> to continue
        directly to your dashboard.
      </span>
    `;

    return;

  }


  note.innerHTML = `
    <i class="fa-solid fa-envelope-circle-check"></i>

    <span>
      <strong>Your account has been created.</strong>
      We have sent a verification link to
      <strong>${email}</strong>.
      Please verify your email address to activate
      your account. After verification, return here
      and tap <strong>Create Account</strong> to continue
      to your Canonical Ocean dashboard.
    </span>
  `;

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


  delete data.password;
  delete data.confirmPassword;
  delete data.terms;


  const isBusiness =
    data.accountType === "retail" ||
    data.accountType === "distribution";


  /*
    Personal:
    active after email verification

    Business:
    pending business approval
  */

  const userProfile = {

    uid: uid,

    accountType:
      data.accountType,

    email:
      user.email || data.email,

    displayName:
      user.displayName || "",

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
        key !== "terms" &&
        key !== "createdAt"
      ) {

        userProfile[key] =
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
    userProfile,
    {
      merge: true
    }
  );


  /*
    BUSINESS PARTNER
  */

  if (isBusiness) {

    const partnerData = {

      uid: uid,

      accountType:
        data.accountType,

      email:
        user.email || data.email,

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
          key !== "terms" &&
          key !== "createdAt"
        ) {

          partnerData[key] =
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
      partnerData,
      {
        merge: true
      }
    );

  }

}


/* =========================================================
   EMAIL PASSWORD SIGNUP
========================================================= */

async function emailPasswordSignup() {

  const email =
    getValue("email");

  const password =
    getValue("password");


  try {

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user =
      credential.user;


    /*
      Display name
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


    /*
      Collect form
    */

    const data =
      collectSignupData();


    /*
      Send verification email
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
      Remember email only.
      NEVER store password.
    */

    localStorage.setItem(
      "canonicalOceanSignupEmail",
      email
    );


    localStorage.setItem(
      "canonicalOceanAccountType",
      data.accountType
    );


    /*
      Save Firestore
    */

    await saveUserProfile(
      user,
      data
    );


    /*
      DO NOT sign out.
      Firebase keeps the authenticated
      session in this browser.
    */


    /*
      Show professional note
    */

    showVerificationNote(
      email,
      false
    );


    /*
      Disable account type selection
      while verification is pending.
    */

    typeCards.forEach(card => {

      card.style.pointerEvents =
        "none";

      card.style.opacity =
        "0.65";

    });


    /*
      Change button state
    */

    if (signupButton) {

      signupButton.disabled =
        true;

      signupButton.innerHTML = `
        <span>Check Your Email</span>
        <i class="fa-solid fa-envelope"></i>
      `;

    }


    /*
      Do NOT redirect to login.
    */

    console.log(
      "Verification email sent to:",
      email
    );

  }

  catch (error) {

    console.error(
      "Firebase Signup Error:",
      error
    );

    handleFirebaseError(
      error
    );

  }

}


/* =========================================================
   VERIFY EMAIL FROM FIREBASE ACTION LINK
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


  if (
    mode !== "verifyEmail" ||
    !oobCode
  ) {

    return false;

  }


  try {

    /*
      Apply Firebase verification code
    */

    await applyActionCode(
      auth,
      oobCode
    );


    /*
      Reload current Firebase user
    */

    if (auth.currentUser) {

      await auth.currentUser.reload();

      verifiedUser =
        auth.currentUser;

    }


    emailVerifiedMode =
      true;


    /*
      Show verified message
    */

    showVerificationNote(
      verifiedUser?.email ||
      localStorage.getItem(
        "canonicalOceanSignupEmail"
      ) ||
      "",
      true
    );


    /*
      Change button to active
    */

    if (signupButton) {

      signupButton.disabled =
        false;

      signupButton.innerHTML = `
        <span>Create Account</span>
        <i class="fa-solid fa-arrow-right"></i>
      `;

    }


   /*
      Hide unnecessary validation fields
      from second account creation.
    */

    const password =
      document.getElementById(
        "password"
      );

    const confirmPassword =
      document.getElementById(
        "confirmPassword"
      );

    if (password) {
      password.required = false;
    }

    if (confirmPassword) {
      confirmPassword.required = false;
    }


    /*
      Disable account type changes
    */

    typeCards.forEach(card => {

      card.style.pointerEvents =
        "none";

      card.style.opacity =
        "0.65";

    });


    /*
      Clean verification parameters
      from URL.
    */

    window.history.replaceState(
      {},
      document.title,
      "/signup/"
    );


    return true;

  }

  catch (error) {

    console.error(
      "Email Verification Error:",
      error
    );


    showVerificationError(
      error
    );

    return false;

  }

}


/* =========================================================
   VERIFICATION ERROR
========================================================= */

function showVerificationError(
  error
) {

  let message =
    "This verification link is invalid or has expired.";


  if (
    error.code ===
    "auth/invalid-action-code"
  ) {

    message =
      "This verification link has expired or has already been used.";

  }


  let note =
    document.getElementById(
      "verificationNote"
    );


  if (!note) {

    note =
      document.createElement(
        "div"
      );

    note.id =
      "verificationNote";

    note.className =
      "verification-note";

    signupForm.parentNode.insertBefore(
      note,
      signupForm
    );

  }


  note.innerHTML = `
    <i class="fa-solid fa-circle-exclamation"></i>

    <span>
      <strong>Verification could not be completed.</strong>
      ${message}
      Please request a new verification email.
    </span>
  `;

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


    const accountType =
      accountTypeInput.value;


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


    /*
      Direct dashboard
    */

    redirectAfterLogin(
      accountType,
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
    Personal
  */

  if (
    accountType ===
    "personal"
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
    Retail / Distribution
  */

  if (
    accountType === "retail" ||
    accountType === "distribution"
  ) {

    window.location.href =
      "/b2b/dashboard/";

    return;

  }


  window.location.href =
    "/account/dashboard/";

}


/* =========================================================
   CONTINUE AFTER VERIFICATION
========================================================= */

async function continueAfterVerification() {

  try {

    if (!auth.currentUser) {

      alert(
        "Your verification session has expired. Please sign in again."
      );

      window.location.href =
        "/b2b/login/";

      return;

    }


    await auth.currentUser.reload();


    const user =
      auth.currentUser;


    if (!user.emailVerified) {

      alert(
        "Please verify your email address first."
      );

      return;

    }


    const accountType =
      localStorage.getItem(
        "canonicalOceanAccountType"
      ) ||
      accountTypeInput.value;


    /*
      Update Firestore email verification
    */

    try {

      await updateDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          emailVerified: true,

          status:
            accountType === "retail" ||
            accountType === "distribution"
              ? "pending_business_approval"
              : "active"
        }
      );

    }

    catch (error) {

      console.warn(
        "User verification status update skipped:",
        error
      );

    }


    /*
      Direct dashboard
    */

    redirectAfterLogin(
      accountType,
      user
    );

  }

  catch (error) {

    console.error(
      "Continue error:",
      error
    );

    alert(
      "Unable to continue. Please sign in again."
    );

  }

}


/* =========================================================
   FIREBASE ERROR HANDLER
========================================================= */

function handleFirebaseError(
  error
) {

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


  alert(message);

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
        IMPORTANT:
        If email has already been verified,
        Create Account means CONTINUE TO DASHBOARD.
      */

      if (emailVerifiedMode) {

        await continueAfterVerification();

        return;

      }


      /*
        Browser validation
      */

      if (
        !signupForm.checkValidity()
      ) {

        signupForm.reportValidity();

        return;

      }


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
        Phone
      */

      if (!validatePhone()) {
        return;
      }


      /*
        Terms
      */

      const terms =
        document.getElementById(
          "terms"
        );


      if (
        !terms ||
        !terms.checked
      ) {

        alert(
          "Please accept the Terms and Privacy Policy."
        );

        terms?.focus();

        return;

      }


      /*
        Button loading
      */

      const button =
        signupForm.querySelector(
          ".submit-btn"
        );


      if (button) {

        button.disabled =
          true;

        button.innerHTML = `
          <span>Creating account...</span>
          <i class="fa-solid fa-spinner fa-spin"></i>
        `;

      }


      try {

        await emailPasswordSignup();

      }

      finally {

        /*
          Do not restore the button
          if verification process started.
        */

        if (
          button &&
          !emailVerifiedMode &&
          !auth.currentUser
        ) {

          button.disabled =
            false;

          button.innerHTML = `
            <span>Create Account</span>
            <i class="fa-solid fa-arrow-right"></i>
          `;

        }

      }

    }
  );

}


/* =========================================================
   GOOGLE BUTTON
========================================================= */

const googleSignupBtn =
  document.getElementById(
    "googleSignupBtn"
  );


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
   INITIAL LOAD
========================================================= */

loadFields(
  "personal"
);


/* =========================================================
   CHECK FIREBASE VERIFICATION LINK
========================================================= */

handleEmailVerification();


/* =========================================================
   CONSOLE
========================================================= */

console.log(
  "Canonical Ocean Firebase Signup initialized."
);
   
