/* =========================================================
   AGARWAL STORE
   CODE 60 — DELIVERY AREA CONFIGURATION
   ========================================================= */


const AgarwalDeliveryAreaConfig = {


  enabled: true,


  deliveryCharge: 0,


  minimumOrder: 99,


  areas: [

    {
      id:
        "benta-darbhanga",

      name:
        "Benta",

      city:
        "Darbhanga",

      pincode:
        "846003",

      enabled:
        true

    }

  ],


  /* -------------------------------------------------------
     GET ACTIVE AREAS
     ------------------------------------------------------- */

  getActiveAreas() {

    if (
      !this.enabled
    ) {

      return [];

    }


    return this.areas.filter(

      area =>
        area.enabled === true

    );

  },


  /* -------------------------------------------------------
     CHECK PINCODE
     ------------------------------------------------------- */

  isPincodeAllowed(
    pincode
  ) {

    const value =
      String(
        pincode || ""
      ).trim();


    return this
      .getActiveAreas()
      .some(

        area =>
          area.pincode ===
          value

      );

  },


  /* -------------------------------------------------------
     CHECK AREA NAME
     ------------------------------------------------------- */

  isAreaAllowed(
    areaName
  ) {

    const value =
      String(
        areaName || ""
      )
      .trim()
      .toLowerCase();


    return this
      .getActiveAreas()
      .some(

        area =>
          area.name
            .toLowerCase() ===
          value

      );

  },


  /* -------------------------------------------------------
     CHECK DELIVERY
     ------------------------------------------------------- */

  check(
    address = {}
  ) {

    if (
      !this.enabled
    ) {

      return {

        available:
          false,

        message:
          "Delivery is currently unavailable."

      };

    }


    const pincode =
      String(
        address.pincode || ""
      ).trim();


    const area =
      String(
        address.area || ""
      )
      .trim()
      .toLowerCase();


    const matchingArea =
      this
        .getActiveAreas()
        .find(

          item =>

            item.pincode ===
            pincode &&

            (
              !area ||

              item.name
                .toLowerCase() ===
              area

            )

        );


    if (
      !matchingArea
    ) {

      return {

        available:
          false,

        area:
          null,

        message:
          "Sorry, delivery is currently available only in Benta, Darbhanga."

      };

    }


    return {

      available:
        true,

      area:
        matchingArea,

      deliveryCharge:
        this.deliveryCharge,

      minimumOrder:
        this.minimumOrder,

      message:
        "✅ Delivery is available in Benta."

    };

  },


  /* -------------------------------------------------------
     GET CONFIGURATION
     ------------------------------------------------------- */

  get() {

    return {

      enabled:
        this.enabled,

      deliveryCharge:
        this.deliveryCharge,

      minimumOrder:
        this.minimumOrder,

      areas:
        this.getActiveAreas()

    };

  }

};


/* =========================================================
   PUBLIC DELIVERY CONFIG API
   ========================================================= */

window.AgarwalDeliveryAreaConfig =
  AgarwalDeliveryAreaConfig;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:delivery-area-config-ready"
  )

);
