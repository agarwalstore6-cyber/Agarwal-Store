/* =========================================================
   AGARWAL STORE
   CODE 22 — WHATSAPP ORDER FOUNDATION
   ========================================================= */


const AgarwalWhatsApp = {


  /* -------------------------------------------------------
     STORE WHATSAPP NUMBER
     ------------------------------------------------------- */

  getNumber() {

    return (

      window.AgarwalConfig
        ?.contact
        ?.whatsapp ||

      "9229609882"

    );

  },


  /* -------------------------------------------------------
     CLEAN PHONE NUMBER
     ------------------------------------------------------- */

  cleanNumber(number) {

    return String(
      number || ""
    )
      .replace(
        /[^0-9]/g,
        ""
      );

  },


  /* -------------------------------------------------------
     FORMAT MONEY
     ------------------------------------------------------- */

  money(value) {

    const amount =
      Number(value || 0);


    return (
      "₹" +
      amount.toFixed(2)
    );

  },


  /* -------------------------------------------------------
     CREATE ORDER MESSAGE
     ------------------------------------------------------- */

  createMessage(order) {

    if (!order) {

      throw new Error(
        "Order information is required."
      );

    }


    const items =
      Array.isArray(order.items)
        ? order.items
        : [];


    let message = "";


    message +=
      "🛒 AGARWAL STORE\n";

    message +=
      "━━━━━━━━━━━━━━\n";


    message +=
      "ORDER: " +
      (
        order.orderNumber ||
        "#"
      ) +
      "\n";


    message +=
      "━━━━━━━━━━━━━━\n\n";


    message +=
      "CUSTOMER\n";


    message +=
      "Name: " +
      (
        order.customer?.name ||
        "-"
      ) +
      "\n";


    message +=
      "Phone: " +
      (
        order.customer?.phone ||
        "-"
      ) +
      "\n\n";


    message +=
      "DELIVERY ADDRESS\n";


    message +=
      (
        order.delivery?.address ||

        this.formatAddress(
          order.delivery
        ) ||

        "-"
      ) +
      "\n\n";


    message +=
      "ITEMS\n";


    message +=
      "━━━━━━━━━━━━━━\n";


    items.forEach(
      (
        item,
        index
      ) => {

        message +=

          (
            index + 1
          ) +

          ". " +

          (
            item.name ||
            "Product"
          ) +

          "\n";


        if (
          item.size ||
          item.unit
        ) {

          message +=

            "   Size: " +

            (
              item.size ||
              "-"
            ) +

            (
              item.unit
                ? " " +
                  item.unit
                : ""
            ) +

            "\n";

        }


        message +=

          "   Qty: " +

          (
            item.quantity ||
            1
          ) +

          " × " +

          this.money(
            item.price
          ) +

          " = " +

          this.money(
            item.itemTotal ??
            (
              Number(
                item.price || 0
              ) *

              Number(
                item.quantity || 1
              )
            )
          ) +

          "\n\n";

      }
    );


    message +=
      "━━━━━━━━━━━━━━\n";


    message +=
      "TOTAL: " +
      this.money(
        order.total
      ) +
      "\n";


    message +=
      "Payment: Cash on Delivery\n";


    message +=
      "Delivery: Free\n";


    message +=
      "━━━━━━━━━━━━━━\n";


    message +=
      "Please confirm this order.";

    
    return message;

  },


  /* -------------------------------------------------------
     FORMAT ADDRESS
     ------------------------------------------------------- */

  formatAddress(
    delivery
  ) {

    if (!delivery) {

      return "";

    }


    return [

      delivery.house,

      delivery.area,

      delivery.landmark,

      delivery.city,

      delivery.pincode

    ]

      .filter(
        value =>
          value &&
          String(value).trim()
      )

      .join(", ");

  },


  /* -------------------------------------------------------
     CREATE WHATSAPP URL
     ------------------------------------------------------- */

  createURL(order) {

    const number =
      this.cleanNumber(
        this.getNumber()
      );


    const message =
      this.createMessage(
        order
      );


    return (

      "https://wa.me/" +

      (
        number.startsWith("91")
          ? number
          : "91" + number
      ) +

      "?text=" +

      encodeURIComponent(
        message
      )

    );

  },


  /* -------------------------------------------------------
     OPEN WHATSAPP
     ------------------------------------------------------- */

  open(order) {

    const url =
      this.createURL(
        order
      );


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );


    return url;

  },


  /* -------------------------------------------------------
     COPY MESSAGE
     ------------------------------------------------------- */

  async copyMessage(order) {

    const message =
      this.createMessage(
        order
      );


    if (
      navigator.clipboard
    ) {

      await navigator
        .clipboard
        .writeText(
          message
        );

      return true;

    }


    return false;

  }

};


/* =========================================================
   PUBLIC WHATSAPP API
   ========================================================= */

window.AgarwalWhatsApp =
  AgarwalWhatsApp;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:whatsapp-ready"
  )

);
