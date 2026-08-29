/* =========================================================
   AGARWAL STORE
   CODE 30 — SETTINGS STORAGE
   ========================================================= */


const AgarwalSettingsStorage = {


  /* -------------------------------------------------------
     FIRESTORE DOCUMENT
     ------------------------------------------------------- */

  collectionName:
    "settings",

  documentId:
    "store",


  /* -------------------------------------------------------
     DEFAULT SETTINGS
     ------------------------------------------------------- */

  defaults() {

    return {

      storeName:
        "Agarwal Store",

      storeAddress:
        "Ayachi Nagar, Benta",

      city:
        "Darbhanga",

      pincode:
        "846003",

      phone:
        "9229609882",

      whatsapp:
        "9229609882",

      minimumOrder:
        99,

      deliveryCharge:
        0,

      paymentMethod:
        "Cash on Delivery",

      bannerInterval:
        4000,

      deliveryEnabled:
        true,

      productOutOfStockEnabled:
        true

    };

  },


  /* -------------------------------------------------------
     GET SETTINGS
     ------------------------------------------------------- */

  async get() {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const saved =
      await window.AgarwalFirestore
        .getDocumentData(

          this.collectionName,

          this.documentId

        );


    if (!saved) {

      return this.defaults();

    }


    return {

      ...this.defaults(),

      ...saved

    };

  },


  /* -------------------------------------------------------
     SAVE SETTINGS
     ------------------------------------------------------- */

  async save(
    settings
  ) {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const current =
      await this.get();


    const updated = {

      ...current,

      ...settings

    };


    await window.AgarwalFirestore
      .setDocument(

        this.collectionName,

        this.documentId,

        updated

      );


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:settings-updated",
        {
          detail: {
            settings:
              updated
          }
        }
      )

    );


    return updated;

  },


  /* -------------------------------------------------------
     UPDATE ONE SETTING
     ------------------------------------------------------- */

  async update(
    key,
    value
  ) {

    if (!key) {

      throw new Error(
        "Setting name is required."
      );

    }


    return this.save({

      [key]:
        value

    });

  },


  /* -------------------------------------------------------
     MINIMUM ORDER
     ------------------------------------------------------- */

  async setMinimumOrder(
    amount
  ) {

    const value =
      Math.max(
        0,
        Number(amount)
      );


    if (
      !Number.isFinite(value)
    ) {

      throw new Error(
        "Invalid minimum order amount."
      );

    }


    return this.update(

      "minimumOrder",

      value

    );

  },


  /* -------------------------------------------------------
     CONTACT NUMBERS
     ------------------------------------------------------- */

  async setContactNumbers(
    phone,
    whatsapp
  ) {

    return this.save({

      phone:
        phone ||
        "",

      whatsapp:
        whatsapp ||
        ""

    });

  },


  /* -------------------------------------------------------
     BANNER INTERVAL
     ------------------------------------------------------- */

  async setBannerInterval(
    milliseconds
  ) {

    const interval =
      Number(
        milliseconds
      );


    if (
      !Number.isFinite(interval) ||
      interval < 1000
    ) {

      throw new Error(
        "Banner interval must be at least 1000 milliseconds."
      );

    }


    return this.update(

      "bannerInterval",

      interval

    );

  },


  /* -------------------------------------------------------
     DELIVERY ENABLE / DISABLE
     ------------------------------------------------------- */

  async setDeliveryEnabled(
    enabled
  ) {

    return this.update(

      "deliveryEnabled",

      enabled === true

    );

  },


  /* -------------------------------------------------------
     PRODUCT STOCK SYSTEM
     ------------------------------------------------------- */

  async setOutOfStockEnabled(
    enabled
  ) {

    return this.update(

      "productOutOfStockEnabled",

      enabled === true

    );

  }

};


/* =========================================================
   PUBLIC SETTINGS API
   ========================================================= */

window.AgarwalSettingsStorage =
  AgarwalSettingsStorage;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:settings-storage-ready"
  )

);
