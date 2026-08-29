/* =========================================================
   AGARWAL STORE
   CODE 70 — CHECKOUT → ORDER → FIRESTORE INTEGRATION
   ========================================================= */


(function () {

  "use strict";


  /* =======================================================
     HELPERS
     ======================================================= */

  function showMessage(
    message
  ) {

    if (
      window.AgarwalStoreUI
        ?.showMessage
    ) {

      window.AgarwalStoreUI
        .showMessage(
          message
        );

      return;

    }


    alert(
      message
    );

  }


  /* =======================================================
     DISABLE BUTTON
     ======================================================= */

  function setButtonState(
    loading
  ) {

    const button =
      document.getElementById(
        "placeOrderButton"
      );


    if (!button) {

      return;

    }


    button.disabled =
      loading;


    button.textContent =

      loading

        ? "Placing Order..."

        : "Place Order";

  }


  /* =======================================================
     SHOW ORDER SUCCESS
     ======================================================= */

  function showSuccess(
    order
  ) {

    const section =
      document.getElementById(
        "agarwalCheckoutSection"
      );


    if (!section) {

      return;

    }


    const orderNumber =
      order?.orderNumber ||
      order?.id ||
      "Order";


    section.innerHTML = `

      <div class="order-success-card">

        <div class="order-success-icon">
          ✓
        </div>


        <h2>
          Order Placed Successfully!
        </h2>


        <p>
          Thank you for shopping with
          Agarwal Store.
        </p>


        <div class="order-number-box">

          <span>
            Order Number
          </span>

          <strong>
            ${escapeHTML(
              orderNumber
            )}
          </strong>

        </div>


        <div class="order-success-details">

          <div>

            <span>
              Total
            </span>

            <strong>
              ₹${Number(
                order?.total || 0
              ).toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          <div>

            <span>
              Payment
            </span>

            <strong>
              Cash on Delivery
            </strong>

          </div>


          <div>

            <span>
              Delivery
            </span>

            <strong>
              Benta, Darbhanga
            </strong>

          </div>

        </div>


        <button
          type="button"
          id="continueShoppingButton"
          class="continue-shopping-button"
        >

          Continue Shopping

        </button>

      </div>

    `;


    document
      .getElementById(
        "continueShoppingButton"
      )
      ?.addEventListener(

        "click",

        () => {

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

        }

      );


    addSuccessStyles();

  }


  /* =======================================================
     ESCAPE HTML
     ======================================================= */

  function escapeHTML(
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

  }


  /* =======================================================
     SUCCESS STYLES
     ======================================================= */

  function addSuccessStyles() {

    if (
      document.getElementById(
        "agarwalOrderSuccessStyles"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "agarwalOrderSuccessStyles";


    style.textContent = `

      .order-success-card {

        max-width:
          620px;

        margin:
          10px auto;

        padding:
          30px 20px;

        text-align:
          center;

        border:
          1px solid #dce8df;

        border-radius:
          24px;

        background:
          white;

        box-shadow:
          0 12px 35px
          rgba(18,61,43,.08);

      }


      .order-success-icon {

        width:
          62px;

        height:
          62px;

        margin:
          0 auto 15px;

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
          32px;

        font-weight:
          900;

      }


      .order-success-card h2 {

        margin:
          0 0 8px;

        color:
          #173126;

        font-size:
          23px;

      }


      .order-success-card p {

        margin:
          0 0 20px;

        color:
          #718179;

        font-size:
          13px;

      }


      .order-number-box {

        padding:
          15px;

        border-radius:
          14px;

        background:
          #edf4ef;

      }


      .order-number-box span {

        display:
          block;

        margin-bottom:
          5px;

        color:
          #718179;

        font-size:
          11px;

      }


      .order-number-box strong {

        color:
          #123D2B;

        font-size:
          20px;

      }


      .order-success-details {

        margin-top:
          15px;

        padding:
          14px;

        border:
          1px solid #e4ebe6;

        border-radius:
          14px;

      }


      .order-success-details div {

        display:
          flex;

        justify-content:
          space-between;

        gap:
          12px;

        padding:
          8px 0;

        border-bottom:
          1px solid #edf0ee;

        font-size:
          12px;

      }


      .order-success-details div:last-child {

        border-bottom:
          0;

      }


      .order-success-details span {

        color:
          #718179;

      }


      .order-success-details strong {

        color:
          #173126;

      }


      .continue-shopping-button {

        width:
          100%;

        min-height:
          46px;

        margin-top:
          18px;

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

    `;


    document.head.appendChild(
      style
    );

  }


  /* =======================================================
     PLACE ORDER
     ======================================================= */

  async function placeOrder() {

    if (
      !window.AgarwalOrderCreate
    ) {

      showMessage(
        "Order system is not ready."
      );

      return;

    }


    if (
      !window.AgarwalCheckoutUI
    ) {

      showMessage(
        "Checkout system is not ready."
      );

      return;

    }


    setButtonState(
      true
    );


    try {

      /*
       * First validate and prepare
       * checkout information.
       */

      const checkoutOrder =

        await window
          .AgarwalCheckoutUI
          .placeOrder();


      if (!checkoutOrder) {

        setButtonState(
          false
        );

        return;

      }


      /*
       * Create + save the order
       * in Firestore.
       */

      const savedOrder =

        await window
          .AgarwalOrderCreate
          .createAndSave(
            checkoutOrder
          );


      /*
       * Save locally for the
       * success/order screen.
       */

      window.AgarwalLastOrder =
        savedOrder;


      /*
       * Clear cart only after
       * successful Firestore save.
       */

      window.AgarwalCart
        ?.clear();


      /*
       * Show success screen.
       */

      showSuccess(
        savedOrder
      );


      /*
       * Notify other modules.
       */

      window.dispatchEvent(

        new CustomEvent(
          "agarwal:order-success",
          {
            detail: {

              order:
                savedOrder

            }

          }
        )

      );


    } catch (error) {

      console.error(
        "Order placement failed:",
        error
      );


      setButtonState(
        false
      );


      showMessage(

        error?.message ||

        "Order could not be placed. Please try again."

      );

    }

  }


  /* =======================================================
     CONNECT CHECKOUT BUTTON
     ======================================================= */

  function connect() {

    const button =
      document.getElementById(
        "placeOrderButton"
      );


    if (!button) {

      return;

    }


    if (
      button.dataset
        .orderIntegrationReady ===
      "true"
    ) {

      return;

    }


    button.dataset
      .orderIntegrationReady =
      "true";


    button.addEventListener(

      "click",

      placeOrder

    );

  }


  /* =======================================================
     WATCH FOR CHECKOUT UI
     ======================================================= */

  function start() {

    connect();


    const observer =
      new MutationObserver(

        () => {

          connect();

        }

      );


    observer.observe(

      document.body,

      {

        childList:
          true,

        subtree:
          true

      }

    );

  }


  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.AgarwalOrderCheckout =
    {

      placeOrder,

      connect,

      showSuccess

    };


  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(

      "DOMContentLoaded",

      start,

      {
        once: true
      }

    );

  } else {

    start();

  }


  /* =======================================================
     READY
     ======================================================= */

  window.dispatchEvent(

    new CustomEvent(
      "agarwal:order-checkout-ready"
    )

  );


})();
