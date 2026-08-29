/* =========================================================
   AGARWAL STORE
   CODE 2 — APPLICATION FOUNDATION
   ========================================================= */

const AgarwalStore = {

  version: "1.0.0",

  store: {
    name: "Agarwal Store",

    address: "Ayachi Nagar, Benta",

    city: "Darbhanga",

    pincode: "846003",

    phone: "9229609882",

    whatsapp: "9229609882",

    minimumOrder: 99,

    deliveryCharge: 0,

    paymentMethod: "Cash on Delivery",

    bannerInterval: 4000
  },

  state: {
    currentUser: null,

    cart: [],

    catalogues: [],

    products: [],

    banners: [],

    currentCatalogue: null,

    currentProduct: null,

    deliveryLocation: null,

    isAdmin: false
  }

};


/* =========================================================
   MAKE STATE AVAILABLE TO FUTURE MODULES
   ========================================================= */

window.AgarwalStore = AgarwalStore;


/* =========================================================
   ELEMENTS
   ========================================================= */

const splash =
  document.getElementById("splash");

const app =
  document.getElementById("app");

const profileButton =
  document.getElementById("profileButton");

const cartButton =
  document.getElementById("cartButton");

const searchInput =
  document.getElementById("searchInput");

const catalogueGrid =
  document.getElementById("catalogueGrid");

const adminTrigger =
  document.getElementById("adminTrigger");


/* =========================================================
   SPLASH SCREEN
   ========================================================= */

function startSplash() {

  window.setTimeout(() => {

    if (splash) {

      splash.classList.add("hide");

    }

    if (app) {

      app.classList.add("ready");

    }

  }, 4000);

}


/* =========================================================
   PROFILE EVENT
   ========================================================= */

profileButton?.addEventListener(
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
   CART EVENT
   ========================================================= */

cartButton?.addEventListener(
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
   SEARCH EVENT
   ========================================================= */

searchInput?.addEventListener(
  "input",
  event => {

    const query =
      event.target.value.trim();

    window.dispatchEvent(
      new CustomEvent(
        "agarwal:search",
        {
          detail: {
            query: query
          }
        }
      )
    );

  }
);


/* =========================================================
   ADMIN SECRET BUTTON
   ========================================================= */

let footerClickCount = 0;

let footerClickTimer = null;


adminTrigger?.addEventListener(
  "click",
  () => {

    footerClickCount += 1;

    clearTimeout(
      footerClickTimer
    );

    footerClickTimer =
      window.setTimeout(
        () => {

          footerClickCount = 0;

        },
        2500
      );


    if (footerClickCount >= 10) {

      footerClickCount = 0;

      window.dispatchEvent(
        new CustomEvent(
          "agarwal:admin-entry"
        )
      );

    }

  }
);


/* =========================================================
   CATALOGUE RENDER FOUNDATION
   ========================================================= */

function renderCatalogues(
  catalogues = []
) {

  if (!catalogueGrid) {

    return;

  }


  AgarwalStore.state.catalogues =
    catalogues;


  if (!catalogues.length) {

    catalogueGrid.innerHTML = `
      <div class="empty">
        🛍️
        <h3>Categories coming soon</h3>
        <p>
          Products and catalogues will appear here.
        </p>
      </div>
    `;

    return;

  }


  catalogueGrid.innerHTML =
    catalogues
      .map(catalogue => {

        return `
          <button
            class="catalogue-card"
            data-catalogue-id="${escapeHTML(
              catalogue.id || ""
            )}"
            type="button"
          >

            ${
              catalogue.image
                ? `
                  <img
                    src="${escapeHTML(
                      catalogue.image
                    )}"
                    alt="${escapeHTML(
                      catalogue.name || "Catalogue"
                    )}"
                    loading="lazy"
                  >
                `
                : `
                  <div class="catalogue-placeholder">
                    🛍️
                  </div>
                `
            }

            <strong>
              ${escapeHTML(
                catalogue.name || "Catalogue"
              )}
            </strong>

          </button>
        `;

      })
      .join("");


  catalogueGrid
    .querySelectorAll(
      ".catalogue-card"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const id =
            card.dataset.catalogueId;

          window.dispatchEvent(
            new CustomEvent(
              "agarwal:catalogue-open",
              {
                detail: {
                  catalogueId: id
                }
              }
            )
          );

        }
      );

    });

}


/* =========================================================
   SAFE HTML
   ========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   GLOBAL HELPERS
   ========================================================= */

window.AgarwalStoreAPI = {

  getStoreSettings() {

    return {
      ...AgarwalStore.store
    };

  },


  getState() {

    return AgarwalStore.state;

  },


  setUser(user) {

    AgarwalStore.state.currentUser =
      user;

  },


  setCart(cart) {

    AgarwalStore.state.cart =
      Array.isArray(cart)
        ? cart
        : [];

  },


  renderCatalogues

};


/* =========================================================
   APPLICATION START
   ========================================================= */

startSplash();


/* =========================================================
   FOUNDATION READY EVENT
   ========================================================= */

window.dispatchEvent(
  new CustomEvent(
    "agarwal:foundation-ready"
  )
);
