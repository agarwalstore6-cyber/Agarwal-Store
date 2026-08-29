/* =========================================================
   AGARWAL STORE
   CODE 39 — DELIVERY CHECK UI FOUNDATION
   ========================================================= */


const AgarwalDeliveryCheck = {


  currentLocation: null,

  available: false,

  matchingArea: null,


  /* -------------------------------------------------------
     INITIALIZE
     ------------------------------------------------------- */

  init() {

    window.addEventListener(

      "agarwal:customer-location-selected",

      event => {

        const location =
          event.detail?.location;


        if (location) {

          this.check(
            location
          );

        }

      }

    );

  },


  /* -------------------------------------------------------
     CHECK LOCATION
     ------------------------------------------------------- */

  async check(
    location
  ) {

    this.currentLocation =
      location;


    try {

      const areas =
        await window.AgarwalDeliveryAreaStorage
          ?.getActive();


      if (
        !Array.isArray(areas)
      ) {

        this.available =
          false;

        this.matchingArea =
          null;


        this.emit();

        return {

          available:
            false,

          message:
            "Delivery area is not ready."

        };

      }


      this.available =
        window.AgarwalDeliveryArea
          .isDeliveryAvailable(

            location,

            areas

          );


      this.matchingArea =
        window.AgarwalDeliveryArea
          .getMatchingArea(

            location,

            areas

          );


      this.emit();


      return {

        available:
          this.available,

        area:
          this.matchingArea,

        message:

          this.available

            ? "Delivery is available."

            : "Sorry, we are not available here."

      };

    } catch (error) {

      console.error(
        "Delivery check error:",
        error
      );


      this.available =
        false;


      this.matchingArea =
        null;


      this.emit();


      return {

        available:
          false,

        area:
          null,

        message:
          "Unable to check delivery availability."

      };

    }

  },


  /* -------------------------------------------------------
     GET RESULT
     ------------------------------------------------------- */

  getResult() {

    return {

      available:
        this.available,

      location:
        this.currentLocation,

      area:
        this.matchingArea,

      message:

        this.available

          ? "Delivery is available."

          : "Sorry, we are not available here."

    };

  },


  /* -------------------------------------------------------
     CAN DELIVER
     ------------------------------------------------------- */

  canDeliver() {

    return (
      this.available === true
    );

  },


  /* -------------------------------------------------------
     GET MESSAGE
     ------------------------------------------------------- */

  getMessage() {

    if (
      this.available
    ) {

      return (
        "✅ Delivery is available at your location."
      );

    }


    return (
      "❌ Sorry, we are not available here."
    );

  },


  /* -------------------------------------------------------
     EMIT RESULT
     ------------------------------------------------------- */

  emit() {

    window.dispatchEvent(

      new CustomEvent(
        "agarwal:delivery-check-complete",
        {
          detail: {

            available:
              this.available,

            location:
              this.currentLocation,

            area:
              this.matchingArea,

            message:
              this.getMessage()

          }

        }
      )

    );

  },


  /* -------------------------------------------------------
     RESET
     ------------------------------------------------------- */

  reset() {

    this.currentLocation =
      null;

    this.available =
      false;

    this.matchingArea =
      null;


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:delivery-check-reset"
      )

    );

  }

};


/* =========================================================
   PUBLIC DELIVERY CHECK API
   ========================================================= */

window.AgarwalDeliveryCheck =
  AgarwalDeliveryCheck;


/* =========================================================
   INITIALIZE
   ========================================================= */

AgarwalDeliveryCheck.init();


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:delivery-check-ready"
  )

);
