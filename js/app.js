/* =========================================================
   AGARWAL STORE
   PERMANENT APPLICATION LOADER
   ========================================================= */

window.AgarwalStore =
  window.AgarwalStore || {};

window.AgarwalStore.state =
  window.AgarwalStore.state || {

    currentUser: null,

    cart: [],

    catalogues: [],

    products: [],

    banners: [],

    currentCatalogue: null,

    currentProduct: null,

    deliveryLocation: null,

    isAdmin: false

  };


/* =========================================================
   MODULE LOADER
   ========================================================= */

const modules = [

  "./firebase.js",

  "./bootstrap.js",

  "./config.js",

  "./constants.js",

  "./firestore.js",

  "./auth.js",

  "./customer/profile.js"

];


async function loadModules() {

  for (const module of modules) {

    try {

      await import(module);

      console.log(
        "Agarwal Store loaded:",
        module
      );

    } catch (error) {

      console.error(
        "Agarwal Store module error:",
        module,
        error
      );

    }

  }

}


/* =========================================================
   BASIC EVENTS
   ========================================================= */

document
  .getElementById("profileButton")
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


document
  .getElementById("cartButton")
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


document
  .getElementById("searchInput")
  ?.addEventListener(
    "input",
    event => {

      window.dispatchEvent(
        new CustomEvent(
          "agarwal:search",
          {
            detail: {
              query:
                event.target.value.trim()
            }
          }
        )
      );

    }
  );


/* =========================================================
   ADMIN FOOTER — 10 CONSECUTIVE CLICKS
   ========================================================= */

let footerClicks = 0;

let footerTimer = null;


document
  .getElementById("adminTrigger")
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

            footerClicks = 0;

          },
          2500
        );


      if (footerClicks >= 10) {

        footerClicks = 0;

        window.dispatchEvent(
          new CustomEvent(
            "agarwal:admin-entry"
          )
        );

      }

    }
  );


/* =========================================================
   START
   ========================================================= */

loadModules();


/* =========================================================
   SPLASH
   ========================================================= */

setTimeout(
  () => {

    document
      .getElementById("splash")
      ?.classList
      .add("hide");


    document
      .getElementById("app")
      ?.classList
      .add("ready");

  },
  4000
);
