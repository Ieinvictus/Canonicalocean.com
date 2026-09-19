/* =========================================================
   CANONICAL OCEAN
   FIREBASE SIGNUP
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

  apiKey: "AIzaSyArdwTI-xT0aTSyVejFsHb0hnLn_lrF3s4",

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

  card.addEventListener("click", () => {

    typeCards.forEach(item => {

      item.classList.remove("active");

    });


    card.classList.add("active");


    const type =
      card.dataset.type;


    loadFields(type);

  });

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


  data.createdAt =
    serverTimestamp();


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


  if (password !== confirmPassword) {

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


  /*
    Personal account doesn't
    have a phone field.
  */

  if (!phone) {
    return true;
  }


  const number =
    phone.value.replace(/\D/g, "");


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
   SAVE USER TO FIRESTORE
========================================================= */

async function saveUserProfile(
  user,
  data
) {

  const uid =
    user.uid;


  /*
    Remove password from data
    before Firestore.
  */

  delete data.password;

  delete data.confirmPassword;


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
        ? "active"
        : "pending_email_verification",

    createdAt:
      serverTimestamp()

  };


  /*
    Copy all other form fields.
  */

  Object.keys(data).forEach(key => {

    if (
      key !== "password" &&
      key !== "confirmPassword" &&
      key !== "createdAt" &&
      key !== "terms"
    ) {

      userProfile[key] =
        data[key];

    }

  });


  /*
    MAIN USER PROFILE
  */

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
    BUSINESS PARTNER DATA
  */

  if (
    data.accountType === "retail" ||
    data.accountType === "distribution"
  ) {

    const partnerData = {

      uid: uid,

      accountType:
        data.accountType,

      email:
        user.email || data.email,

      status:
        user.emailVerified
          ? "active"
          : "pending_email_verification",

      createdAt:
        serverTimestamp()

    };


    Object.keys(data).forEach(key => {

      if (
        key !== "password" &&
        key !== "confirmPassword" &&
        key !== "createdAt" &&
        key !== "terms"
      ) {

        partnerData[key] =
          data[key];

      }

    });


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
   EMAIL + PASSWORD SIGNUP
========================================================= */

async function emailPasswordSignup() {

  const email =
    getValue("email");

  const password =
    getValue("password");


  try {

    /*
      Create Firebase user
    */

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user =
      credential.user;


    /*
      Update display name
    */

    const firstName =
      getValue("firstName");

    const secondName =
      getValue("secondName");


    const fullName =
      `${firstName} ${secondName}`
        .trim();


    if (fullName) {

      await updateProfile(
        user,
        {
          displayName: fullName
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
      user
    );


    /*
      Save Firestore profile
    */

    await saveUserProfile(
      user,
      data
    );


    /*
      Do not automatically
      enter dashboard until
      email is verified.
    */

    alert(
      "Account created successfully!\n\n" +
      "A verification link has been sent to " +
      email +
      ".\n\n" +
      "Please verify your email before signing in."
    );


    /*
      Sign out until verification
    */

    await auth.signOut();


    /*
      Go to login
    */

    window.location.href =
      "/b2b/login/";


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
   GOOGLE SIGNUP
========================================================= */

async function googleSignup() {

  try {

    /*
      Google login
    */

    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );


    const user =
      result.user;


    /*
      Google accounts are
      already verified.
    */

    const accountType =
      accountTypeInput.value;


    const data =
      collectSignupData();


    /*
      Google email should be
      the authenticated email.
    */

    data.email =
      user.email;


    /*
      Save profile
    */

    await saveUserProfile(
      user,
      data
    );


    /*
      Dashboard redirect
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


  if (accountType === "personal") {

    window.location.href =
      "/account/dashboard/";

    return;

  }


  if (
    accountType === "retail" ||
    accountType === "distribution"
  ) {

    window.location.href =
      "/b2b/dashboard/";

    return;

  }


  /*
    Safety fallback
  */

  window.location.href =
    "/account/dashboard/";

}


/* =========================================================
   FIREBASE ERROR HANDLER
========================================================= */

function handleFirebaseError(error) {

  let message =
    "Something went wrong. Please try again.";


  switch (error.code) {

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

  }


  alert(message);

}


/* =========================================================
   FORM SUBMIT
========================================================= */

signupForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    /*
      Browser validation
    */

    if (!signupForm.checkValidity()) {

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
      document.getElementById("terms");


    if (!terms.checked) {

      alert(
        "Please accept the Terms and Privacy Policy."
      );

      terms.focus();

      return;

    }


    /*
      Start signup
    */

    const button =
      signupForm.querySelector(
        ".submit-btn"
      );


    if (button) {

      button.disabled = true;

      button.innerHTML = `
        <span>Creating account...</span>
        <i class="fa-solid fa-spinner fa-spin"></i>
      `;

    }


    try {

      await emailPasswordSignup();

    }

    finally {

      if (button) {

        button.disabled = false;

        button.innerHTML = `
          <span>Create Account</span>
          <i class="fa-solid fa-arrow-right"></i>
        `;

      }

    }

  }
);


/* =========================================================
   OPTIONAL GOOGLE BUTTON SUPPORT
========================================================= */

/*
  If you add this button to HTML:

  <button id="googleSignupBtn">
    Continue with Google
  </button>

  this JS will automatically connect it.
*/

const googleSignupBtn =
  document.getElementById(
    "googleSignupBtn"
  );


if (googleSignupBtn) {

  googleSignupBtn.addEventListener(
    "click",
    async () => {

      googleSignupBtn.disabled = true;


      try {

        await googleSignup();

      }

      finally {

        googleSignupBtn.disabled = false;

      }

    }
  );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadFields("personal");


console.log(
  "Canonical Ocean Firebase Signup initialized."
);
