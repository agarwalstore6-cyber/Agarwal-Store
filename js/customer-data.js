/* =========================================================
   AGARWAL STORE
   CODE 19 — CUSTOMER DATA FOUNDATION
   ========================================================= */

const AgarwalCustomerData = {


  /* -------------------------------------------------------
     CREATE CUSTOMER
     ------------------------------------------------------- */

  create(data = {}) {

    return {

      uid:
        data.uid ||
        "",

      name:
        data.name ||
        "",

      phone:
        data.phone ||
        "",

      phoneVerified:
        data.phoneVerified === true,

      address: {

        house:
          data.address?.house ||
          "",

        area:
          data.address?.area ||
          "",

        landmark:
          data.address?.landmark ||
          "",

        city:
          data.address?.city ||
          "Darbhanga",

        pincode:
          data.address?.pincode ||
          "846003"

      },

      location: {

        lat:
          this.number(
            data.location?.lat
          ),

        lng:
          this.number(
            data.location?.lng
          )

      },

      status:
        data.status ||
        "active",

      blocked:
        data.blocked === true,

      createdAt:
        data.createdAt ||
        null,

      updatedAt:
        data.updatedAt ||
        null

    };

  },


  /* -------------------------------------------------------
     NUMBER CONVERSION
     ------------------------------------------------------- */

  number(value) {

    const number =
      Number(value);


    if (
      !Number.isFinite(number)
    ) {

      return 0;

    }


    return number;

  },


  /* -------------------------------------------------------
     VALIDATE CUSTOMER
     ------------------------------------------------------- */

  validate(customer) {

    const errors = [];


    if (
      !customer?.uid
    ) {

      errors.push(
        "Customer ID is required."
      );

    }


    if (
      !customer?.name ||
      !customer.name.trim()
    ) {

      errors.push(
        "Customer name is required."
      );

    }


    if (
      !customer?.phone ||
      !customer.phone.trim()
    ) {

      errors.push(
        "Customer phone number is required."
      );

    }


    if (
      customer?.phoneVerified !== true
    ) {

      errors.push(
        "Phone number must be verified."
      );

    }


    if (
      !customer?.address?.city
    ) {

      errors.push(
        "City is required."
      );

    }


    if (
      !customer?.address?.pincode
    ) {

      errors.push(
        "PIN code is required."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     BLOCK CUSTOMER
     ------------------------------------------------------- */

  block(customer) {

    return {

      ...customer,

      status:
        "blocked",

      blocked:
        true

    };

  },


  /* -------------------------------------------------------
     UNBLOCK CUSTOMER
     ------------------------------------------------------- */

  unblock(customer) {

    return {

      ...customer,

      status:
        "active",

      blocked:
        false

    };

  },


  /* -------------------------------------------------------
     CHECK CUSTOMER STATUS
     ------------------------------------------------------- */

  isBlocked(customer) {

    return (

      customer?.blocked === true ||

      customer?.status === "blocked"

    );

  },


  /* -------------------------------------------------------
     FORMAT ADDRESS
     ------------------------------------------------------- */

  formatAddress(customer) {

    const address =
      customer?.address || {};


    return [

      address.house,

      address.area,

      address.landmark,

      address.city,

      address.pincode

    ]

      .filter(
        value =>
          value &&
          String(value).trim()
      )

      .join(", ");

  },


  /* -------------------------------------------------------
     CLONE CUSTOMER
     ------------------------------------------------------- */

  clone(customer) {

    return {

      ...customer,

      address: {

        ...(customer?.address || {})

      },

      location: {

        ...(customer?.location || {})

      }

    };

  }

};


/* =========================================================
   PUBLIC CUSTOMER API
   ========================================================= */

window.AgarwalCustomerData =
  AgarwalCustomerData;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:customer-data-ready"
  )

);
