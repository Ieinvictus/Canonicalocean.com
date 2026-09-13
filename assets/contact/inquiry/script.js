/* =========================================
   CANONICAL OCEAN
   CONTACT / BUSINESS INQUIRY FORM
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const contactForm =
    document.getElementById("contactForm");

  const formMessage =
    document.getElementById("formMessage");

  if (!contactForm || !formMessage) return;


  /* =========================================
     CLOUDFLARE WORKER API
  ========================================= */

  const API_URL =
    "https://canonical-ocean-zoho-api.rahulbpadaliya.workers.dev/";


  /* =========================================
     FORM SUBMIT
  ========================================= */

  contactForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      /* =======================================
         INPUT ELEMENTS
      ======================================= */

      const nameInput =
        document.getElementById("name");

      const companyInput =
        document.getElementById("company");

      const phoneInput =
        document.getElementById("phone");

      const emailInput =
        document.getElementById("email");

      const enquiryInput =
        document.getElementById("enquiry");

      const messageInput =
        document.getElementById("message");

      const submitBtn =
        contactForm.querySelector(
          ".co-contact-submit"
        );


      if (!submitBtn) return;


      /* =======================================
         GET VALUES
      ======================================= */

      const name =
        nameInput
          ? nameInput.value.trim()
          : "";

      const company =
        companyInput
          ? companyInput.value.trim()
          : "";

      const phone =
        phoneInput
          ? phoneInput.value.trim()
          : "";

      const email =
        emailInput
          ? emailInput.value.trim().toLowerCase()
          : "";

      const enquiry =
        enquiryInput
          ? enquiryInput.value.trim()
          : "";

      const message =
        messageInput
          ? messageInput.value.trim()
          : "";


      /* =======================================
         CLEAR OLD MESSAGE
      ======================================= */

      formMessage.textContent = "";
      formMessage.style.color = "";


      /* =======================================
         NAME VALIDATION
      ======================================= */

      if (!name) {

        formMessage.textContent =
          "Please enter your name.";

        formMessage.style.color =
          "#c0392b";

        nameInput?.focus();

        return;
      }


      /* =======================================
         EMAIL VALIDATION
      ======================================= */

      if (!email) {

        formMessage.textContent =
          "Please enter your email address.";

        formMessage.style.color =
          "#c0392b";

        emailInput?.focus();

        return;
      }


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {

        formMessage.textContent =
          "Please enter a valid email address.";

        formMessage.style.color =
          "#c0392b";

        emailInput?.focus();

        return;
      }


      /* =======================================
         PHONE VALIDATION
         Only when entered
      ======================================= */

      if (phone) {

        const phonePattern =
          /^[0-9+\-\s()]{7,20}$/;

        if (!phonePattern.test(phone)) {

          formMessage.textContent =
            "Please enter a valid phone number.";

          formMessage.style.color =
            "#c0392b";

          phoneInput?.focus();

          return;
        }
      }


      /* =======================================
         ENQUIRY VALIDATION
      ======================================= */

      if (!enquiry) {

        formMessage.textContent =
          "Please select an enquiry type.";

        formMessage.style.color =
          "#c0392b";

        enquiryInput?.focus();

        return;
      }


      /* =======================================
         MESSAGE VALIDATION
      ======================================= */

      if (!message) {

        formMessage.textContent =
          "Please enter your message.";

        formMessage.style.color =
          "#c0392b";

        messageInput?.focus();

        return;
      }


      /* =======================================
         DATA FOR CLOUDFLARE WORKER
      ======================================= */

      const data = {

        type: "contact",

        name: name,

        company: company,

        phone: phone,

        email: email,

        enquiry: enquiry,

        message: message

      };


      /* =======================================
         BUTTON LOADING
      ======================================= */

      submitBtn.disabled = true;

      submitBtn.setAttribute(
        "aria-busy",
        "true"
      );

      submitBtn.innerHTML =
        'Sending Enquiry <i class="fa-solid fa-spinner fa-spin"></i>';


      try {


        /* =====================================
           SEND REQUEST
        ===================================== */

        const response =
          await fetch(
            API_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(data)
            }
          );


        /* =====================================
           SERVER RESPONSE
        ===================================== */

        let result = {};

        try {

          result =
            await response.json();

        } catch (error) {

          throw new Error(
            "Invalid server response."
          );
        }


        /* =====================================
           API ERROR
        ===================================== */

        if (
          !response.ok ||
          result.success !== true
        ) {

          console.error(
            "Zoho CRM API Error:",
            result
          );

          throw new Error(
            result?.error?.message ||
            result?.message ||
            "Unable to send enquiry."
          );
        }


        /* =====================================
           SUCCESS
        ===================================== */

        formMessage.textContent =
          "Thank you. Your enquiry has been sent successfully.";

        formMessage.style.color =
          "#006d77";


        /* =====================================
           RESET FORM
        ===================================== */

        contactForm.reset();


        /* =====================================
           RESTORE BUTTON
        ===================================== */

        submitBtn.disabled = false;

        submitBtn.removeAttribute(
          "aria-busy"
        );

        submitBtn.innerHTML =
          'Send Enquiry <i class="fa-solid fa-arrow-right"></i>';


      } catch (error) {


        /* =====================================
           ERROR
        ===================================== */

        console.error(
          "Contact Form Error:",
          error
        );

        formMessage.textContent =
          "Something went wrong. Please try again or contact us directly.";

        formMessage.style.color =
          "#c0392b";


        /* =====================================
           RESTORE BUTTON
        ===================================== */

        submitBtn.disabled = false;

        submitBtn.removeAttribute(
          "aria-busy"
        );

        submitBtn.innerHTML =
          'Send Enquiry <i class="fa-solid fa-arrow-right"></i>';

      }

    });

});
