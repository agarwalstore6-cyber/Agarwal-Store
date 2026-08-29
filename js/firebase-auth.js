/* =========================================================
   AGARWAL STORE
   CODE 42 — FIREBASE AUTHENTICATION / OTP
   ========================================================= */


const AgarwalAuth = {


  confirmationResult:
    null,

  recaptchaVerifier:
    null,

  initialized:
    false,


  /* -------------------------------------------------------
     INITIALIZE AUTH
     ------------------------------------------------------- */

  init() {

    if (
      this.initialized
    ) {

      return;

    }


    if (
      typeof firebase ===
      "undefined"
    ) {

      throw new Error(
        "Firebase SDK is not loaded."
      );

    }


    if (
      !firebase.auth
    ) {

      throw new Error(
        "Firebase Authentication SDK is not loaded."
      );

    }


    this.initialized =
      true;

  },


  /* -------------------------------------------------------
     GET AUTH
     ------------------------------------------------------- */

  getAuth() {

    this.init();


    return firebase.auth();

  },


  /* -------------------------------------------------------
     CREATE RECAPTCHA
     ------------------------------------------------------- */

  createRecaptcha(
    elementId
  ) {

    this.init();


    if (
      this.recaptchaVerifier
    ) {

      return this.recaptchaVerifier;

    }


    const element =
      document.getElementById(
        elementId
      );


    if (!element) {

      throw new Error(
        "reCAPTCHA container was not found."
      );

    }


    this.recaptchaVerifier =

      new firebase.auth
        .RecaptchaVerifier(

          elementId,

          {

            size:
              "invisible",

            callback:
              () => {

                window.dispatchEvent(

                  new CustomEvent(
                    "agarwal:recaptcha-verified"
                  )

                );

              },

            "expired-callback":
              () => {

                this.recaptchaVerifier =
                  null;


                window.dispatchEvent(

                  new CustomEvent(
                    "agarwal:recaptcha-expired"
                  )

                );

              }

          }

        );


    return this.recaptchaVerifier;

  },


  /* -------------------------------------------------------
     NORMALIZE PHONE
     ------------------------------------------------------- */

  normalizePhone(
    phone
  ) {

    const value =
      String(
        phone || ""
      )
      .trim()
      .replace(
        /[\s()-]/g,
        ""
      );


    if (
      value.startsWith("+91")
    ) {

      return value;

    }


    const digits =
      value.replace(
        /[^0-9]/g,
        ""
      );


    if (
      digits.length === 10
    ) {

      return (
        "+91" +
        digits
      );

    }


    if (
      digits.length === 12 &&
      digits.startsWith("91")
    ) {

      return (
        "+" +
        digits
      );

    }


    return "";

  },


  /* -------------------------------------------------------
     VALIDATE PHONE
     ------------------------------------------------------- */

  validatePhone(
    phone
  ) {

    const normalized =
      this.normalizePhone(
        phone
      );


    return {

      valid:
        Boolean(
          normalized
        ),

      phone:
        normalized

    };

  },


  /* -------------------------------------------------------
     SEND OTP
     ------------------------------------------------------- */

  async sendOTP(
    phone,
    recaptchaElementId =
      "recaptcha-container"
  ) {

    this.init();


    const validation =
      this.validatePhone(
        phone
      );


    if (
      !validation.valid
    ) {

      throw new Error(
        "Please enter a valid 10-digit mobile number."
      );

    }


    const auth =
      this.getAuth();


    const verifier =
      this.createRecaptcha(

        recaptchaElementId

      );


    try {

      this.confirmationResult =

        await auth.signInWithPhoneNumber(

          validation.phone,

          verifier

        );


      window.dispatchEvent(

        new CustomEvent(
          "agarwal:otp-sent",
          {
            detail: {

              phone:
                validation.phone

            }

          }
        )

      );


      return {

        success:
          true,

        phone:
          validation.phone

      };

    } catch (error) {

      console.error(
        "OTP send error:",
        error
      );


      this.resetRecaptcha();


      throw this.formatAuthError(
        error
      );

    }

  },


  /* -------------------------------------------------------
     VERIFY OTP
     ------------------------------------------------------- */

  async verifyOTP(
    otp
  ) {

    if (
      !this.confirmationResult
    ) {

      throw new Error(
        "Please request an OTP first."
      );

    }


    const code =
      String(
        otp || ""
      )
      .trim();


    if (
      !/^[0-9]{6}$/.test(
        code
      )
    ) {

      throw new Error(
        "Please enter the 6-digit OTP."
      );

    }


    try {

      const result =

        await this
          .confirmationResult
          .confirm(
            code
          );


      const user =
        result.user;


      this.confirmationResult =
        null;


      window.dispatchEvent(

        new CustomEvent(
          "agarwal:phone-verified",
          {
            detail: {

              user

            }

          }
        )

      );


      return user;

    } catch (error) {

      console.error(
        "OTP verification error:",
        error
      );


      throw this.formatAuthError(
        error
      );

    }

  },


  /* -------------------------------------------------------
     GET CURRENT USER
     ------------------------------------------------------- */

  getCurrentUser() {

    this.init();


    return this
      .getAuth()
      .currentUser;

  },


  /* -------------------------------------------------------
     WATCH AUTH STATE
     ------------------------------------------------------- */

  watchAuthState(
    callback
  ) {

    this.init();


    if (
      typeof callback !==
      "function"
    ) {

      return null;

    }


    return this
      .getAuth()
      .onAuthStateChanged(
        callback
      );

  },


  /* -------------------------------------------------------
     LOGOUT
     ------------------------------------------------------- */

  async logout() {

    this.init();


    await this
      .getAuth()
      .signOut();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:logout"
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     RESET RECAPTCHA
     ------------------------------------------------------- */

  resetRecaptcha() {

    try {

      if (
        this.recaptchaVerifier
      ) {

        this.recaptchaVerifier
          .clear();

      }

    } catch (error) {

      console.info(
        "reCAPTCHA reset skipped."
      );

    }


    this.recaptchaVerifier =
      null;

  },


  /* -------------------------------------------------------
     AUTH ERROR MESSAGE
     ------------------------------------------------------- */

  formatAuthError(
    error
  ) {

    const code =
      error?.code ||
      "";


    const messages = {

      "auth/invalid-phone-number":
        "Invalid mobile number.",

      "auth/too-many-requests":
        "Too many attempts. Please try again later.",

      "auth/invalid-verification-code":
        "Incorrect OTP. Please check the OTP.",

      "auth/code-expired":
        "OTP has expired. Please request a new OTP.",

      "auth/quota-exceeded":
        "OTP service limit has been reached. Please try again later.",

      "auth/billing-not-enabled":
        "Firebase phone authentication requires the required billing setup.",

      "auth/operation-not-allowed":
        "Phone authentication is not enabled in Firebase.",

      "auth/network-request-failed":
        "Network error. Please check your internet connection."

    };


    return new Error(

      messages[code] ||

      error?.message ||

      "Authentication failed. Please try again."

    );

  }

};


/* =========================================================
   PUBLIC AUTH API
   ========================================================= */

window.AgarwalAuth =
  AgarwalAuth;


/* =========================================================
   INITIALIZE
   ========================================================= */

try {

  AgarwalAuth.init();

} catch (error) {

  console.info(
    "Authentication initialization will wait for Firebase."
  );

}


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:firebase-auth-ready"
  )

);
