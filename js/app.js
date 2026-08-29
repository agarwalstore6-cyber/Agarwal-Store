/* =========================================================
   AGARWAL STORE
   MAIN APPLICATION LOADER
   CODE 44 — COMPLETE MODULE INTEGRATION
   ========================================================= */


window.AgarwalStore =
  window.AgarwalStore || {};


window.AgarwalStore.state =
  window.AgarwalStore.state || {

    currentUser:
      null,

    cart:
      [],

    catalogues:
      [],

    products:
      [],

    banners:
      [],

    currentCatalogue:
      null,

    currentProduct:
      null,

    deliveryLocation:
      null,

    deliveryAreas:
      [],

    settings:
      null,

    isAdmin:
      false

  };


/* =========================================================
   MODULE LIST
   ========================================================= */

const modules = [

  /* -----------------------------------------
     CORE
     ----------------------------------------- */

  "./firebase.js",

  "./bootstrap.js",

  "./config.js",

  "./constants.js",

  "./firestore.js",

  "./auth.js",


  /* -----------------------------------------
     DATA FOUNDATION
     ----------------------------------------- */

  "./customer-data.js",

  "./catalogue-data.js",

  "./product-data.js",

  "./banner-data.js",


  /* -----------------------------------------
     CUSTOMER
     ----------------------------------------- */

  "./customer/profile.js",

  "./customer-storage.js",

  "./customer-session.js",

  "./customer-map.js",


  /* -----------------------------------------
     CART
     ----------------------------------------- */

  "./cart.js",


  /* -----------------------------------------
     CATALOGUES
     ----------------------------------------- */

  "./catalogue-products.js",

  "./catalogue-storage.js",


  /* -----------------------------------------
     PRODUCTS
     ----------------------------------------- */

  "./product-storage.js",


  /* -----------------------------------------
     BANNERS
     ----------------------------------------- */

  "./banner-slider.js",

  "./banner-storage.js",


  /* -----------------------------------------
     SETTINGS
     ----------------------------------------- */

  "./settings-storage.js",

  "./settings-runtime.js",


  /* -----------------------------------------
     DELIVERY
     ----------------------------------------- */

  "./delivery-area.js",

  "./delivery-area-storage.js",

  "./delivery-check.js",


  /* -----------------------------------------
     ORDERS
     ----------------------------------------- */

  "./order-data.js",

  "./order-validation.js",

  "./order-storage.js",

  "./order-counter.js",


  /* -----------------------------------------
     CLOUDINARY
     ----------------------------------------- */

  "./cloudinary.js"

];


/* =========================================================
   MODULE LOADER
   ========================================================= */

async function loadModules() {

  const loaded = [];

  const failed = [];


  for (
    const module of modules
  ) {

    try {

      await import(
        module
      );


      loaded.push(
        module
      );


      console.log(
        "Agarwal Store loaded:",
        module
      );


    } catch (
      error
    ) {

      failed.push({

        module:
          module,

        error:
          error

      });


      console.error(

        "Agarwal Store module error:",

        module,

        error

      );

    }

  }


  window.AgarwalStore
    .modules = {

      loaded,

      failed

    };


  window.dispatchEvent(

    new CustomEvent(
      "agarwal:modules-loaded",
      {
        detail: {

          loaded,

          failed

        }

      }
    )

  );


  return {

    loaded,

    failed

  };

}


/* =========================================================
   BASIC PROFILE BUTTON
   ========================================================= */

document
  .getElementById(
    "profileButton"
  )
  ?.addEventListener(

    "click",

    () => {

      window.dispatchEvent(

        new CustomEvent(
          "agarwal:open-profile"
        )

      );

    }

  );


/* =========================================================
   CART BUTTON
   ========================================================= */

document
  .getElementById(
    "cartButton"
  )
  ?.addEventListener(

    "click",

    () => {

      window.dispatchEvent(

        new CustomEvent(
          "agarwal:open-cart"
        )

      );

    }

  );


/* =========================================================
   SEARCH
   ========================================================= */

document
  .getElementById(
    "searchInput"
  )
  ?.addEventListener(

    "input",

    event => {

      window.dispatchEvent(

        new CustomEvent(
          "agarwal:search",
          {

            detail: {

              query:
                event.target.value
                  .trim()

            }

          }

        )

      );

    }

  );


/* =========================================================
   ADMIN FOOTER
   10 CONSECUTIVE CLICKS
   ========================================================= */

let footerClicks =
  0;


let footerTimer =
  null;


document
  .getElementById(
    "adminTrigger"
  )
  ?.addEventListener(

    "click",

    () => {

      footerClicks++;


      clearTimeout(
        footerTimer
      );


      footerTimer =
        setTimeout(

          () => {

            footerClicks =
              0;

          },

          2500

        );


      if (
        footerClicks >= 10
      ) {

        footerClicks =
          0;


        window.dispatchEvent(

          new CustomEvent(
            "agarwal:admin-entry"
          )

        );

      }

    }

  );


/* =========================================================
   START APPLICATION
   ========================================================= */

loadModules()
  .then(

    result => {

      console.log(

        "Agarwal Store startup complete.",

        result

      );

    }

  )
  .catch(

    error => {

      console.error(

        "Agarwal Store startup error:",

        error

      );

    }

  );


/* =========================================================
   SPLASH SCREEN
   ========================================================= */

setTimeout(

  () => {

    document
      .getElementById(
        "splash"
      )
      ?.classList
      .add(
        "hide"
      );


    document
      .getElementById(
        "app"
      )
      ?.classList
      .add(
        "ready"
      );

  },

  4000

);
