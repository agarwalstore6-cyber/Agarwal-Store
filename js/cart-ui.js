/* =========================================================
   AGARWAL STORE
   CODE 67 — CART UI
   ========================================================= */


const AgarwalCartUI = {


  /* -------------------------------------------------------
     GET CART
     ------------------------------------------------------- */

  getCart() {

    return window.AgarwalCart || null;

  },


  /* -------------------------------------------------------
     GET CONTAINER
     ------------------------------------------------------- */

  getContainer() {

    return (

      document.getElementById(
        "cartSection"
      ) ||

      document.getElementById(
        "cartContainer"
      )

    );

  },


  /* -------------------------------------------------------
     MONEY
     ------------------------------------------------------- */

  money(
    value
  ) {

    return (

      "₹" +

      Number(
        value || 0
      ).toLocaleString(
        "en-IN",
        {
          maximumFractionDigits:
            2
        }
      )

    );

  },


  /* -------------------------------------------------------
     ESCAPE
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
     CREATE CART SECTION
     ------------------------------------------------------- */

  createSection() {

    if (
      document.getElementById(
        "agarwalCartSection"
      )
    ) {

      return;

    }


    const section =
      document.createElement(
        "section"
      );


    section.id =
      "agarwalCartSection";


    section.innerHTML = `

      <div class="heading">

        <h2>
          Your Cart
        </h2>

        <span id="agarwalCartItems">
          0 items
        </span>

      </div>


      <div id="agarwalCartContainer">
      </div>

    `;


    const main =
      document.querySelector(
        "main"
      );


    if (main) {

      main.appendChild(
        section
      );

    }


    this.addStyles();

  },


  /* -------------------------------------------------------
     RENDER EMPTY
     ------------------------------------------------------- */

  renderEmpty() {

    const container =
      document.getElementById(
        "agarwalCartContainer"
      );


    if (!container) {

      return;

    }


    container.innerHTML = `

      <div class="agarwal-cart-empty">

        🛒

        <h3>
          Your cart is empty
        </h3>

        <p>
          Add some products to continue.
        </p>

      </div>

    `;


    this.updateItemCount(
      0
    );

  },


  /* -------------------------------------------------------
     CREATE ITEM
     ------------------------------------------------------- */

  createItem(
    item
  ) {

    const id =
      this.escape(
        item.productId
      );


    const name =
      this.escape(
        item.name ||
        "Product"
      );


    const image =
      this.escape(
        item.image ||
        ""
      );


    const quantity =
      Math.max(
        1,
        Number(
          item.quantity || 1
        )
      );


    const price =
      Number(
        item.price || 0
      );


    const subtotal =
      price *
      quantity;


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

          <div class="cart-item-placeholder">
            🛒
          </div>

        `;


    return `

      <article
        class="agarwal-cart-item"
        data-product-id="${id}"
      >

        <div class="cart-item-image">

          ${imageHTML}

        </div>


        <div class="cart-item-details">

          <h3>
            ${name}
          </h3>


          <div class="cart-item-price">

            ${this.money(price)}

          </div>


          <div class="cart-item-bottom">

            <div class="cart-quantity">

              <button
                type="button"
                data-action="decrease"
                data-product-id="${id}"
                aria-label="Decrease quantity"
              >
                −
              </button>


              <strong>
                ${quantity}
              </strong>


              <button
                type="button"
                data-action="increase"
                data-product-id="${id}"
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>


            <strong class="cart-item-subtotal">

              ${this.money(subtotal)}

            </strong>

          </div>


          <button
            type="button"
            class="cart-remove"
            data-action="remove"
            data-product-id="${id}"
          >

            Remove

          </button>

        </div>

      </article>

    `;

  },


  /* -------------------------------------------------------
     RENDER CART
     ------------------------------------------------------- */

  render() {

    this.createSection();


    const container =
      document.getElementById(
        "agarwalCartContainer"
      );


    if (!container) {

      return false;

    }


    const cart =
      this.getCart();


    if (!cart) {

      this.renderEmpty();

      return false;

    }


    const items =
      cart.getItems();


    if (
      !items.length
    ) {

      this.renderEmpty();

      return true;

    }


    container.innerHTML =

      items
        .map(
          item =>
            this.createItem(
              item
            )
        )
        .join("");


    this.renderSummary();


    this.updateItemCount(

      cart.getItemCount()

    );


    this.bindEvents();


    return true;

  },


  /* -------------------------------------------------------
     SUMMARY
     ------------------------------------------------------- */

  renderSummary() {

    const container =
      document.getElementById(
        "agarwalCartContainer"
      );


    if (!container) {

      return;

    }


    const cart =
      this.getCart();


    if (!cart) {

      return;

    }


    const subtotal =
      cart.getSubtotal();


    const delivery =
      cart.getDeliveryCharge();


    const total =
      cart.getTotal();


    const minimumOK =
      cart.meetsMinimumOrder();


    const minimumMessage =
      cart.getMinimumOrderMessage();


    const summary =
      document.createElement(
        "div"
      );


    summary.className =
      "agarwal-cart-summary";


    summary.innerHTML = `

      <div class="cart-summary-row">

        <span>
          Subtotal
        </span>

        <strong>
          ${this.money(subtotal)}
        </strong>

      </div>


      <div class="cart-summary-row">

        <span>
          Delivery
        </span>

        <strong>
          ${
            delivery === 0
              ? "FREE"
              : this.money(delivery)
          }
        </strong>

      </div>


      <div class="cart-summary-total">

        <span>
          Total
        </span>

        <strong>
          ${this.money(total)}
        </strong>

      </div>


      ${
        !minimumOK

          ? `

            <div class="cart-minimum-warning">

              ${this.escape(
                minimumMessage
              )}

            </div>

          `

          : `

            <div class="cart-minimum-ok">

              ✓ Minimum order reached

            </div>

          `
      }


      <button
        type="button"
        id="agarwalCheckoutButton"
        class="agarwal-checkout-button"
        ${minimumOK ? "" : "disabled"}
      >

        Proceed to Checkout

      </button>

    `;


    container.appendChild(
      summary
    );


    document
      .getElementById(
        "agarwalCheckoutButton"
      )
      ?.addEventListener(

        "click",

        () => {

          window.dispatchEvent(

            new CustomEvent(
              "agarwal:open-checkout"
            )

          );

        }

      );

  },


  /* -------------------------------------------------------
     ITEM COUNT
     ------------------------------------------------------- */

  updateItemCount(
    count
  ) {

    const element =
      document.getElementById(
        "agarwalCartItems"
      );


    if (!element) {

      return;

    }


    element.textContent =

      `${count} ${
        count === 1
          ? "item"
          : "items"
      }`;

  },


  /* -------------------------------------------------------
     BUTTON EVENTS
     ------------------------------------------------------- */

  bindEvents() {

    const container =
      document.getElementById(
        "agarwalCartContainer"
      );


    if (!container) {

      return;

    }


    container
      .querySelectorAll(
        "[data-action]"
      )
      .forEach(

        button => {

          button.addEventListener(

            "click",

            () => {

              const action =
                button.dataset
                  .action;


              const productId =
                button.dataset
                  .productId;


              const cart =
                this.getCart();


              if (!cart) {

                return;

              }


              if (
                action ===
                "increase"
              ) {

                cart.increase(
                  productId
                );

              }


              if (
                action ===
                "decrease"
              ) {

                cart.decrease(
                  productId
                );

              }


              if (
                action ===
                "remove"
              ) {

                cart.remove(
                  productId
                );

              }


              this.render();

            }

          );

        }

      );

  },


  /* -------------------------------------------------------
     CART CHANGE
     ------------------------------------------------------- */

  bindCartChange() {

    window.addEventListener(

      "agarwal:cart-changed",

      () => {

        this.render();

      }

    );

  },


  /* -------------------------------------------------------
     OPEN CART
     ------------------------------------------------------- */

  open() {

    this.createSection();


    const section =
      document.getElementById(
        "agarwalCartSection"
      );


    if (!section) {

      return;

    }


    this.render();


    section.scrollIntoView({

      behavior:
        "smooth",

      block:
        "start"

    });

  },


  /* -------------------------------------------------------
     STYLES
     ------------------------------------------------------- */

  addStyles() {

    if (
      document.getElementById(
        "agarwalCartUIStyles"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "agarwalCartUIStyles";


    style.textContent = `

      #agarwalCartSection {

        margin-top:
          30px;

      }


      #agarwalCartContainer {

        display:
          flex;

        flex-direction:
          column;

        gap:
          10px;

      }


      .agarwal-cart-item {

        display:
          flex;

        gap:
          12px;

        padding:
          12px;

        border:
          1px solid #e1e9e4;

        border-radius:
          18px;

        background:
          white;

        box-shadow:
          0 6px 20px
          rgba(18,61,43,.05);

      }


      .cart-item-image {

        width:
          78px;

        height:
          78px;

        flex:
          0 0 78px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        overflow:
          hidden;

        border-radius:
          14px;

        background:
          #f0f5f1;

      }


      .cart-item-image img {

        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

      }


      .cart-item-placeholder {

        font-size:
          30px;

      }


      .cart-item-details {

        flex:
          1;

        min-width:
          0;

      }


      .cart-item-details h3 {

        margin:
          0 0 4px;

        font-size:
          15px;

        color:
          #173126;

      }


      .cart-item-price {

        font-size:
          12px;

        color:
          #718179;

      }


      .cart-item-bottom {

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          10px;

        margin-top:
          9px;

      }


      .cart-quantity {

        display:
          flex;

        align-items:
          center;

        border:
          1px solid #dce6df;

        border-radius:
          10px;

        overflow:
          hidden;

      }


      .cart-quantity button {

        width:
          32px;

        height:
          30px;

        border:
          0;

        background:
          #edf4ef;

        color:
          #123D2B;

        font-size:
          18px;

        font-weight:
          800;

      }


      .cart-quantity strong {

        min-width:
          30px;

        text-align:
          center;

        font-size:
          13px;

      }


      .cart-item-subtotal {

        font-size:
          15px;

        color:
          #123D2B;

      }


      .cart-remove {

        margin-top:
          7px;

        padding:
          0;

        border:
          0;

        background:
          transparent;

        color:
          #7b665f;

        font-size:
          11px;

      }


      .agarwal-cart-summary {

        margin-top:
          12px;

        padding:
          17px;

        border:
          1px solid #dce6df;

        border-radius:
          18px;

        background:
          white;

      }


      .cart-summary-row,
      .cart-summary-total {

        display:
          flex;

        justify-content:
          space-between;

        gap:
          10px;

        padding:
          6px 0;

        font-size:
          13px;

      }


      .cart-summary-total {

        margin-top:
          7px;

        padding-top:
          13px;

        border-top:
          1px solid #e3ebe6;

        font-size:
          17px;

        color:
          #123D2B;

      }


      .cart-minimum-warning {

        margin-top:
          10px;

        padding:
          10px;

        border-radius:
          10px;

        background:
          #fff4e8;

        color:
          #825629;

        font-size:
          12px;

        font-weight:
          700;

      }


      .cart-minimum-ok {

        margin-top:
          10px;

        padding:
          9px;

        border-radius:
          10px;

        background:
          #edf6ef;

        color:
          #23633f;

        font-size:
          12px;

        font-weight:
          700;

      }


      .agarwal-checkout-button {

        width:
          100%;

        min-height:
          46px;

        margin-top:
          13px;

        border:
          0;

        border-radius:
          13px;

        background:
          #123D2B;

        color:
          white;

        font-size:
          14px;

        font-weight:
          800;

      }


      .agarwal-checkout-button:disabled {

        background:
          #c8d1cb;

        color:
          #66736c;

      }


      .agarwal-cart-empty {

        padding:
          32px 18px;

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


      .agarwal-cart-empty:first-child {

        font-size:
          38px;

      }


      .agarwal-cart-empty h3 {

        margin:
          10px 0 5px;

        color:
          #173126;

        font-size:
          18px;

      }


      .agarwal-cart-empty p {

        margin:
          0;

        font-size:
          13px;

      }


      @media (
        min-width: 700px
      ) {

        #agarwalCartContainer {

          max-width:
            760px;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }

};


/* =========================================================
   PUBLIC CART UI API
   ========================================================= */

window.AgarwalCartUI =
  AgarwalCartUI;


/* =========================================================
   INITIALIZE
   ========================================================= */

AgarwalCartUI
  .createSection();


AgarwalCartUI
  .bindCartChange();


/* =========================================================
   OPEN CART EVENT
   ========================================================= */

window.addEventListener(

  "agarwal:open-cart",

  () => {

    AgarwalCartUI
      .open();

  }

);


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:cart-ui-ready"
  )

);
