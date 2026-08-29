/* =========================================================
   AGARWAL STORE
   CODE 45 — STORE DATA LOADER
   ========================================================= */


const AgarwalStoreDataLoader = {


  loading: false,

  loaded: false,


  /* -------------------------------------------------------
     LOAD ALL STORE DATA
     ------------------------------------------------------- */

  async load() {

    if (this.loading) {

      return false;

    }


    this.loading =
      true;


    try {

      /* -----------------------------------------------
         CATALOGUES
         ----------------------------------------------- */

      if (
        window.AgarwalCatalogueStorage
      ) {

        window.AgarwalStore
          .state
          .catalogues =

          await window.AgarwalCatalogueStorage
            .getAll();

      }


      /* -----------------------------------------------
         PRODUCTS
         ----------------------------------------------- */

      if (
        window.AgarwalProductStorage
      ) {

        window.AgarwalStore
          .state
          .products =

          await window.AgarwalProductStorage
            .getAll();

      }


      /* -----------------------------------------------
         BANNERS
         ----------------------------------------------- */

      if (
        window.AgarwalBannerStorage
      ) {

        window.AgarwalStore
          .state
          .banners =

          await window.AgarwalBannerStorage
            .getActive();

      }


      /* -----------------------------------------------
         DELIVERY AREAS
         ----------------------------------------------- */

      if (
        window.AgarwalDeliveryAreaStorage
      ) {

        window.AgarwalStore
          .state
          .deliveryAreas =

          await window.AgarwalDeliveryAreaStorage
            .getActive();

      }


      /* -----------------------------------------------
         SETTINGS
         ----------------------------------------------- */

      if (
        window.AgarwalSettingsRuntime
      ) {

        window.AgarwalStore
          .state
          .settings =

          await window.AgarwalSettingsRuntime
            .load();

      }


      /* -----------------------------------------------
         BANNER SLIDER
         ----------------------------------------------- */

      if (
        window.AgarwalBannerSlider
      ) {

        window.AgarwalBannerSlider
          .init(

            window.AgarwalStore
              .state
              .banners,

            Number(

              window.AgarwalSettingsRuntime
                ?.getBannerInterval() ||

              4000

            )

          );

      }


      this.loaded =
        true;


      window.dispatchEvent(

        new CustomEvent(
          "agarwal:store-data-loaded",
          {
            detail: {

              catalogues:
                window.AgarwalStore
                  .state
                  .catalogues,

              products:
                window.AgarwalStore
                  .state
                  .products,

              banners:
                window.AgarwalStore
                  .state
                  .banners,

              deliveryAreas:
                window.AgarwalStore
                  .state
                  .deliveryAreas,

              settings:
                window.AgarwalStore
                  .state
                  .settings

            }

          }

        )

      );


      return true;

    } catch (error) {

      console.error(

        "Agarwal Store data loading error:",

        error

      );


      window.dispatchEvent(

        new CustomEvent(
          "agarwal:store-data-load-error",
          {
            detail: {

              error

            }

          }

        )

      );


      return false;

    } finally {

      this.loading =
        false;

    }

  },


  /* -------------------------------------------------------
     REFRESH ALL DATA
     ------------------------------------------------------- */

  async refresh() {

    this.loaded =
      false;


    return this.load();

  },


  /* -------------------------------------------------------
     GET STATE
     ------------------------------------------------------- */

  getState() {

    return {

      catalogues:
        window.AgarwalStore
          ?.state
          ?.catalogues || [],

      products:
        window.AgarwalStore
          ?.state
          ?.products || [],

      banners:
        window.AgarwalStore
          ?.state
          ?.banners || [],

      deliveryAreas:
        window.AgarwalStore
          ?.state
          ?.deliveryAreas || [],

      settings:
        window.AgarwalStore
          ?.state
          ?.settings || null

    };

  }

};


/* =========================================================
   PUBLIC DATA LOADER API
   ========================================================= */

window.AgarwalStoreDataLoader =
  AgarwalStoreDataLoader;


/* =========================================================
   START AFTER MODULES LOAD
   ========================================================= */

window.addEventListener(

  "agarwal:modules-loaded",

  () => {

    AgarwalStoreDataLoader
      .load();

  }

);


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:store-data-loader-ready"
  )

);
