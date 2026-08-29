/* =========================================================
   AGARWAL STORE
   CODE 12 — CUSTOMER PROFILE FOUNDATION
   ========================================================= */

const profileModule = {

  initialized: false,

  otpSent: false,

  verifiedUser: null,

  init() {

    if (this.initialized) {
      return;
    }

    this.initialized = true;

    window.AgarwalEvents?.on(
      "agarwal:open-profile",
      () => {

        this.openProfile();

      }
    );

  },


  openProfile() {

    if (
      document.getElementById(
        "agarwalProfilePage"
      )
    ) {

      return;

    }


    const page =
      document.createElement("div");

    page.id =
      "agarwalProfilePage";

    page.className =
      "agarwal-profile-page";


    page.innerHTML = `

      <div class="profile-page-inner">

        <button
          type="button"
          class="profile-back"
          id="profileBackButton"
        >
          ← Back
        </button>

        <div class="profile-heading">

          <span>YOUR ACCOUNT</span>

          <h1>
            Create your profile
          </h1>

          <p>
            Your details help us deliver
            your groceries correctly.
          </p>

        </div>


        <form
          id="agarwalProfileForm"
          autocomplete="on"
        >

          <label>
            Name

            <input
              id="customerName"
              name="name"
              type="text"
              placeholder="Enter your name"
              autocomplete="name"
              required
            >

          </label>


          <label>
            Mobile number

            <input
              id="customerPhone"
              name="phone"
              type="tel"
              placeholder="+91XXXXXXXXXX"
              autocomplete="tel"
              inputmode="tel"
              required
            >

          </label>


          <button
            type="button"
            id="sendCustomerOTP"
            class="profile-primary-button"
          >
            Send OTP
          </button>


          <div
            id="customerOtpSection"
            class="otp-section"
            hidden
          >

            <label>
              Enter OTP

              <input
                id="customerOTP"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                placeholder="6 digit OTP"
              >

            </label>


            <button
              type="button"
              id="verifyCustomerOTP"
              class="profile-primary-button"
            >
              Verify OTP
            </button>

          </div>


          <div
            id="profileVerifiedMessage"
            class="profile-message"
            hidden
          >
            ✓ Mobile number verified
          </div>


          <div
            id="profileAddressSection"
            hidden
          >

            <div class="profile-section-title">
              Delivery address
            </div>


            <div
              id="customerMapPlaceholder"
              class="customer-map-placeholder"
            >

              <strong>
                Location selection
              </strong>

              <span>
                Map will open here.
              </span>

            </div>


            <label>
              House / Flat

              <input
                id="customerHouse"
                type="text"
                placeholder="House / Flat number"
                autocomplete="street-address"
              >

            </label>


            <label>
              Area / Street

              <input
                id="customerArea"
                type="text"
                placeholder="Area / Street"
              >

            </label>


            <label>
              Landmark

              <input
                id="customerLandmark"
                type="text"
                placeholder="Nearby landmark"
              >

            </label>


            <label>
              City

              <input
                id="customerCity"
                type="text"
                value="Darbhanga"
              >

            </label>


            <label>
              PIN code

              <input
                id="customerPincode"
                type="text"
                inputmode="numeric"
                maxlength="6"
                value="846003"
              >

            </label>


            <button
              type="button"
              id="saveCustomerProfile"
              class="profile-primary-button"
            >
              Continue
            </button>

          </div>


          <div
            id="profileStatus"
            class="profile-status"
            role="status"
          ></div>


          <div
            id="recaptcha-container"
          ></div>

        </form>

      </div>

    `;


    document.body.appendChild(page);


    this.addStyles();

    this.attachEvents();

  },


  closeProfile() {

    const page =
      document.getElementById(
        "agarwalProfilePage"
      );


    if (page) {

      page.remove();

    }

  },


  attachEvents() {

    document
      .getElementById(
        "profileBackButton"
      )
      ?.addEventListener(
        "click",
        () => {

          this.closeProfile();

        }
      );


    document
      .getElementById(
        "sendCustomerOTP"
      )
      ?.addEventListener(
        "click",
        () => {

          this.sendOTP();

        }
      );


    document
      .getElementById(
        "verifyCustomerOTP"
      )
      ?.addEventListener(
        "click",
        () => {

          this.verifyOTP();

        }
      );


    document
      .getElementById(
        "saveCustomerProfile"
      )
      ?.addEventListener(
        "click",
        () => {

          this.saveProfile();

        }
      );

  },


  async sendOTP() {

    const phoneInput =
      document.getElementById(
        "customerPhone"
      );

    const status =
      document.getElementById(
        "profileStatus"
      );

    const otpSection =
      document.getElementById(
        "customerOtpSection"
      );


    const phone =
      phoneInput?.value.trim();


    if (!phone) {

      this.setStatus(
        "Please enter your mobile number."
      );

      return;

    }


    if (
      !window.AgarwalAuth
    ) {

      this.setStatus(
        "Authentication is still loading. Please try again."
      );

      return;

    }


    try {

      this.setStatus(
        "Sending OTP..."
      );


      await window.AgarwalAuth
        .sendPhoneOTP(
          phone,
          "recaptcha-container"
        );


      this.otpSent = true;

      if (otpSection) {

        otpSection.hidden = false;

      }


      this.setStatus(
        "OTP sent. Enter the OTP to continue."
      );


    } catch (error) {

      console.error(
        "Agarwal Store OTP error:",
        error
      );


      this.setStatus(
        error?.message ||
        "Unable to send OTP."
      );

    }

  },


  async verifyOTP() {

    const otpInput =
      document.getElementById(
        "customerOTP"
      );

    const otp =
      otpInput?.value.trim();


    if (!otp) {

      this.setStatus(
        "Please enter the OTP."
      );

      return;

    }


    try {

      this.setStatus(
        "Verifying OTP..."
      );


      const user =
        await window.AgarwalAuth
          .verifyPhoneOTP(
            otp
          );


      this.verifiedUser =
        user;


      const addressSection =
        document.getElementById(
          "profileAddressSection"
        );


      const verifiedMessage =
        document.getElementById(
          "profileVerifiedMessage"
        );


      if (addressSection) {

        addressSection.hidden =
          false;

      }


      if (verifiedMessage) {

        verifiedMessage.hidden =
          false;

      }


      this.setStatus(
        "Mobile number verified successfully."
      );


      window.dispatchEvent(

        new CustomEvent(
          "agarwal:customer-phone-verified",
          {
            detail: {
              user: user
            }
          }
        )

      );


    } catch (error) {

      console.error(
        "Agarwal Store OTP verification error:",
        error
      );


      this.setStatus(
        error?.message ||
        "Invalid OTP."
      );

    }

  },


  saveProfile() {

    if (!this.verifiedUser) {

      this.setStatus(
        "Please verify your mobile number first."
      );

      return;

    }


    const profile = {

      uid:
        this.verifiedUser.uid,

      name:
        document
          .getElementById(
            "customerName"
          )
          ?.value.trim() || "",

      phone:
        document
          .getElementById(
            "customerPhone"
          )
          ?.value.trim() || "",

      address: {

        house:
          document
            .getElementById(
              "customerHouse"
            )
            ?.value.trim() || "",

        area:
          document
            .getElementById(
              "customerArea"
            )
            ?.value.trim() || "",

        landmark:
          document
            .getElementById(
              "customerLandmark"
            )
            ?.value.trim() || "",

        city:
          document
            .getElementById(
              "customerCity"
            )
            ?.value.trim() || "Darbhanga",

        pincode:
          document
            .getElementById(
              "customerPincode"
            )
            ?.value.trim() || "846003"

      }

    };


    window.AgarwalStore.state.currentUser =
      profile;


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:customer-profile-ready",
        {
          detail: {
            profile: profile
          }
        }
      )

    );


    this.setStatus(
      "Profile details saved. Location will be completed with the map module."
    );

  },


  setStatus(message) {

    const status =
      document.getElementById(
        "profileStatus"
      );


    if (status) {

      status.textContent =
        message;

    }

  },


  addStyles() {

    if (
      document.getElementById(
        "agarwalProfileStyles"
      )
    ) {

      return;

    }


    const style =
      document.createElement("style");

    style.id =
      "agarwalProfileStyles";


    style.textContent = `

      .agarwal-profile-page {

        position: fixed;

        inset: 0;

        z-index: 10000;

        overflow-y: auto;

        background: #F7F8F5;

        color: #17211C;

      }


      .profile-page-inner {

        width: min(
          600px,
          100%
        );

        margin: auto;

        padding:
          20px 18px 40px;

      }


      .profile-back {

        padding:
          10px 0;

        background:
          transparent;

        color:
          #123D2B;

        font-weight:
          800;

      }


      .profile-heading {

        padding:
          22px 0;

      }


      .profile-heading span {

        color:
          #1E5A40;

        font-size:
          11px;

        font-weight:
          900;

        letter-spacing:
          .12em;

      }


      .profile-heading h1 {

        margin:
          7px 0;

        font-size:
          30px;

        line-height:
          1.08;

      }


      .profile-heading p {

        color:
          #6C766F;

        font-size:
          14px;

        line-height:
          1.5;

      }


      #agarwalProfileForm label {

        display:
          block;

        margin:
          15px 0;

        color:
          #354039;

        font-size:
          13px;

        font-weight:
          750;

      }


      #agarwalProfileForm input {

        width:
          100%;

        min-height:
          52px;

        margin-top:
          7px;

        padding:
          0 14px;

        border:
          1px solid #DDE4DE;

        border-radius:
          14px;

        outline:
          none;

        background:
          #FFFFFF;

        color:
          #17211C;

      }


      #agarwalProfileForm input:focus {

        border-color:
          #1E5A40;

        box-shadow:
          0 0 0 3px
          rgba(30,90,64,.10);

      }


      .profile-primary-button {

        width:
          100%;

        min-height:
          52px;

        margin-top:
          8px;

        border-radius:
          14px;

        background:
          #123D2B;

        color:
          #FFFFFF;

        font-weight:
          850;

      }


      .profile-message {

        margin-top:
          14px;

        padding:
          13px;

        border-radius:
          12px;

        background:
          #E7F3EA;

        color:
          #155A34;

        font-size:
          13px;

        font-weight:
          750;

      }


      .profile-section-title {

        margin-top:
          28px;

        margin-bottom:
          12px;

        font-size:
          18px;

        font-weight:
          900;

      }


      .customer-map-placeholder {

        min-height:
          180px;

        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        gap:
          6px;

        margin-bottom:
          12px;

        padding:
          20px;

        border:
          1px dashed #BFCAC1;

        border-radius:
          18px;

        background:
          #FFFFFF;

        text-align:
          center;

      }


      .customer-map-placeholder span {

        color:
          #6C766F;

        font-size:
          12px;

      }


      .profile-status {

        min-height:
          22px;

        margin-top:
          14px;

        color:
          #6C766F;

        font-size:
          13px;

        line-height:
          1.4;

      }

    `;


    document.head.appendChild(
      style
    );

  }

};


/* =========================================================
   REGISTER MODULE
   ========================================================= */

window.registerAgarwalModule?.(
  "customer-profile",
  profileModule
);


/* =========================================================
   INITIALIZE
   ========================================================= */

profileModule.init();
