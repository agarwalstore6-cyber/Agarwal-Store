/* =========================================================
   AGARWAL STORE
   CODE 37 — CUSTOMER SESSION MANAGER
   ========================================================= */


const AgarwalCustomerSession = {


  currentUser: null,

  customer: null,

  initialized: false,


  /* -------------------------------------------------------
     INITIALIZE SESSION
     ------------------------------------------------------- */

  init() {

    if (this.initialized) {

      return;

    }


    this.initialized = true;


    if (
      !window.AgarwalAuth
    ) {

      return;

    }


    window.AgarwalAuth
      .watchAuthState(

        async user => {

          await this.handleAuthState(
            user
          );

        }

      );

  },


  /* -------------------------------------------------------
     HANDLE AUTH STATE
     ------------------------------------------------------- */

  async handleAuthState(
    user
  ) {

    this.currentUser =
      user || null;


    if (!user) {

      this.customer =
        null;


      this.updateStoreState();


      window.dispatchEvent(

        new CustomEvent(
          "agarwal:customer-logged-out"
        )

      );


      return;

    }


    try {

      const customer =
        await window.AgarwalCustomerStorage
          ?.get(
            user.uid
          );


      if (customer) {

        this.customer =
          customer;

      } else {

        this.customer = {

          uid:
            user.uid,

          phone:
            user.phoneNumber ||
            "",

          phoneVerified:
            true,

          status:
            "active",

          blocked:
            false

        };

      }


      this.updateStoreState();


      window.dispatchEvent(

        new CustomEvent(
          "agarwal:customer-session-ready",
          {
            detail: {

              user,

              customer:
                this.customer

            }

          }
        )

      );

    } catch (error) {

      console.error(
        "Customer session error:",
        error
      );

    }

  },


  /* -------------------------------------------------------
     UPDATE GLOBAL STATE
     ------------------------------------------------------- */

  updateStoreState() {

    if (
      !window.AgarwalStore?.state
    ) {

      return;

    }


    window.AgarwalStore
      .state
      .currentUser =
      this.customer;

  },


  /* -------------------------------------------------------
     GET CURRENT CUSTOMER
     ------------------------------------------------------- */

  getCustomer() {

    return this.customer;

  },


  /* -------------------------------------------------------
     GET FIREBASE USER
     ------------------------------------------------------- */

  getFirebaseUser() {

    return this.currentUser;

  },


  /* -------------------------------------------------------
     CHECK LOGIN
     ------------------------------------------------------- */

  isLoggedIn() {

    return Boolean(
      this.currentUser
    );

  },


  /* -------------------------------------------------------
     CHECK PROFILE
     ------------------------------------------------------- */

  hasProfile() {

    return Boolean(

      this.customer &&

      this.customer.name &&

      this.customer.phone

    );

  },


  /* -------------------------------------------------------
     CHECK BLOCKED
     ------------------------------------------------------- */

  isBlocked() {

    return (

      this.customer?.blocked === true ||

      this.customer?.status ===
        "blocked"

    );

  },


  /* -------------------------------------------------------
     CAN ORDER
     ------------------------------------------------------- */

  canPlaceOrder() {

    if (
      !this.isLoggedIn()
    ) {

      return {

        allowed:
          false,

        message:
          "Please login first."

      };

    }


    if (
      !this.hasProfile()
    ) {

      return {

        allowed:
          false,

        message:
          "Please complete your profile first."

      };

    }


    if (
      this.isBlocked()
    ) {

      return {

        allowed:
          false,

        message:
          "Your account is currently unavailable for placing orders."

      };

    }


    return {

      allowed:
        true,

      message:
        ""

    };

  },


  /* -------------------------------------------------------
     LOGOUT
     ------------------------------------------------------- */

  async logout() {

    if (
      !window.AgarwalAuth
    ) {

      throw new Error(
        "Authentication is not ready."
      );

    }


    await window.AgarwalAuth
      .logout();


    this.currentUser =
      null;

    this.customer =
      null;


    this.updateStoreState();


    return true;

  }

};


/* =========================================================
   PUBLIC CUSTOMER SESSION API
   ========================================================= */

window.AgarwalCustomerSession =
  AgarwalCustomerSession;


/* =========================================================
   INITIALIZE
   ========================================================= */

AgarwalCustomerSession.init();


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:customer-session-ready"
  )

);
