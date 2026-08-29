/* =========================================================
   AGARWAL STORE
   CODE 65 — MASTER STORE UI INTEGRATION
   ========================================================= */


(async function () {


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
     WAIT FOR CORE MODULES
     ======================================================= */

  function waitForModules() {

    return new Promise(
      resolve => {

        if (
          window.AgarwalFirestore &&
          window.AgarwalCatalogueStorage &&
          window.AgarwalProductStorage
        ) {

          resolve();

          return;

        }


        window.addEventListener(

          "agarwal:modules-loaded",

          () => {

            resolve();

          },

          {
            once: true
          }

        );

      }
    );

  }


  await waitForModules();


  /* =======================================================
     CREATE PRODUCT SECTION
     ======================================================= */

  function createProductSection() {

    if (
      document.getElementById(
        "productSection"
      )
    ) {

      return;

    }


    const catalogueGrid =
      document.getElementById(
        "catalogueGrid"
      );


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


    catalogueGrid
      .closest("section")
      ?.after(section);


    const style =
      document.createElement(
        "style"
      );


    style.textContent = `

      #productSection {

        margin-top:
          30px;

      }


      #productCount {

        font-size:
          12px;

        color:
          #718179;

        font-weight:
          700;

      }

    `;


    document.head.appendChild(
      style
    );

  }


  createProductSection();


  /* =======================================================
     LOAD CATALOGUES
     ======================================================= */

  async function loadCatalogues() {

    try {

      const catalogues =

        await window
          .AgarwalCatalogueStorage
          .getActive();


      window.AgarwalStore
        .state
        .catalogues =
        catalogues;


      window.AgarwalCatalogueUI
        .render(
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


      window.AgarwalStore
        .state
        .products =
        activeProducts;


      window.AgarwalProductUI
        .render(
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
     PRODUCT COUNT
     ======================================================= */

  function updateProductCount(
    count
  ) {

    const element =
      document.getElementById(
        "productCount"
      );


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
     FIX PRODUCT → CART CONNECTION
     ======================================================= */

  const originalAddToCart =

    window.AgarwalProductUI
      ?.addToCart;


  if (
    window.AgarwalProductUI
  ) {

    window.AgarwalProductUI
      .addToCart =

      function (
        productId
      ) {

        const products =

          window.AgarwalStore
            ?.state
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

          return false;

        }


        if (
          product.outOfStock ===
          true
        ) {

          return false;

        }


        try {

          window.AgarwalCart
            .addProduct(
              product,
              1
            );


          showCartMessage(
            `${product.name || "Product"} added to cart`
          );


          return true;

        } catch (error) {

          console.error(
            "Cart error:",
            error
          );


          showCartMessage(
            error.message ||
            "Unable to add product."
          );


          return false;

        }

      };

  }


  /* =======================================================
     CART MESSAGE
     ======================================================= */

  function showCartMessage(
    message
  ) {

    let toast =
      document.getElementById(
        "agarwalCartToast"
      );


    if (!toast) {

      toast =
        document.createElement(
          "div"
        );


      toast.id =
        "agarwalCartToast";


      toast.style.cssText = `

        position:fixed;

        left:50%;

        bottom:22px;

        transform:
          translateX(-50%);

        z-index:99999;

        padding:12px 18px;

        border-radius:14px;

        background:#123D2B;

        color:white;

        font-size:13px;

        font-weight:700;

        box-shadow:
          0 8px 25px
          rgba(0,0,0,.2);

        opacity:0;

        pointer-events:none;

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


        window.AgarwalStore
          .state
          .products =
          products;


        window.AgarwalProductUI
          .render(
            products
          );


        updateProductCount(
          products.length
        );


        document
          .getElementById(
            "productSection"
          )
          ?.scrollIntoView({

            behavior:
              "smooth",

            block:
              "start"

          });


      } catch (error) {

        console.error(
          "Catalogue products failed:",
          error
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
            ?.query ||
          ""
        )
        .trim()
        .toLowerCase();


      const allProducts =

        window.AgarwalStore
          ?.state
          ?.products || [];


      if (!query) {

        window.AgarwalProductUI
          ?.render(
            allProducts
          );


        updateProductCount(
          allProducts.length
        );


        return;

      }


      const filtered =

        allProducts.filter(

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


            return (

              name.includes(
                query
              ) ||

              unit.includes(
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

  document
    .getElementById(
      "cartButton"
    )
    ?.addEventListener(

      "click",

      () => {

        const count =

          window.AgarwalCart
            ?.getItemCount?.() ||

          0;


        if (
          count === 0
        ) {

          showCartMessage(
            "Your cart is empty."
          );

          return;

        }


        showCartMessage(

          `${count} ${
            count === 1
              ? "item"
              : "items"
          } in your cart`

        );


        window.dispatchEvent(

          new CustomEvent(
            "agarwal:open-cart"
          )

        );

      }

    );


  /* =======================================================
     CART CHANGE LISTENER
     ======================================================= */

  window.addEventListener(

    "agarwal:cart-changed",

    event => {

      const count =
        event.detail
          ?.count || 0;


      const cartButton =
        document.getElementById(
          "cartButton"
        );


      if (!cartButton) {

        return;

      }


      cartButton
        .setAttribute(
          "data-count",
          String(
            count
          )
        );

    }

  );


  /* =======================================================
     INITIAL DATA LOAD
     ======================================================= */

  await Promise.all([

    loadCatalogues(),

    loadProducts()

  ]);


  /* =======================================================
     INTEGRATION READY
     ======================================================= */

  window.dispatchEvent(

    new CustomEvent(
      "agarwal:store-ui-ready"
    )

  );


  console.log(
    "Agarwal Store UI integration ready."
  );


})();
