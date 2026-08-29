/* =========================================================
   AGARWAL STORE
   CODE 32 — SETTINGS RUNTIME
   ========================================================= */


const AgarwalSettingsRuntime = {


  settings: null,

  loaded: false,


  /* -------------------------------------------------------
     LOAD SETTINGS
     ------------------------------------------------------- */

  async load() {

    if (
      this.loaded &&
      this.settings
    ) {

      return this.settings;

    }


    if (
      !window.AgarwalSettingsStorage
    ) {

      throw new Error(
        "Settings storage is not ready."
      );

    }


    const settings =
      await window.AgarwalSettingsStorage
        .get();


    this.settings =
      settings;


    this.loaded =
      true;


    this.apply(
      settings
    );


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:settings-loaded",
        {
          detail: {
            settings
          }
        }
      )

    );


    return settings;

  },


  /* -------------------------------------------------------
     APPLY SETTINGS
     ------------------------------------------------------- */

  apply(
    settings = {}
  ) {

    const current =
      window.AgarwalStore?.state;


    if (!current) {

      return;

    }


    current.settings = {

      ...settings

    };


    if (
      window.AgarwalConfig
    ) {

      window.AgarwalConfig.delivery =
        {

          ...window.AgarwalConfig.delivery,

          minimumOrder:
            Number(
              settings.minimumOrder ??
              window.AgarwalConfig
                .delivery
                .minimumOrder ??
              99
            ),

          deliveryCharge:
            Number(
              settings.deliveryCharge ??
              0
            ),

          paymentMethod:
            settings.paymentMethod ||
            "Cash on Delivery"

        };


      window.AgarwalConfig.contact =
        {

          ...window.AgarwalConfig.contact,

          phone:
            settings.phone ||
            window.AgarwalConfig
              .contact
              .phone,

          whatsapp:
            settings.whatsapp ||
            window.AgarwalConfig
              .contact
              .whatsapp

        };


      window.AgarwalConfig.home =
        {

          ...window.AgarwalConfig.home,

          bannerInterval:
            Number(
              settings.bannerInterval ??
              4000
            )

        };

    }


    if (
      window.AgarwalBannerSlider
    ) {

      window.AgarwalBannerSlider
        .setInterval(

          Number(
            settings.bannerInterval ??
            4000
          )

        );

    }

  },


  /* -------------------------------------------------------
     REFRESH
     ------------------------------------------------------- */

  async refresh() {

    this.loaded =
      false;

    this.settings =
      null;


    return this.load();

  },


  /* -------------------------------------------------------
     GET ONE SETTING
     ------------------------------------------------------- */

  get(
    key,
    fallback = null
  ) {

    if (
      !this.settings
    ) {

      return fallback;

    }


    if (
      this.settings[key] ===
      undefined
    ) {

      return fallback;

    }


    return this.settings[key];

  },


  /* -------------------------------------------------------
     GET MINIMUM ORDER
     ------------------------------------------------------- */

  getMinimumOrder() {

    return Number(

      this.get(
        "minimumOrder",
        99
      )

    );

  },


  /* -------------------------------------------------------
     GET PHONE
     ------------------------------------------------------- */

  getPhone() {

    return (

      this.get(
        "phone",
        "9229609882"
      )

    );

  },


  /* -------------------------------------------------------
     GET WHATSAPP
     ------------------------------------------------------- */

  getWhatsApp() {

    return (

      this.get(
        "whatsapp",
        "9229609882"
      )

    );

  },


  /* -------------------------------------------------------
     GET BANNER INTERVAL
     ------------------------------------------------------- */

  getBannerInterval() {

    return Number(

      this.get(
        "bannerInterval",
        4000
      )

    );

  },


  /* -------------------------------------------------------
     DELIVERY ENABLED
     ------------------------------------------------------- */

  isDeliveryEnabled() {

    return (

      this.get(
        "deliveryEnabled",
        true
      ) === true

    );

  },


  /* -------------------------------------------------------
     OUT OF STOCK SYSTEM
     ------------------------------------------------------- */

  isOutOfStockEnabled() {

    return (

      this.get(
        "productOutOfStockEnabled",
        true
      ) === true

    );

  }


};


/* =========================================================
   PUBLIC SETTINGS API
   ========================================================= */

window.AgarwalSettingsRuntime =
  AgarwalSettingsRuntime;


/* =========================================================
   SETTINGS UPDATED EVENT
   ========================================================= */

window.addEventListener(

  "agarwal:settings-updated",

  event => {

    const settings =
      event.detail?.settings;


    if (
      settings
    ) {

      AgarwalSettingsRuntime
        .settings =
        settings;


      AgarwalSettingsRuntime
        .loaded =
        true;


      AgarwalSettingsRuntime
        .apply(
          settings
        );

    }

  }

);


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:settings-runtime-ready"
  )

);
