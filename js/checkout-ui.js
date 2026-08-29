/* =========================================================
   AGARWAL STORE
   CODE 68 — CHECKOUT + CUSTOMER + ADDRESS UI
   ========================================================= */


const AgarwalCheckoutUI = {


  /* -------------------------------------------------------
     GET MAIN
     ------------------------------------------------------- */

  getMain() {

    return document.querySelector(
      "main"
    );

  },


  /* -------------------------------------------------------
     CREATE CHECKOUT SECTION
     ------------------------------------------------------- */

  createSection() {

    if (
      document.getElementById(
        "agarwalCheckoutSection"
      )
    ) {

      return;

    }


    const main =
      this.getMain();


    if (!main) {

      return;

    }


    const section =
      document.createElement(
        "section"
      );


    section.id =
      "agarwalCheckoutSection";


    section.innerHTML = `

      <div class="heading">

        <h2>
          Checkout
        </h2>

        <span>
          Secure order
        </span>

      </div>


      <div class="checkout-card">

        <div class="checkout-step">

          <div class="checkout-step-title">

            <span>
              1
            </span>

            <strong>
              Customer Details
            </strong>

          </div>


          <label>

            Full Name

            <input
              id="checkoutName"
              type="text"
              placeholder="Enter your name"
              autocomplete="name"
              maxlength="80"
            >

          </label>


          <label>

            Mobile Number

            <input
              id="checkoutPhone"
              type="tel"
              placeholder="10-digit mobile number"
              autocomplete="tel"
              inputmode="numeric"
              maxlength="10"
            >

          </label>

        </div>


        <div class="checkout-step">

          <div class="checkout-step-title">

            <span>
              2
            </span>

            <strong>
              Delivery Address
            </strong>

          </div>


          <label>

            House / Street

            <input
              id="checkoutAddress"
              type="text"
              placeholder="House number, street, landmark"
              autocomplete="street-address"
              maxlength="180"
            >

          </label>


          <label>

            Area

            <input
              id="checkoutArea"
              type="text"
              value="Benta"
              autocomplete="address-level3"
              maxlength="80"
            >

          </label>


          <div class="checkout-two">

            <label>

              City

              <input
                id="checkoutCity"
                type="text"
                value="Darbhanga"
                readonly
              >

            </label>


            <label>

              PIN Code

              <input
                id="checkoutPincode"
                type="text"
                value="846003"
                inputmode="numeric"
                maxlength="6"
              >

            </label>

          </div>


          <div
            id="checkoutDeliveryResult"
            class="checkout-delivery-result"
          >
          </div>

        </div>


        <div class="checkout-step">

          <div class="checkout-step-title">

            <span>
              3
            </span>

            <strong>
              Order Summary
            </strong>

          </div>


          <div id="checkoutSummary">
          </div>

        </div>


        <div
          id="checkoutError"
          class="checkout-error"
          hidden
        >
        </div>


        <button
          type="button"
          id="placeOrderButton"
          class="place-order-button"
        >

          Place Order

        </button>

      </div>

    `;


    main.appendChild(
      section
    );


    this.addStyles();


    this.bindEvents();


    this.renderSummary();

  },


  /* -------------------------------------------------------
     MONEY
     ------------------------------------------------------- */

  money(
    amount
  ) {

    return (

      "₹" +

      Number(
        amount || 0
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
     RENDER SUMMARY
     ------------------------------------------------------- */

  renderSummary() {

    const element =
      document.getElementById(
        "checkoutSummary"
      );


    if (!element) {

      return;

    }


    const cart =
      window.AgarwalCart;


    if (!cart) {

      return;

    }


    const items =
      cart.getItems();


    const subtotal =
      cart.getSubtotal();


    const delivery =
      cart.getDeliveryCharge();


    const total =
      cart.getTotal();


    element.innerHTML = `

      <div class="checkout-summary-list">

        ${
          items.length

            ? items.map(

                item => `

                  <div
                    class="checkout-summary-item"
                  >

                    <span>

                      ${this.escape(
                        item.name ||
                        "Product"
                      )}

                      ×

                      ${Number(
                        item.quantity ||
                        0
                      )}

                    </span>


                    <strong>

                      ${this.money(
                        Number(
                          item.price ||
                          0
                        ) *
                        Number(
                          item.quantity ||
                          0
                        )
                      )}

                    </strong>

                  </div>

                `

              ).join("")

            : `

              <div class="checkout-empty">
                Your cart is empty.
              </div>

            `
        }

      </div>


      <div class="checkout-total-row">

        <span>
          Subtotal
        </span>

        <strong>
          ${this.money(subtotal)}
        </strong>

      </div>


      <div class="checkout-total-row">

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


      <div class="checkout-grand-total">

        <span>
          Total
        </span>

        <strong>
          ${this.money(total)}
        </strong>

      </div>


      <div class="checkout-payment">

        💵 Cash on Delivery

      </div>

    `;

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
     VALIDATE CUSTOMER
     ------------------------------------------------------- */

  validateCustomer() {

    const name =
      document.getElementById(
        "checkoutName"
      )?.value.trim();


    const phone =
      document.getElementById(
        "checkoutPhone"
      )?.value.trim();


    if (!name) {

      return {

        valid:
          false,

        message:
          "Please enter your name."

      };

    }


    if (
      !/^[0-9]{10}$/.test(
        phone
      )
    ) {

      return {

        valid:
          false,

        message:
          "Please enter a valid 10-digit mobile number."

      };

    }


    return {

      valid:
        true,

      name,

      phone

    };

  },


  /* -------------------------------------------------------
     VALIDATE ADDRESS
     ------------------------------------------------------- */

  validateAddress() {

    const address =
      document.getElementById(
        "checkoutAddress"
      )?.value.trim();


    const area =
      document.getElementById(
        "checkoutArea"
      )?.value.trim();


    const city =
      document.getElementById(
        "checkoutCity"
      )?.value.trim();


    const pincode =
      document.getElementById(
        "checkoutPincode"
      )?.value.trim();


    if (!address) {

      return {

        valid:
          false,

        message:
          "Please enter your house/street address."

      };

    }


    if (
      area.toLowerCase() !==
      "benta"
    ) {

      return {

        valid:
          false,

        message:
          "Delivery is currently available only in Benta."

      };

    }


    if (
      city.toLowerCase() !==
      "darbhanga"
    ) {

      return {

        valid:
          false,

        message:
          "Please select Darbhanga as the city."

      };

    }


    if (
      pincode !==
      "846003"
    ) {

      return {

        valid:
          false,

        message:
          "Delivery is currently available in Benta, PIN 846003."

      };

    }


    return {

      valid:
        true,

      fullAddress:
        address,

      area:
        "Benta",

      city:
        "Darbhanga",

      pincode:
        "846003"

    };

  },


  /* -------------------------------------------------------
     CHECK DELIVERY
     ------------------------------------------------------- */

  checkDelivery() {

    const address =
      this.validateAddress();


    const resultElement =
      document.getElementById(
        "checkoutDeliveryResult"
      );


    if (!resultElement) {

      return address;

    }


    if (
      !address.valid
    ) {

      resultElement.className =
        "checkout-delivery-result error";


      resultElement.textContent =
        address.message;


      return address;

    }


    let result = {

      available:
        true,

      deliveryCharge:
        0,

      minimumOrder:
        99

    };


    if (
      window.AgarwalDeliveryAreaConfig
    ) {

      result =
        window.AgarwalDeliveryAreaConfig
          .check(
            address
          );

    }


    if (
      !result.available
    ) {

      resultElement.className =
        "checkout-delivery-result error";


      resultElement.textContent =
        result.message;


      return {

        valid:
          false,

        message:
          result.message

      };

    }


    resultElement.className =
      "checkout-delivery-result success";


    resultElement.textContent =
      "✓ Delivery available in Benta";


    return {

      ...address,

      valid:
        true,

      deliveryCharge:
        result.deliveryCharge || 0

    };

  },


  /* -------------------------------------------------------
     BUILD CUSTOMER DATA
     ------------------------------------------------------- */

  getCustomer() {

    return {

      name:

        document.getElementById(
          "checkoutName"
        )?.value.trim() || "",

      phone:

        document.getElementById(
          "checkoutPhone"
        )?.value.trim() || ""

    };

  },


  /* -------------------------------------------------------
     BUILD ADDRESS DATA
     ------------------------------------------------------- */

  getAddress() {

    return {

      fullAddress:

        document.getElementById(
          "checkoutAddress"
        )?.value.trim() || "",

      area:
        "Benta",

      city:
        "Darbhanga",

      pincode:
        "846003"

    };

  },


  /* -------------------------------------------------------
     SHOW ERROR
     ------------------------------------------------------- */

  showError(
    message
  ) {

    const element =
      document.getElementById(
        "checkoutError"
      );


    if (!element) {

      return;

    }


    element.textContent =
      message;


    element.hidden =
      false;

  },


  /* -------------------------------------------------------
     HIDE ERROR
     ------------------------------------------------------- */

  hideError() {

    const element =
      document.getElementById(
        "checkoutError"
      );


    if (!element) {

      return;

    }


    element.textContent =
      "";


    element.hidden =
      true;

  },


  /* -------------------------------------------------------
     PLACE ORDER
     ------------------------------------------------------- */

  async placeOrder() {

    this.hideError();


    const cart =
      window.AgarwalCart;


    if (!cart) {

      this.showError(
        "Cart is not ready."
      );

      return;

    }


    if (
      cart.getItemCount() ===
      0
    ) {

      this.showError(
        "Your cart is empty."
      );

      return;

    }


    if (
      !cart.meetsMinimumOrder()
    ) {

      this.showError(

        cart.getMinimumOrderMessage()

      );

      return;

    }


    const customer =
      this.validateCustomer();


    if (
      !customer.valid
    ) {

      this.showError(
        customer.message
      );

      return;

    }


    const address =
      this.checkDelivery();


    if (
      !address.valid
    ) {

      this.showError(
        address.message
      );

      return;

    }


    const order = {

      customer: {

        name:
          customer.name,

        phone:
          customer.phone

      },


      deliveryAddress: {

        fullAddress:
          address.fullAddress,

        area:
          address.area,

        city:
          address.city,

        pincode:
          address.pincode,

        latitude:
          0,

        longitude:
          0

      },


      items:
        cart.getItems(),


      total:
        cart.getTotal(),


      paymentMethod:
        "cash_on_delivery",


      paymentStatus:
        "pending",


      orderStatus:
        "new",


      whatsappSent:
        false

    };


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:checkout-ready",
        {
          detail: {

            order

          }

        }
      )

    );


    return order;

  },


  /* -------------------------------------------------------
     BIND EVENTS
     ------------------------------------------------------- */

  bindEvents() {

    const button =
      document.getElementById(
        "placeOrderButton"
      );


    if (button) {

      button.addEventListener(

        "click",

        async () => {

          button.disabled =
            true;


          button.textContent =
            "Checking...";


          try {

            const order =
              await this.placeOrder();


            if (order) {

              window.AgarwalCheckout =
                {

                  order

                };


              button.textContent =
                "Order Ready ✓";

            } else {

              button.disabled =
                false;

              button.textContent =
                "Place Order";

            }

          } catch (error) {

            console.error(
              "Checkout error:",
              error
            );


            this.showError(

              error.message ||

              "Unable to continue."

            );


            button.disabled =
              false;

            button.textContent =
              "Place Order";

          }

        }

      );

    }


    [

      "checkoutName",

      "checkoutPhone",

      "checkoutAddress",

      "checkoutArea",

      "checkoutPincode"

    ].forEach(

      id => {

        document
          .getElementById(
            id
          )
          ?.addEventListener(

            "input",

            () => {

              this.hideError();

            }

          );

      }

    );

  },


  /* -------------------------------------------------------
     OPEN
     ------------------------------------------------------- */

  open() {

    this.createSection();


    this.renderSummary();


    const section =
      document.getElementById(
        "agarwalCheckoutSection"
      );


    section?.scrollIntoView({

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
        "agarwalCheckoutStyles"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "agarwalCheckoutStyles";


    style.textContent = `

      #agarwalCheckoutSection {

        margin-top:
          30px;

      }


      .checkout-card {

        display:
          flex;

        flex-direction:
          column;

        gap:
          14px;

        max-width:
          760px;

        padding:
          16px;

        border:
          1px solid #e1e9e4;

        border-radius:
          20px;

        background:
          white;

        box-shadow:
          0 8px 28px
          rgba(18,61,43,.06);

      }


      .checkout-step {

        padding:
          15px;

        border:
          1px solid #e6ece8;

        border-radius:
          16px;

        background:
          #fbfcfb;

      }


      .checkout-step-title {

        display:
          flex;

        align-items:
          center;

        gap:
          9px;

        margin-bottom:
          14px;

        color:
          #173126;

      }


      .checkout-step-title span {

        width:
          27px;

        height:
          27px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          50%;

        background:
          #123D2B;

        color:
          white;

        font-size:
          12px;

        font-weight:
          900;

      }


      .checkout-step label {

        display:
          block;

        margin-top:
          12px;

        font-size:
          12px;

        font-weight:
          700;

        color:
          #52665c;

      }


      .checkout-step input {

        width:
          100%;

        height:
          45px;

        margin-top:
          6px;

        padding:
          0 12px;

        border:
          1px solid #d8e3dc;

        border-radius:
          11px;

        outline:
          none;

        background:
          white;

        color:
          #173126;

      }


      .checkout-step input:focus {

        border-color:
          #123D2B;

      }


      .checkout-two {

        display:
          grid;

        grid-template-columns:
          1fr 1fr;

        gap:
          10px;

      }


      .checkout-delivery-result {

        margin-top:
          12px;

        padding:
          10px;

        border-radius:
          10px;

        font-size:
          12px;

        font-weight:
          700;

      }


      .checkout-delivery-result.success {

        background:
          #edf6ef;

        color:
          #23633f;

      }


      .checkout-delivery-result.error {

        background:
          #fff1ed;

        color:
          #8a4938;

      }


      .checkout-summary-list {

        display:
          flex;

        flex-direction:
          column;

        gap:
          8px;

      }


      .checkout-summary-item,
      .checkout-total-row,
      .checkout-grand-total {

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          12px;

      }


      .checkout-summary-item {

        font-size:
          12px;

        color:
          #596b62;

      }


      .checkout-summary-item strong {

        color:
          #173126;

      }


      .checkout-total-row {

        margin-top:
          10px;

        padding-top:
          10px;

        border-top:
          1px solid #e7ece9;

        font-size:
          13px;

      }


      .checkout-grand-total {

        margin-top:
          10px;

        padding-top:
          13px;

        border-top:
          1px solid #dce5df;

        color:
          #123D2B;

        font-size:
          17px;

      }


      .checkout-payment {

        margin-top:
          13px;

        padding:
          10px;

        border-radius:
          10px;

        background:
          #edf4ef;

        color:
          #123D2B;

        font-size:
          12px;

        font-weight:
          800;

      }


      .checkout-error {

        padding:
          11px;

        border-radius:
          11px;

        background:
          #fff1ed;

        color:
          #8a4938;

        font-size:
          12px;

        font-weight:
          700;

      }


      .place-order-button {

        width:
          100%;

        min-height:
          48px;

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
          900;

      }


      .place-order-button:disabled {

        opacity:
          .65;

      }


      .checkout-empty {

        padding:
          12px;

        text-align:
          center;

        color:
          #718179;

        font-size:
          13px;

      }

    `;


    document.head.appendChild(
      style
    );

  }

};


/* =========================================================
   PUBLIC CHECKOUT API
   ========================================================= */

window.AgarwalCheckoutUI =
  AgarwalCheckoutUI;


/* =========================================================
   CHECKOUT EVENT
   ========================================================= */

window.addEventListener(

  "agarwal:open-checkout",

  () => {

    AgarwalCheckoutUI
      .open();

  }

);


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:checkout-ui-ready"
  )

);
