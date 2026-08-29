/* =========================================================
   AGARWAL STORE
   CODE 72 — ORDER HISTORY UI
   ========================================================= */


const AgarwalOrderHistoryUI = {


  /* -------------------------------------------------------
     HELPERS
     ------------------------------------------------------- */

  money(value) {

    return (
      "₹" +
      Number(
        value || 0
      ).toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 2
        }
      )
    );

  },


  escape(value) {

    return String(
      value ?? ""
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  },


  statusLabel(status) {

    const labels = {

      new:
        "Order Received",

      confirmed:
        "Confirmed",

      packing:
        "Packing",

      out_for_delivery:
        "Out for Delivery",

      delivered:
        "Delivered",

      cancelled:
        "Cancelled"

    };


    return (
      labels[status] ||
      "Order Received"
    );

  },


  /* -------------------------------------------------------
     CREATE SECTION
     ------------------------------------------------------- */

  createSection() {

    if (
      document.getElementById(
        "agarwalOrderHistorySection"
      )
    ) {

      return;

    }


    const main =
      document.querySelector(
        "main"
      );


    if (!main) {

      return;

    }


    const section =
      document.createElement(
        "section"
      );


    section.id =
      "agarwalOrderHistorySection";


    section.innerHTML = `

      <div class="heading">

        <h2>
          My Orders
        </h2>

        <span>
          Order History
        </span>

      </div>


      <div
        id="agarwalOrderHistoryContainer"
      >
      </div>

    `;


    main.appendChild(
      section
    );


    this.addStyles();

  },


  /* -------------------------------------------------------
     RENDER EMPTY
     ------------------------------------------------------- */

  renderEmpty() {

    const container =
      document.getElementById(
        "agarwalOrderHistoryContainer"
      );


    if (!container) {

      return;

    }


    container.innerHTML = `

      <div class="order-history-empty">

        <div>
          📦
        </div>

        <h3>
          No orders yet
        </h3>

        <p>
          Your completed orders will appear here.
        </p>

      </div>

    `;

  },


  /* -------------------------------------------------------
     CREATE ORDER CARD
     ------------------------------------------------------- */

  createCard(order) {

    const orderNumber =
      this.escape(
        order.orderNumber ||
        order.id ||
        "Order"
      );


    const status =
      order.orderStatus ||
      order.status ||
      "new";


    const customer =
      order.customer ||
      {};


    const address =
      order.deliveryAddress ||
      {};


    const items =
      Array.isArray(
        order.items
      )
        ? order.items
        : [];


    const itemCount =
      items.reduce(

        (
          total,
          item
        ) =>

          total +
          Number(
            item.quantity ||
            0
          ),

        0

      );


    const date =

      order.createdAt

        ? new Date(
            order.createdAt
          ).toLocaleString(
            "en-IN",
            {
              dateStyle:
                "medium",
              timeStyle:
                "short"
            }
          )

        : "";


    return `

      <article
        class="order-history-card"
        data-order-id="${
          this.escape(
            order.id || ""
          )
        }"
      >

        <div class="order-history-top">

          <div>

            <small>
              ORDER
            </small>

            <strong>
              ${orderNumber}
            </strong>

          </div>


          <span
            class="order-status status-${this.escape(
              status
            )}"
          >

            ${this.statusLabel(
              status
            )}

          </span>

        </div>


        <div class="order-history-info">

          <div>

            <span>
              Items
            </span>

            <strong>
              ${itemCount}
            </strong>

          </div>


          <div>

            <span>
              Total
            </span>

            <strong>
              ${this.money(
                order.total
              )}
            </strong>

          </div>

        </div>


        <div class="order-history-address">

          <span>
            Delivery
          </span>

          <strong>

            ${this.escape(
              address.fullAddress ||
              ""
            )}

            ${
              address.fullAddress
                ? ", "
                : ""
            }

            Benta, Darbhanga

          </strong>

        </div>


        ${
          date

            ? `

              <div class="order-history-date">

                ${this.escape(
                  date
                )}

              </div>

            `

            : ""

        }


        <button
          type="button"
          class="order-view-button"
          data-order-id="${
            this.escape(
              order.id ||
              ""
            )
          }"
        >

          View Order

        </button>

      </article>

    `;

  },


  /* -------------------------------------------------------
     RENDER
     ------------------------------------------------------- */

  render(
    orders = []
  ) {

    this.createSection();


    const container =
      document.getElementById(
        "agarwalOrderHistoryContainer"
      );


    if (!container) {

      return false;

    }


    if (
      !Array.isArray(
        orders
      ) ||
      orders.length === 0
    ) {

      this.renderEmpty();

      return true;

    }


    container.innerHTML =

      orders
        .map(
          order =>
            this.createCard(
              order
            )
        )
        .join("");


    this.bindEvents();


    return true;

  },


  /* -------------------------------------------------------
     LOAD ORDERS
     ------------------------------------------------------- */

  async load(
    phone
  ) {

    if (!phone) {

      this.renderEmpty();

      return [];

    }


    /*
     * Use existing order history
     * module when available.
     */

    if (
      window.AgarwalOrderHistory
        ?.getByPhone
    ) {

      try {

        const orders =

          await window
            .AgarwalOrderHistory
            .getByPhone(
              phone
            );


        this.render(
          orders
        );


        return orders;

      } catch (error) {

        console.error(
          "Order history loading failed:",
          error
        );

      }

    }


    this.renderEmpty();

    return [];

  },


  /* -------------------------------------------------------
     VIEW ORDER
     ------------------------------------------------------- */

  viewOrder(
    orderId
  ) {

    if (!orderId) {

      return;

    }


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:view-order",
        {
          detail: {

            orderId

          }

        }
      )

    );

  },


  /* -------------------------------------------------------
     BUTTON EVENTS
     ------------------------------------------------------- */

  bindEvents() {

    document
      .querySelectorAll(
        ".order-view-button"
      )
      .forEach(

        button => {

          button.addEventListener(

            "click",

            () => {

              this.viewOrder(

                button.dataset
                  .orderId

              );

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


    const section =
      document.getElementById(
        "agarwalOrderHistorySection"
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
        "agarwalOrderHistoryStyles"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "agarwalOrderHistoryStyles";


    style.textContent = `

      #agarwalOrderHistorySection {

        margin-top:
          30px;

      }


      #agarwalOrderHistoryContainer {

        display:
          flex;

        flex-direction:
          column;

        gap:
          12px;

      }


      .order-history-card {

        padding:
          16px;

        border:
          1px solid #e1e9e4;

        border-radius:
          18px;

        background:
          white;

        box-shadow:
          0 7px 22px
          rgba(18,61,43,.05);

      }


      .order-history-top {

        display:
          flex;

        align-items:
          flex-start;

        justify-content:
          space-between;

        gap:
          12px;

      }


      .order-history-top small {

        display:
          block;

        margin-bottom:
          3px;

        font-size:
          9px;

        color:
          #8a9890;

        font-weight:
          800;

        letter-spacing:
          1px;

      }


      .order-history-top strong {

        color:
          #123D2B;

        font-size:
          15px;

      }


      .order-status {

        padding:
          6px 9px;

        border-radius:
          20px;

        background:
          #edf4ef;

        color:
          #23633f;

        font-size:
          10px;

        font-weight:
          800;

        white-space:
          nowrap;

      }


      .status-cancelled {

        background:
          #fff1ed;

        color:
          #8a4938;

      }


      .status-delivered {

        background:
          #edf6ef;

        color:
          #23633f;

      }


      .order-history-info {

        display:
          grid;

        grid-template-columns:
          1fr 1fr;

        gap:
          10px;

        margin-top:
          15px;

      }


      .order-history-info div {

        padding:
          10px;

        border-radius:
          11px;

        background:
          #f7f9f7;

      }


      .order-history-info span {

        display:
          block;

        font-size:
          10px;

        color:
          #718179;

      }


      .order-history-info strong {

        display:
          block;

        margin-top:
          3px;

        color:
          #173126;

        font-size:
          14px;

      }


      .order-history-address {

        margin-top:
          12px;

        padding:
          10px;

        border-radius:
          11px;

        background:
          #f7f9f7;

      }


      .order-history-address span {

        display:
          block;

        margin-bottom:
          3px;

        font-size:
          10px;

        color:
          #718179;

      }


      .order-history-address strong {

        font-size:
          12px;

        line-height:
          1.5;

        color:
          #173126;

      }


      .order-history-date {

        margin-top:
          9px;

        font-size:
          10px;

        color:
          #8a9890;

      }


      .order-view-button {

        width:
          100%;

        min-height:
          40px;

        margin-top:
          12px;

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


      .order-history-empty {

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


      .order-history-empty div {

        font-size:
          38px;

      }


      .order-history-empty h3 {

        margin:
          10px 0 5px;

        color:
          #173126;

      }


      .order-history-empty p {

        margin:
          0;

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
   PUBLIC API
   ========================================================= */

window.AgarwalOrderHistoryUI =
  AgarwalOrderHistoryUI;


/* =========================================================
   READY
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-history-ui-ready"
  )

);
