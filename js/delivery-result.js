/* =========================================================
   AGARWAL STORE
   CODE 61 — DELIVERY RESULT MANAGER
   ========================================================= */


const AgarwalDeliveryResult = {


  currentResult: null,


  /* -------------------------------------------------------
     CHECK ADDRESS
     ------------------------------------------------------- */

  check(
    address = {}
  ) {

    const config =
      window.AgarwalDeliveryAreaConfig;


    if (!config) {

      this.currentResult = {

        available:
          false,

        message:
          "Delivery configuration is not ready."

      };


      return this.currentResult;

    }


    const result =
      config.check(
        address
      );


    this.currentResult =
      result;


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:delivery-result",
        {
          detail:
            result
        }
      )

    );


    return result;

  },


  /* -------------------------------------------------------
     CHECK CURRENT ADDRESS
     ------------------------------------------------------- */

  checkCurrentAddress() {

    const address =
      window.AgarwalCustomerAddress
        ?.get?.();


    if (!address) {

      return this.check(
        {}
      );

    }


    return this.check(
      address
    );

  },


  /* -------------------------------------------------------
     IS AVAILABLE
     ------------------------------------------------------- */

  isAvailable() {

    return (

      this.currentResult
        ?.available === true

    );

  },


  /* -------------------------------------------------------
     GET RESULT
     ------------------------------------------------------- */

  getResult() {

    return (

      this.currentResult ||

      {

        available:
          false,

        message:
          "Delivery has not been checked yet."

      }

    );

  },


  /* -------------------------------------------------------
     GET MESSAGE
     ------------------------------------------------------- */

  getMessage() {

    return (

      this.currentResult
        ?.message ||

      "Delivery has not been checked yet."

    );

  },


  /* -------------------------------------------------------
     GET DELIVERY CHARGE
     ------------------------------------------------------- */

  getDeliveryCharge() {

    return Number(

      this.currentResult
        ?.deliveryCharge ??

      0

    );

  },


  /* -------------------------------------------------------
     GET MINIMUM ORDER
     ------------------------------------------------------- */

  getMinimumOrder() {

    return Number(

      this.currentResult
        ?.minimumOrder ??

      99

    );

  },


  /* -------------------------------------------------------
     GET AREA
     ------------------------------------------------------- */

  getArea() {

    return (

      this.currentResult
        ?.area ||

      null

    );

  },


  /* -------------------------------------------------------
     RESET
     ------------------------------------------------------- */

  reset() {

    this.currentResult =
      null;


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:delivery-result-reset"
      )

    );


    return true;

  }

};


/* =========================================================
   PUBLIC DELIVERY RESULT API
   ========================================================= */

window.AgarwalDeliveryResult =
  AgarwalDeliveryResult;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:delivery-result-ready"
  )

);
