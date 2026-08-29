/* =========================================================
   AGARWAL STORE
   CODE 8 — STORE CONFIGURATION
   ========================================================= */

const AGARWAL_CONFIG = {

  store: {

    name: "Agarwal Store",

    address: "Ayachi Nagar, Benta",

    city: "Darbhanga",

    pincode: "846003"

  },


  contact: {

    phone: "9229609882",

    whatsapp: "9229609882"

  },


  delivery: {

    minimumOrder: 99,

    deliveryCharge: 0,

    paymentMethod: "Cash on Delivery"

  },


  home: {

    bannerInterval: 4000

  },


  branding: {

    name: "AGARWAL STORE",

    footer:
      "Made by Magician Bhuvan Bhaskar 🪄"

  }

};


/* =========================================================
   GLOBAL CONFIGURATION
   ========================================================= */

window.AgarwalConfig =
  AGARWAL_CONFIG;


/* =========================================================
   CONFIG READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:config-ready"
  )

);
