/* =========================================================
   AGARWAL STORE
   CODE 64 — PRODUCT UI RENDERER
   ========================================================= */


const AgarwalProductUI = {


  /* -------------------------------------------------------
     GET PRODUCT CONTAINER
     ------------------------------------------------------- */

  getContainer() {

    return (

      document.getElementById(
        "productGrid"
      ) ||

      document.getElementById(
        "productsGrid"
      )

    );

  },


  /* -------------------------------------------------------
     ESCAPE HTML
     ------------------------------------------------------- */

  escape(
    value
  ) {

    return String(
      value ?? ""
    )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

  },


  /* -------------------------------------------------------
     FORMAT PRICE
     ------------------------------------------------------- */

  money(
    value
  ) {

    const price =
      Number(
        value || 0
      );


    return (

      "₹" +

      price.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits:
            2
        }
      )

    );

  },


  /* -------------------------------------------------------
     CREATE PRODUCT CARD
     ------------------------------------------------------- */

  createCard(
    product,
    index
  ) {

    const id =
      this.escape(

        product?.id ||

        product?.productId ||

        `product-${index}`

      );


    const name =
      this.escape(

        product?.name ||

        product?.title ||

        "Product"

      );


    const price =
      Number(

        product?.price ||

        product?.sellingPrice ||

        0

      );


    const mrp =
      Number(

        product?.mrp ||

        product?.maximumRetailPrice ||

        0

      );


    const unit =
      this.escape(

        product?.unit ||

        ""

      );


    const image =
      this.escape(

        product?.image ||

        product?.imageUrl ||

        product?.photo ||

        ""

      );


    const outOfStock =
      product?.outOfStock === true;


    const imageHTML =

      image

        ? `

          <img
            src="${image}"
            alt="${name}"
            loading="lazy"
          >

        `

        : `

          <div class="product-placeholder">
            🛒
          </div>

        `;


    const oldPriceHTML =

      mrp > price

        ? `

          <span class="product-mrp">
            ${this.money(mrp)}
          </span>

        `

        : "";


    const buttonHTML =

      outOfStock

        ? `

          <button
            type="button"
            class="product-cart-button disabled"
            disabled
          >
            Out of stock
          </button>

        `

        : `

          <button
            type="button"
            class="product-cart-button"
            data-product-id="${id}"
          >
            Add to cart
          </button>

        `;


    return `

      <article
        class="product-card"
        data-product-id="${id}"
      >

        <div class="product-image">

          ${imageHTML}

        </div>


        <div class="product-info">

          <h3>
            ${name}
          </h3>


          ${
            unit

              ? `

                <span class="product-unit">
                  ${unit}
                </span>

              `

              : ""
          }


          <div class="product-price">

            <strong>
              ${this.money(price)}
            </strong>

            ${oldPriceHTML}

          </div>


          ${buttonHTML}

        </div>

      </article>

    `;

  },


  /* -------------------------------------------------------
     RENDER PRODUCTS
     ------------------------------------------------------- */

  render(
    products = []
  ) {

    const container =
      this.getContainer();


    if (!container) {

      return false;

    }


    if (
      !Array.isArray(
        products
      ) ||
      products.length === 0
    ) {

      container.innerHTML = `

        <div class="product-empty">

          <div>
            🛒
          </div>

          <h3>
            Products coming soon
          </h3>

          <p>
            Products will appear here.
          </p>

        </div>

      `;


      return true;

    }


    container.innerHTML =

      products
        .map(

          (
            product,
            index
          ) =>

            this.createCard(
              product,
              index
            )

        )
        .join("");


    this.bindEvents();


    return true;

  },


  /* -------------------------------------------------------
     ADD TO CART
     ------------------------------------------------------- */

  addToCart(
    productId
  ) {

    if (
      !productId
    ) {

      return false;

    }


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
      product.outOfStock === true
    ) {

      return false;

    }


    if (
      window.AgarwalCart
        ?.add
    ) {

      window.AgarwalCart
        .add(
          product
        );

    }


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:product-added-to-cart",
        {
          detail: {

            product

          }

        }
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     BUTTON EVENTS
     ------------------------------------------------------- */

  bindEvents() {

    const buttons =
      document.querySelectorAll(

        ".product-cart-button:not(.disabled)"

      );


    buttons.forEach(

      button => {

        button.addEventListener(

          "click",

          () => {

            this.addToCart(

              button.dataset
                .productId

            );

          }

        );

      }

    );

  },


  /* -------------------------------------------------------
     RENDER FROM STORE
     ------------------------------------------------------- */

  renderFromState() {

    const products =

      window.AgarwalStore
        ?.state
        ?.products || [];


    return this.render(
      products
    );

  }

};


/* =========================================================
   PRODUCT CARD STYLES
   ========================================================= */

const productStyle =
  document.createElement(
    "style"
  );


productStyle.textContent = `

  #productGrid,
  #productsGrid {

    display:
      grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

    gap:
      12px;

  }


  .product-card {

    overflow:
      hidden;

    border:
      1px solid #e1e9e4;

    border-radius:
      18px;

    background:
      white;

    box-shadow:
      0 7px 22px rgba(18,61,43,.06);

  }


  .product-image {

    width:
      100%;

    aspect-ratio:
      1 / 1;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    overflow:
      hidden;

    background:
      #f0f5f1;

  }


  .product-image img {

    width:
      100%;

    height:
      100%;

    object-fit:
      cover;

  }


  .product-placeholder {

    font-size:
      42px;

  }


  .product-info {

    padding:
      12px;

  }


  .product-info h3 {

    margin:
      0 0 5px;

    font-size:
      15px;

    line-height:
      1.3;

    color:
      #173126;

  }


  .product-unit {

    display:
      block;

    margin-bottom:
      8px;

    font-size:
      11px;

    color:
      #718179;

  }


  .product-price {

    display:
      flex;

    align-items:
      center;

    gap:
      7px;

    margin-bottom:
      10px;

  }


  .product-price strong {

    font-size:
      17px;

    color:
      #123D2B;

  }


  .product-mrp {

    font-size:
      12px;

    color:
      #8a9790;

    text-decoration:
      line-through;

  }


  .product-cart-button {

    width:
      100%;

    min-height:
      38px;

    border:
      0;

    border-radius:
      11px;

    background:
      #123D2B;

    color:
      white;

    font-size:
      12px;

    font-weight:
      800;

  }


  .product-cart-button:active {

    transform:
      scale(.97);

  }


  .product-cart-button.disabled {

    background:
      #c8d1cb;

    color:
      #66736c;

  }


  .product-empty {

    grid-column:
      1 / -1;

    padding:
      30px 18px;

    text-align:
      center;

    border:
      1px dashed #cddbd2;

    border-radius:
      20px;

    background:
      white;

    color:
      #718179;

  }


  .product-empty div {

    font-size:
      36px;

  }


  .product-empty h3 {

    margin:
      10px 0 5px;

    color:
      #173126;

  }


  .product-empty p {

    margin:
      0;

    font-size:
      13px;

  }


  @media (
    min-width: 700px
  ) {

    #productGrid,
    #productsGrid {

      grid-template-columns:
        repeat(
          4,
          minmax(0,1fr)
        );

    }

  }

`;


document.head.appendChild(
  productStyle
);


/* =========================================================
   PUBLIC API
   ========================================================= */

window.AgarwalProductUI =
  AgarwalProductUI;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:product-ui-ready"
  )

);
