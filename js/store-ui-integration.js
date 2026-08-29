/* =========================================================
   AGARWAL STORE
   CODE 66 — STORE UI + CART + SEARCH UPGRADE
   ========================================================= */


(async function () {

  "use strict";


  /* =======================================================
     BASIC HELPERS
     ======================================================= */

  const $ = id =>
    document.getElementById(id);


  const store =
    window.AgarwalStore;


  if (!store) {

    console.error(
      "AgarwalStore is not ready."
    );

    return;

  }


  /* =======================================================
     LOAD UI MODULES
     ======================================================= */

  try {

    await import(
      "./catalogue-ui.js"
    );

    await import(
      "./product-ui.js"
    );

  } catch (error) {

    console.error(
      "Agarwal Store UI modules failed:",
      error
    );

    return;

  }


  /* =======================================================
     WAIT FOR FIREBASE / STORAGE
     ======================================================= */

  async function waitForCore(
    timeout = 10000
  ) {

    const start =
      Date.now();


    while (

      Date.now() - start <
      timeout

    ) {

      if (

        window.AgarwalFirestore &&

        window.AgarwalCatalogueStorage &&

        window.AgarwalProductStorage

      ) {

        return true;

      }


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            100
          )
      );

    }


    return false;

  }


  const coreReady =
    await waitForCore();


  if (!coreReady) {

    console.error(
      "Agarwal Store core modules are not ready."
    );

    return;

  }


  /* =======================================================
     PRODUCT SECTION
     ======================================================= */

  function createProductSection() {

    if (
      $("productSection")
    ) {

      return;

    }


    const catalogueGrid =
      $("catalogueGrid");


    if (!catalogueGrid) {

      return;

    }


    const section =
      document.createElement(
        "section"
      );


    section.id =
      "productSection";


    section.innerHTML = `

      <div class="heading">

        <h2>
          Products
        </h2>

        <span id="productCount">
          0 products
        </span>

      </div>


      <div id="productGrid">

        <div class="product-empty">

          <div>
            🛒
          </div>

          <h3>
            Loading products...
          </h3>

          <p>
            Please wait.
          </p>

        </div>

      </div>

    `;


    const catalogueSection =
      catalogueGrid.closest(
        "section"
      );


    if (
      catalogueSection
    ) {

      catalogueSection.after(
        section
      );

    } else {

      document
        .querySelector("main")
        ?.appendChild(
          section
        );

    }

  }


  createProductSection();


  /* =======================================================
     PRODUCT COUNT
     ======================================================= */

  function updateProductCount(
    count
  ) {

    const element =
      $("productCount");


    if (!element) {

      return;

    }


    element.textContent =

      `${count} ${
        count === 1
          ? "product"
          : "products"
      }`;

  }


  /* =======================================================
     SHOW MESSAGE
     ======================================================= */

  function showMessage(
    message
  ) {

    let toast =
      $("agarwalStoreToast");


    if (!toast) {

      toast =
        document.createElement(
          "div"
        );


      toast.id =
        "agarwalStoreToast";


      toast.style.cssText = `

        position:fixed;

        left:50%;

        bottom:22px;

        transform:
          translateX(-50%);

        z-index:99999;

        max-width:
          calc(100vw - 32px);

        padding:
          12px 18px;

        border-radius:
          14px;

        background:
          #123D2B;

        color:
          white;

        font-size:
          13px;

        font-weight:
          700;

        text-align:
          center;

        box-shadow:
          0 8px 25px
          rgba(0,0,0,.2);

        opacity:
          0;

        pointer-events:
          none;

        transition:
          opacity .2s ease;

      `;


      document.body
        .appendChild(
          toast
        );

    }


    toast.textContent =
      message;


    toast.style.opacity =
      "1";


    clearTimeout(
      toast._timer
    );


    toast._timer =
      setTimeout(

        () => {

          toast.style.opacity =
            "0";

        },

        1800

      );

  }


  /* =======================================================
     CART BADGE
     ======================================================= */

  function updateCartBadge(
    count
  ) {

    const button =
      $("cartButton");


    if (!button) {

      return;

    }


    let badge =
      button.querySelector(
        ".cart-count"
      );


    if (!badge) {

      badge =
        document.createElement(
          "span"
        );


      badge.className =
        "cart-count";


      badge.style.cssText = `

        position:absolute;

        top:-4px;

        right:-4px;

        min-width:19px;

        height:19px;

        padding:0 5px;

        border-radius:20px;

        background:#123D2B;

        color:white;

        display:flex;

        align-items:center;

        justify-content:center;

        font-size:10px;

        font-weight:900;

        border:2px solid white;

      `;


      button.style.position =
        "relative";


      button.appendChild(
        badge
      );

    }


    const total =
      Number(
        count || 0
      );


    badge.textContent =
      total > 99
        ? "99+"
        : String(total);


    badge.style.display =
      total > 0
        ? "flex"
        : "none";

  }


  /* =======================================================
     CART CONNECTION
     ======================================================= */

  function setupCart() {

    if (
      !window.AgarwalCart
    ) {

      return;

    }


    const cart =
      window.AgarwalCart;


    updateCartBadge(
      cart.getItemCount?.() || 0
    );


    window.addEventListener(

      "agarwal:cart-changed",

      event => {

        updateCartBadge(

          event.detail
            ?.count || 0

        );

      }

    );

  }


  setupCart();


  /* =======================================================
     ADD PRODUCT TO CART
     ======================================================= */

  function setupProductCart() {

    const productUI =
      window.AgarwalProductUI;


    if (!productUI) {

      return;

    }


    productUI.addToCart =

      function (
        productId
      ) {

        const products =

          store.state
            ?.products || [];


        const product =

          products.find(

            item =>

              String(
                item?.id
              ) ===

              String(
                productId
              )

          );


        if (!product) {

          showMessage(
            "Product not found."
          );

          return false;

        }


        if (
          product.outOfStock ===
          true
        ) {

          showMessage(
            "This product is out of stock."
          );

          return false;

        }


        if (
          !window.AgarwalCart
        ) {

          showMessage(
            "Cart is not ready."
          );

          return false;

        }


        try {

          window.AgarwalCart
            .addProduct(
              product,
              1
            );


          showMessage(

            `${product.name || "Product"} added to cart`

          );


          return true;

        } catch (error) {

          console.error(
            "Cart error:",
            error
          );


          showMessage(

            error.message ||
            "Could not add product."

          );


          return false;

        }

      };

  }


  setupProductCart();


  /* =======================================================
     LOAD CATALOGUES
     ======================================================= */

  async function loadCatalogues() {

    try {

      const catalogues =

        await window
          .AgarwalCatalogueStorage
          .getActive();


      store.state
        .catalogues =
        catalogues;


      window.AgarwalCatalogueUI
        ?.render(
          catalogues
        );


      return catalogues;

    } catch (error) {

      console.error(
        "Catalogue loading failed:",
        error
      );


      window.AgarwalCatalogueUI
        ?.renderEmpty();


      return [];

    }

  }


  /* =======================================================
     LOAD PRODUCTS
     ======================================================= */

  async function loadProducts() {

    try {

      const products =

        await window
          .AgarwalProductStorage
          .getAll();


      const activeProducts =

        products.filter(

          product =>

            product?.active !== false

        );


      store.state
        .products =
        activeProducts;


      window.AgarwalProductUI
        ?.render(
          activeProducts
        );


      updateProductCount(
        activeProducts.length
      );


      return activeProducts;

    } catch (error) {

      console.error(
        "Product loading failed:",
        error
      );


      window.AgarwalProductUI
        ?.render(
          []
        );


      updateProductCount(
        0
      );


      return [];

    }

  }


  /* =======================================================
     CATALOGUE CLICK
     ======================================================= */

  window.addEventListener(

    "agarwal:open-catalogue",

    async event => {

      const catalogueId =

        event.detail
          ?.catalogueId;


      if (!catalogueId) {

        return;

      }


      try {

        const products =

          await window
            .AgarwalProductStorage
            .getByCatalogue(
              catalogueId
            );


        store.state
          .products =
          products;


        window.AgarwalProductUI
          ?.render(
            products
          );


        updateProductCount(
          products.length
        );


        $("productSection")
          ?.scrollIntoView({

            behavior:
              "smooth",

            block:
              "start"

          });


      } catch (error) {

        console.error(
          "Catalogue product loading failed:",
          error
        );


        showMessage(
          "Products could not be loaded."
        );

      }

    }

  );


  /* =======================================================
     SEARCH
     ======================================================= */

  window.addEventListener(

    "agarwal:search",

    event => {

      const query =

        String(
          event.detail
            ?.query || ""
        )
        .trim()
        .toLowerCase();


      const products =

        store.state
          ?.products || [];


      if (!query) {

        window.AgarwalProductUI
          ?.render(
            products
          );


        updateProductCount(
          products.length
        );


        return;

      }


      const filtered =

        products.filter(

          product => {

            const name =

              String(
                product?.name ||
                ""
              )
              .toLowerCase();


            const unit =

              String(
                product?.unit ||
                ""
              )
              .toLowerCase();


            const description =

              String(
                product?.description ||
                ""
              )
              .toLowerCase();


            return (

              name.includes(
                query
              ) ||

              unit.includes(
                query
              ) ||

              description.includes(
                query
              )

            );

          }

        );


      window.AgarwalProductUI
        ?.render(
          filtered
        );


      updateProductCount(
        filtered.length
      );

    }

  );


  /* =======================================================
     CART BUTTON
     ======================================================= */

  const cartButton =
    $("cartButton");


  if (
    cartButton &&
    !cartButton.dataset
      .integrationReady
  ) {

    cartButton.dataset
      .integrationReady =
      "true";


    cartButton.addEventListener(

      "click",

      () => {

        const count =

          window.AgarwalCart
            ?.getItemCount?.() || 0;


        if (
          count === 0
        ) {

          showMessage(
            "Your cart is empty."
          );

          return;

        }


        window.dispatchEvent(

          new CustomEvent(
            "agarwal:open-cart"
          )

        );

      }

    );

  }


  /* =======================================================
     IMAGE ERROR FALLBACK
     ======================================================= */

  document.addEventListener(

    "error",

    event => {

      const image =
        event.target;


      if (
        image?.tagName !==
        "IMG"
      ) {

        return;

      }


      if (
        image.dataset
          .fallbackApplied
      ) {

        return;

      }


      image.dataset
        .fallbackApplied =
        "true";


      image.style.display =
        "none";


      const parent =
        image.parentElement;


      if (
        parent &&
        !parent.querySelector(
          ".image-fallback"
        )
      ) {

        const fallback =
          document.createElement(
            "div"
          );


        fallback.className =
          "image-fallback";


        fallback.textContent =
          "🛒";


        fallback.style.cssText = `

          display:flex;

          align-items:center;

          justify-content:center;

          width:100%;

          height:100%;

          min-height:120px;

          font-size:42px;

        `;


        parent.appendChild(
          fallback
        );

      }

    },

    true

  );


  /* =======================================================
     REFRESH FUNCTION
     ======================================================= */

  async function refresh() {

    await Promise.all([

      loadCatalogues(),

      loadProducts()

    ]);


    updateCartBadge(

      window.AgarwalCart
        ?.getItemCount?.() || 0

    );

  }


  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.AgarwalStoreUI = {

    refresh,

    loadCatalogues,

    loadProducts,

    showMessage,

    updateCartBadge

  };


  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  await refresh();


  /* =======================================================
     READY
     ======================================================= */

  window.dispatchEvent(

    new CustomEvent(
      "agarwal:store-ui-ready"
    )

  );


  console.log(
    "Agarwal Store — Code 66 ready."
  );


})();
