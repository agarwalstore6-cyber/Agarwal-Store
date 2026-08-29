/* =========================================================
   AGARWAL STORE
   CODE 52 — ORDER MESSAGE FORMATTER
   ========================================================= */


const AgarwalOrderMessageFormat = {


  /* -------------------------------------------------------
     MONEY
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
          maximumFractionDigits:
            2
        }
      )

    );

  },


  /* -------------------------------------------------------
     CLEAN TEXT
     ------------------------------------------------------- */

  text(
    value,
    fallback = ""
  ) {

    const result =
      String(
        value ?? ""
      ).trim();


    return result ||
      fallback;

  },


  /* -------------------------------------------------------
     PRODUCT LINE
     ------------------------------------------------------- */

  productLine(
    item,
    index
  ) {

    const name =
      this.text(
        item?.name,
        "Product"
      );


    const unit =
      this.text(
        item?.unit
      );


    const quantity =
      Math.max(
        0,
        Number(
          item?.quantity || 0
        )
      );


    const price =
      Math.max(
        0,
        Number(
          item?.price || 0
        )
      );


    const subtotal =
      quantity *
      price;


    let line =

      `${index + 1}. ${name}`;


    if (unit) {

      line +=
        ` (${unit})`;

    }


    line +=

      ` — ${quantity} × ${this.money(price)} = ${this.money(subtotal)}`;


    return line;

  },


  /* -------------------------------------------------------
     CUSTOMER SECTION
     ------------------------------------------------------- */

  customerSection(
    customer
  ) {

    const name =
      this.text(
        customer?.name,
        "Not provided"
      );


    const phone =
      this.text(
        customer?.phone,
        "Not provided"
      );


    return [

      "👤 CUSTOMER",

      `Name: ${name}`,

      `Phone: ${phone}`

    ];

  },


  /* -------------------------------------------------------
     ADDRESS SECTION
     ------------------------------------------------------- */

  addressSection(
    address
  ) {

    const lines = [

      "📍 DELIVERY ADDRESS"

    ];


    const fullAddress =
      this.text(
        address?.fullAddress
      );


    const area =
      this.text(
        address?.area
      );


    const city =
      this.text(
        address?.city,
        "Darbhanga"
      );


    const pincode =
      this.text(
        address?.pincode,
        "846003"
      );


    if (fullAddress) {

      lines.push(
        fullAddress
      );

    }


    if (area) {

      lines.push(
        area
      );

    }


    lines.push(

      `${city} - ${pincode}`

    );


    const lat =
      Number(
        address?.latitude
      );


    const lng =
      Number(
        address?.longitude
      );


    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat !== 0 &&
      lng !== 0
    ) {

      lines.push(

        "🗺️ Map: " +

        "https://www.google.com/maps?q=" +

        encodeURIComponent(
          `${lat},${lng}`
        )

      );

    }


    return lines;

  },


  /* -------------------------------------------------------
     ITEMS SECTION
     ------------------------------------------------------- */

  itemsSection(
    items
  ) {

    const lines = [

      "📦 ORDER ITEMS"

    ];


    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      lines.push(
        "No products."
      );


      return lines;

    }


    items.forEach(

      (
        item,
        index
      ) => {

        lines.push(

          this.productLine(
            item,
            index
          )

        );

      }

    );


    return lines;

  },


  /* -------------------------------------------------------
     COMPLETE MESSAGE
     ------------------------------------------------------- */

  build(
    order
  ) {

    if (!order) {

      throw new Error(
        "Order data is required."
      );

    }


    const orderNumber =
      this.text(
        order?.orderNumber,
        "#PENDING"
      );


    const customer =
      order?.customer ||
      {};


    const address =
      order?.deliveryAddress ||
      {};


    const items =
      Array.isArray(
        order?.items
      )
        ? order.items
        : [];


    const total =
      Number(
        order?.total || 0
      );


    const lines = [

      "🛒 AGARWAL STORE",

      "━━━━━━━━━━━━━━━━",

      `🔖 ORDER: ${orderNumber}`,

      ""

    ];


    lines.push(

      ...this.customerSection(
        customer
      )

    );


    lines.push("");


    lines.push(

      ...this.addressSection(
        address
      )

    );


    lines.push("");


    lines.push(

      ...this.itemsSection(
        items
      )

    );


    lines.push("");


    lines.push(
      "━━━━━━━━━━━━━━━━"
    );


    lines.push(

      `💰 TOTAL: ${this.money(total)}`

    );


    lines.push(

      "💵 PAYMENT: Cash on Delivery"

    );


    if (
      this.text(
        order?.notes
      )
    ) {

      lines.push("");


      lines.push(

        `📝 NOTE: ${this.text(order.notes)}`

      );

    }


    lines.push("");


    lines.push(
      "Thank you for ordering from Agarwal Store. ❤️"
    );


    return lines.join(
      "\n"
    );

  },


  /* -------------------------------------------------------
     PREPARE WHATSAPP URL
     ------------------------------------------------------- */

  createURL(
    order,
    whatsappNumber
  ) {

    const number =
      String(
        whatsappNumber || ""
      )
      .replace(
        /[^0-9]/g,
        ""
      );


    if (!number) {

      throw new Error(
        "WhatsApp number is missing."
      );

    }


    const message =
      this.build(
        order
      );


    return (

      "https://wa.me/" +

      number +

      "?text=" +

      encodeURIComponent(
        message
      )

    );

  }

};


/* =========================================================
   PUBLIC API
   ========================================================= */

window.AgarwalOrderMessageFormat =
  AgarwalOrderMessageFormat;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-message-format-ready"
  )

);
