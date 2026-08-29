/* =========================================================
   AGARWAL STORE
   CODE 59 — CUSTOMER ADDRESS MANAGER
   ========================================================= */


const AgarwalCustomerAddress = {


  currentAddress: null,


  /* -------------------------------------------------------
     CREATE ADDRESS
     ------------------------------------------------------- */

  create(data = {}) {

    const address = {

      fullAddress:
        String(
          data.fullAddress ||
          data.address ||
          ""
        ).trim(),

      house:
        String(
          data.house ||
          data.houseNumber ||
          ""
        ).trim(),

      area:
        String(
          data.area ||
          ""
        ).trim(),

      city:
        String(
          data.city ||
          "Darbhanga"
        ).trim(),

      pincode:
        String(
          data.pincode ||
          "846003"
        ).trim(),

      latitude:
        Number(
          data.latitude ??
          data.lat ??
          0
        ),

      longitude:
        Number(
          data.longitude ??
          data.lng ??
          0
        )

    };


    this.currentAddress =
      address;


    return address;

  },


  /* -------------------------------------------------------
     SET ADDRESS
     ------------------------------------------------------- */

  set(data = {}) {

    const address =
      this.create(
        data
      );


    window.AgarwalStore
      ?.state &&
      (
        window.AgarwalStore
          .state
          .deliveryLocation =
          address
      );


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:customer-address-updated",
        {
          detail: {

            address

          }

        }
      )

    );


    return address;

  },


  /* -------------------------------------------------------
     GET ADDRESS
     ------------------------------------------------------- */

  get() {

    return (

      this.currentAddress ||

      window.AgarwalStore
        ?.state
        ?.deliveryLocation ||

      null

    );

  },


  /* -------------------------------------------------------
     CHECK ADDRESS
     ------------------------------------------------------- */

  isComplete() {

    const address =
      this.get();


    if (!address) {

      return false;

    }


    return Boolean(

      address.fullAddress ||

      (
        address.area &&
        address.city &&
        address.pincode
      )

    );

  },


  /* -------------------------------------------------------
     UPDATE ADDRESS
     ------------------------------------------------------- */

  update(
    changes = {}
  ) {

    const current =
      this.get() ||
      {};


    return this.set({

      ...current,

      ...changes

    });

  },


  /* -------------------------------------------------------
     CLEAR ADDRESS
     ------------------------------------------------------- */

  clear() {

    this.currentAddress =
      null;


    if (
      window.AgarwalStore
        ?.state
    ) {

      window.AgarwalStore
        .state
        .deliveryLocation =
        null;

    }


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:customer-address-cleared"
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     GET MAP LOCATION
     ------------------------------------------------------- */

  getCoordinates() {

    const address =
      this.get();


    if (!address) {

      return null;

    }


    const latitude =
      Number(
        address.latitude
      );


    const longitude =
      Number(
        address.longitude
      );


    if (
      !Number.isFinite(
        latitude
      ) ||
      !Number.isFinite(
        longitude
      ) ||
      latitude === 0 ||
      longitude === 0
    ) {

      return null;

    }


    return {

      latitude,

      longitude

    };

  },


  /* -------------------------------------------------------
     CREATE MAP URL
     ------------------------------------------------------- */

  getMapURL() {

    const coordinates =
      this.getCoordinates();


    if (!coordinates) {

      return "";

    }


    return (

      "https://www.google.com/maps?q=" +

      encodeURIComponent(

        `${coordinates.latitude},${coordinates.longitude}`

      )

    );

  },


  /* -------------------------------------------------------
     FORMAT FOR ORDER
     ------------------------------------------------------- */

  toOrderAddress() {

    const address =
      this.get();


    if (!address) {

      return {

        fullAddress:
          "",

        area:
          "",

        city:
          "Darbhanga",

        pincode:
          "846003",

        latitude:
          0,

        longitude:
          0

      };

    }


    return {

      fullAddress:
        address.fullAddress ||
        "",

      house:
        address.house ||
        "",

      area:
        address.area ||
        "",

      city:
        address.city ||
        "Darbhanga",

      pincode:
        address.pincode ||
        "846003",

      latitude:
        Number(
          address.latitude ||
          0
        ),

      longitude:
        Number(
          address.longitude ||
          0
        )

    };

  }

};


/* =========================================================
   PUBLIC CUSTOMER ADDRESS API
   ========================================================= */

window.AgarwalCustomerAddress =
  AgarwalCustomerAddress;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:customer-address-ready"
  )

);
