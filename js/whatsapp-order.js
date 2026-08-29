/* =========================================================
   AGARWAL STORE
   CODE 50 — WHATSAPP ORDER MESSAGE BUILDER
   ========================================================= */


const AgarwalWhatsAppOrder = {


  /* -------------------------------------------------------
     GET WHATSAPP NUMBER
     ------------------------------------------------------- */

  getNumber() {

    const config =
      window.AgarwalConfig || {};


    return (

      config.contact?.whatsapp ||

      config.contact?.phone ||

      "9229609882"

    );

  },


  /* -------------------------------------------------------
     CLEAN PHONE NUMBER
     ------------------------------------------------------- */

  cleanNumber(
    number
  ) {

    return String(
      number || ""
    )
    .replace(
      /[^0-9]/g,
      ""
    );

  },


  /* -------------------------------------------------------
     FORMAT RUPEES
     ------------------------------------------------------- */

  money(
    amount
  ) {

    const value =
      Number(
        amount || 0
      );


    return (

      "₹" +

      value.toLocaleString(
        "en-IN",
        {
          minimumFractionDigits:
            0,

          maximumFractionDigits:
            2

        }

      )

    );

  },


  /* -------------------------------------------------------
     CREATE PRODUCT LINE
     ------------------------------------------------------- */

  formatItem(
    item,
    index
  ) {

    const quantity =
      Number(
        item?.quantity || 0
      );


    const price =
      Number(
        item?.price || 0
      );


    const subtotal =
      price * quantity;


    let line =

      String(
        index + 1
      ) +

      ". " +

      (
        item?.name ||
        "Product"
      );


    if (
      item?.unit
    ) {

      line +=

        " (" +

        item.unit +

        ")";

    }


    line +=

      "\n   Qty: " +

      quantity +

      " × " +

      this.money(
        price
      ) +

      " = " +

      this.money(
        subtotal
      );


    return line;

  },


  /* -------------------------------------------------------
     FORMAT ADDRESS
     ------------------------------------------------------- */

  formatAddress(
    address
  ) {

    if (!address) {

      return "Not provided";

    }


    const parts = [];


    if (
      address.fullAddress
    ) {

      parts.push(
        address.fullAddress
      );

    }


    if (
      address.area
    ) {

      parts.push(
        address.area
      );

    }


    if (
      address.city
    ) {

      parts.push(
        address.city
      );

    }


    if (
      address.pincode
    ) {

      parts.push(
        address.pincode
      );

    }


    return (

      parts.length > 0

        ? parts.join(
            ", "
          )

        : "Not provided"

    );

  },


  /* -------------------------------------------------------
     CREATE MAP LINK
     ------------------------------------------------------- */

  createMapLink(
    address
  ) {

    const lat =
      Number(
        address?.latitude || 0
      );


    const lng =
      Number(
        address?.longitude || 0
      );


    if (
      !lat ||
      !lng
    ) {

      return "";

    }


    return (

      "https://www.google.com/maps?q=" +

      encodeURIComponent(
        lat + "," + lng
      )

    );

  },


  /* -------------------------------------------------------
     BUILD MESSAGE
     ------------------------------------------------------- */

  buildMessage(
    order
  ) {

    if (!order) {

      throw new Error(
        "Order data is required."
      );

    }


    const orderNumber =
      order.orderNumber ||
      "#PENDING";


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


    const lines = [];


    lines.push(
      "🛒 AGARWAL STORE — NEW ORDER"
    );


    lines.push(
      ""
    );


    lines.push(
      "Order No: " +
      orderNumber
    );


    lines.push(
      ""
    );


    lines.push(
      "👤 CUSTOMER"
    );


    lines.push(

      "Name: " +

      (
        customer.name ||
        "Not provided"
      )

    );


    lines.push(

      "Phone: " +

      (
        customer.phone ||
        "Not provided"
      )

    );


    lines.push(
      ""
    );


    lines.push(
      "📍 DELIVERY ADDRESS"
    );


    lines.push(

      this.formatAddress(
        address
      )

    );


    const mapLink =
      this.createMapLink(
        address
      );


    if (
      mapLink
    ) {

      lines.push(
        "Map: " +
        mapLink
      );

    }


    lines.push(
      ""
    );


    lines.push(
      "📦 ORDER ITEMS"
    );


    if (
      items.length === 0
    ) {

      lines.push(
        "No items"
      );

    } else {

      items.forEach(

        (
          item,
          index
        ) => {

          lines.push(

            this.formatItem(
              item,
              index
            )

          );


          lines.push(
            ""
          );

        }

      );

    }


    lines.push(
      "💰 TOTAL: " +
      this.money(
        order.total
      )
    );


    lines.push(
      ""
    );


    lines.push(
      "💵 PAYMENT: Cash on Delivery"
    );


    if (
      order.notes
    ) {

      lines.push(
        ""
      );


      lines.push(
        "📝 NOTE: " +
        order.notes
      );

    }


    lines.push(
      ""
    );


    lines.push(
      "Thank you for ordering from Agarwal Store."
    );


    return lines.join(
      "\n"
    );

  },


  /* -------------------------------------------------------
     CREATE WHATSAPP URL
     ------------------------------------------------------- */

  createURL(
    message
  ) {

    const number =
      this.cleanNumber(
        this.getNumber()
      );


    if (!number) {

      throw new Error(
        "WhatsApp number is not configured."
      );

    }


    return (

      "https://wa.me/" +

      number +

      "?text=" +

      encodeURIComponent(
        message
      )

    );

  },


  /* -------------------------------------------------------
     BUILD WHATSAPP URL FROM ORDER
     ------------------------------------------------------- */

  buildOrderURL(
    order
  ) {

    const message =
      this.buildMessage(
        order
      );


    return this.createURL(
      message
    );

  },


  /* -------------------------------------------------------
     OPEN WHATSAPP
     ------------------------------------------------------- */

  openOrder(
    order
  ) {

    const url =
      this.buildOrderURL(
        order
      );


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:whatsapp-order-opened",
        {
          detail: {

            order,

            url

          }

        }
      )

    );


    return url;

  }

};


/* =========================================================
   PUBLIC WHATSAPP ORDER API
   ========================================================= */

window.AgarwalWhatsAppOrder =
  AgarwalWhatsAppOrder;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:whatsapp-order-ready"
  )

);
