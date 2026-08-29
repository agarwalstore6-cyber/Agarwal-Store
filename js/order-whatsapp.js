/* =========================================================
   AGARWAL STORE
   CODE 71 — ORDER WHATSAPP
   ========================================================= */


const AgarwalOrderWhatsApp = {


  /* -------------------------------------------------------
     STORE WHATSAPP NUMBER
     ------------------------------------------------------- */

  phone:
    "919229609882",


  /* -------------------------------------------------------
     ESCAPE / TEXT CLEANUP
     ------------------------------------------------------- */

  text(
    value
  ) {

    return String(
      value ?? ""
    ).trim();

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
     CREATE MESSAGE
     ------------------------------------------------------- */

  createMessage(
    order
  ) {

    if (!order) {

      return "";

    }


    const customer =
      order.customer || {};


    const address =
      order.deliveryAddress ||
      {};


    const items =
      Array.isArray(
        order.items
      )
        ? order.items
        : [];


    let message =

      `*AGARWAL STORE — NEW ORDER*\n\n` +

      `Order No: ${this.text(
        order.orderNumber ||
        order.id
      )}\n\n` +

      `*Customer Details*\n` +

      `Name: ${this.text(
        customer.name
      )}\n` +

      `Mobile: ${this.text(
        customer.phone
      )}\n\n` +

      `*Delivery Address*\n` +

      `${this.text(
        address.fullAddress
      )}\n` +

      `Benta, Darbhanga\n` +

      `PIN: ${this.text(
        address.pincode ||
        "846003"
      )}\n\n` +

      `*Items*\n`;


    items.forEach(

      (item, index) => {

        const name =
          this.text(
            item.name ||
            "Product"
          );


        const quantity =
          Number(
            item.quantity ||
            1
          );


        const price =
          Number(
            item.price ||
            0
          );


        const subtotal =
          price *
          quantity;


        message +=

          `${index + 1}. ` +

          `${name} × ${quantity} — ` +

          `${this.money(
            subtotal
          )}\n`;

      }

    );


    message +=

      `\n*Order Summary*\n` +

      `Total: ${this.money(
        order.total
      )}\n` +

      `Payment: Cash on Delivery\n` +

      `Delivery: FREE\n\n` +

      `Thank you for shopping with Agarwal Store. 🙏`;


    return message;

  },


  /* -------------------------------------------------------
     CREATE WHATSAPP URL
     ------------------------------------------------------- */

  createURL(
    order
  ) {

    const message =
      this.createMessage(
        order
      );


    if (!message) {

      return "";

    }


    return (

      "https://wa.me/" +

      this.phone +

      "?text=" +

      encodeURIComponent(
        message
      )

    );

  },


  /* -------------------------------------------------------
     OPEN WHATSAPP
     ------------------------------------------------------- */

  open(
    order
  ) {

    const url =
      this.createURL(
        order
      );


    if (!url) {

      return false;

    }


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );


    return true;

  },


  /* -------------------------------------------------------
     SEND LAST ORDER
     ------------------------------------------------------- */

  sendLastOrder() {

    const order =
      window.AgarwalLastOrder;


    if (!order) {

      return false;

    }


    return this.open(
      order
    );

  }

};


/* =========================================================
   PUBLIC API
   ========================================================= */

window.AgarwalOrderWhatsApp =
  AgarwalOrderWhatsApp;


/* =========================================================
   ADD WHATSAPP BUTTON AFTER ORDER SUCCESS
   ========================================================= */

window.addEventListener(

  "agarwal:order-success",

  event => {

    const order =
      event.detail
        ?.order;


    if (!order) {

      return;

    }


    const card =
      document.querySelector(
        ".order-success-card"
      );


    if (!card) {

      return;

    }


    if (
      card.querySelector(
        "#sendOrderWhatsApp"
      )
    ) {

      return;

    }


    const button =
      document.createElement(
        "button"
      );


    button.id =
      "sendOrderWhatsApp";


    button.type =
      "button";


    button.className =
      "continue-shopping-button";


    button.style.marginTop =
      "10px";


    button.textContent =
      "Send Order on WhatsApp";


    button.addEventListener(

      "click",

      () => {

        AgarwalOrderWhatsApp
          .open(
            order
          );

      }

    );


    card.appendChild(
      button
    );

  }

);


/* =========================================================
   READY
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-whatsapp-ready"
  )

);
