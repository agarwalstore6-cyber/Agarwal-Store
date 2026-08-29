/* =========================================================
   AGARWAL STORE
   CODE 9 — APPLICATION CONSTANTS
   ========================================================= */

const AGARWAL_CONSTANTS = {

  /* -------------------------------------------------------
     APPLICATION
     ------------------------------------------------------- */

  APP_NAME:
    "Agarwal Store",

  APP_VERSION:
    "1.0.0",


  /* -------------------------------------------------------
     STORE
     ------------------------------------------------------- */

  STORE_CITY:
    "Darbhanga",

  STORE_PINCODE:
    "846003",


  /* -------------------------------------------------------
     ORDER
     ------------------------------------------------------- */

  DEFAULT_MINIMUM_ORDER:
    99,

  DEFAULT_DELIVERY_CHARGE:
    0,

  DEFAULT_PAYMENT_METHOD:
    "Cash on Delivery",


  /* -------------------------------------------------------
     CONTACT
     ------------------------------------------------------- */

  DEFAULT_PHONE:
    "9229609882",

  DEFAULT_WHATSAPP:
    "9229609882",


  /* -------------------------------------------------------
     HOME
     ------------------------------------------------------- */

  BANNER_INTERVAL:
    4000,


  /* -------------------------------------------------------
     ADMIN
     ------------------------------------------------------- */

  ADMIN_CLICK_COUNT:
    10,


  /* -------------------------------------------------------
     FIRESTORE COLLECTION NAMES
     ------------------------------------------------------- */

  COLLECTIONS: {

    CUSTOMERS:
      "customers",

    CATALOGUES:
      "catalogues",

    PRODUCTS:
      "products",

    ORDERS:
      "orders",

    BANNERS:
      "banners",

    DELIVERY_AREAS:
      "deliveryAreas",

    SETTINGS:
      "settings",

    ADMINS:
      "admins",

    SITE_STATS:
      "siteStats"

  },


  /* -------------------------------------------------------
     ORDER STATUS
     ------------------------------------------------------- */

  ORDER_STATUS: {

    NEW:
      "new",

    ACCEPTED:
      "accepted",

    OUT_FOR_DELIVERY:
      "out_for_delivery",

    DELIVERED:
      "delivered",

    CANCELLED:
      "cancelled"

  },


  /* -------------------------------------------------------
     CUSTOMER STATUS
     ------------------------------------------------------- */

  CUSTOMER_STATUS: {

    ACTIVE:
      "active",

    BLOCKED:
      "blocked"

  },


  /* -------------------------------------------------------
     PRODUCT STATUS
     ------------------------------------------------------- */

  PRODUCT_STATUS: {

    AVAILABLE:
      "available",

    OUT_OF_STOCK:
      "out_of_stock"

  }

};


/* =========================================================
   GLOBAL CONSTANTS
   ========================================================= */

window.AgarwalConstants =
  AGARWAL_CONSTANTS;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:constants-ready"
  )

);
