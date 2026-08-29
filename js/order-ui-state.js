/* =========================================================
   AGARWAL STORE
   CODE 54 — ORDER UI STATE MANAGER
   ========================================================= */


const AgarwalOrderUIState = {


  state:
    "idle",

  message:
    "",

  error:
    null,

  order:
    null,


  /* -------------------------------------------------------
     SET STATE
     ------------------------------------------------------- */

  setState(
    state,
    message = "",
    error = null
  ) {

    this.state =
      state;

    this.message =
      message;

    this.error =
      error;


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:order-ui-state-changed",
        {
          detail: {

            state:
              this.state,

            message:
              this.message,

            error:
              this.error,

            order:
              this.order

          }

        }
      )

    );


    return this.getState();

  },


  /* -------------------------------------------------------
     IDLE
     ------------------------------------------------------- */

  idle() {

    return this.setState(
      "idle",
      ""
    );

  },


  /* -------------------------------------------------------
     VALIDATING
     ------------------------------------------------------- */

  validating() {

    return this.setState(

      "validating",

      "Checking your order..."

    );

  },


  /* -------------------------------------------------------
     CREATING
     ------------------------------------------------------- */

  creating() {

    return this.setState(

      "creating",

      "Preparing your order..."

    );

  },


  /* -------------------------------------------------------
     SAVING
     ------------------------------------------------------- */

  saving() {

    return this.setState(

      "saving",

      "Saving your order..."

    );

  },


  /* -------------------------------------------------------
     OPENING WHATSAPP
     ------------------------------------------------------- */

  openingWhatsApp() {

    return this.setState(

      "opening-whatsapp",

      "Opening WhatsApp..."

    );

  },


  /* -------------------------------------------------------
     SUCCESS
     ------------------------------------------------------- */

  success(
    order
  ) {

    this.order =
      order ||
      null;


    return this.setState(

      "success",

      "Your order has been placed successfully."

    );

  },


  /* -------------------------------------------------------
     ERROR
     ------------------------------------------------------- */

  failure(
    error,
    message = ""
  ) {

    const finalMessage =

      message ||

      error?.message ||

      "Something went wrong. Please try again.";


    return this.setState(

      "error",

      finalMessage,

      error || null

    );

  },


  /* -------------------------------------------------------
     SET ORDER
     ------------------------------------------------------- */

  setOrder(
    order
  ) {

    this.order =
      order ||
      null;


    return this.getState();

  },


  /* -------------------------------------------------------
     GET STATE
     ------------------------------------------------------- */

  getState() {

    return {

      state:
        this.state,

      message:
        this.message,

      error:
        this.error,

      order:
        this.order

    };

  },


  /* -------------------------------------------------------
     IS BUSY
     ------------------------------------------------------- */

  isBusy() {

    return (

      this.state ===
        "validating" ||

      this.state ===
        "creating" ||

      this.state ===
        "saving" ||

      this.state ===
        "opening-whatsapp"

    );

  },


  /* -------------------------------------------------------
     IS SUCCESS
     ------------------------------------------------------- */

  isSuccess() {

    return (

      this.state ===
      "success"

    );

  },


  /* -------------------------------------------------------
     HAS ERROR
     ------------------------------------------------------- */

  hasError() {

    return (

      this.state ===
      "error"

    );

  },


  /* -------------------------------------------------------
     RESET
     ------------------------------------------------------- */

  reset() {

    this.order =
      null;


    return this.idle();

  }

};


/* =========================================================
   PUBLIC ORDER UI STATE API
   ========================================================= */

window.AgarwalOrderUIState =
  AgarwalOrderUIState;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-ui-state-ready"
  )

);
