/* =========================================================
   AGARWAL STORE
   CODE 21 — ORDER DATA FOUNDATION
   ========================================================= */

const AgarwalOrderData = {


  /* -------------------------------------------------------
     CREATE ORDER
     ------------------------------------------------------- */

  create(data = {}) {

    const items =
      Array.isArray(data.items)
        ? data.items.map(
            item => this.createItem(item)
          )
        : [];


    return {

      orderNumber:
        data.orderNumber ||
        "",

      customer: {

        uid:
          data.customer?.uid ||
          "",

        name:
          data.customer?.name ||
          "",

        phone:
          data.customer?.phone ||
          ""

      },


      delivery: {

        address:
          data.delivery?.address ||
          "",

        house:
          data.delivery?.house ||
          "",

        area:
          data.delivery?.area ||
          "",

        landmark:
          data.delivery?.landmark ||
          "",

        city:
          data.delivery?.city ||
          "Darbhanga",

        pincode:
          data.delivery?.pincode ||
          "846003",

        location: {

          lat:
            this.number(
              data.delivery?.location?.lat
            ),

          lng:
            this.number(
              data.delivery?.location?.lng
            )

        }

      },


      items:


        items,


      subtotal:
        this.number(
          data.subtotal
        ),


      deliveryCharge:
        0,


      total:
        this.number(
          data.total
        ),


      paymentMethod:
        "Cash on Delivery",


      status:
        data.status ||
        "new",


      createdAt:
        data.createdAt ||
        null,


      updatedAt:
        data.updatedAt ||
        null

    };

  },


  /* -------------------------------------------------------
     CREATE ORDER ITEM
     ------------------------------------------------------- */

  createItem(item = {}) {

    const quantity =
      Math.max(
        1,
        this.number(
          item.quantity
        )
      );


    const price =
      this.number(
        item.price
      );


    const mrp =
      this.number(
        item.mrp
      );


    return {

      productId:
        item.productId ||
        "",

      name:
        item.name ||
        "",

      image:
        item.image ||
        "",

      size:
        item.size ||
        "",

      unit:
        item.unit ||
        "",

      mrp:
        mrp,

      price:
        price,

      quantity:
        quantity,

      itemTotal:
        price *
        quantity

    };

  },


  /* -------------------------------------------------------
     NUMBER CONVERSION
     ------------------------------------------------------- */

  number(value) {

    const number =
      Number(value);


    if (
      !Number.isFinite(number)
    ) {

      return 0;

    }


    return number;

  },


  /* -------------------------------------------------------
     CALCULATE SUBTOTAL
     ------------------------------------------------------- */

  calculateSubtotal(
    items = []
  ) {

    return items.reduce(

      (
        total,
        item
      ) => {

        return (

          total +

          (
            this.number(
              item.price
            ) *

            Math.max(
              1,
              this.number(
                item.quantity
              )
            )

          )

        );

      },

      0

    );

  },


  /* -------------------------------------------------------
     CALCULATE TOTAL
     ------------------------------------------------------- */

  calculateTotal(
    items = []
  ) {

    return this.calculateSubtotal(
      items
    );

  },


  /* -------------------------------------------------------
     FORMAT MONEY
     ------------------------------------------------------- */

  money(value) {

    return (

      "₹" +

      this.number(
        value
      ).toFixed(2)

    );

  },


  /* -------------------------------------------------------
     FORMAT ORDER NUMBER
     ------------------------------------------------------- */

  formatOrderNumber(
    number
  ) {

    return (
      "#" +
      String(number)
    );

  },


  /* -------------------------------------------------------
     VALIDATE ORDER
     ------------------------------------------------------- */

  validate(order) {

    const errors = [];


    if (
      !order?.orderNumber
    ) {

      errors.push(
        "Order number is required."
      );

    }


    if (
      !order?.customer?.name
    ) {

      errors.push(
        "Customer name is required."
      );

    }


    if (
      !order?.customer?.phone
    ) {

      errors.push(
        "Customer phone is required."
      );

    }


    if (
      !Array.isArray(
        order?.items
      ) ||
      order.items.length === 0
    ) {

      errors.push(
        "Order must contain at least one product."
      );

    }


    if (
      order?.total <= 0
    ) {

      errors.push(
        "Order total must be greater than zero."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     ORDER STATUS
     ------------------------------------------------------- */

  isOpen(order) {

    return (

      order?.status !==
        "delivered" &&

      order?.status !==
        "cancelled"

    );

  },


  /* -------------------------------------------------------
     STATUS LABEL
     ------------------------------------------------------- */

  statusLabel(status) {

    const labels = {

      new:
        "New Order",

      accepted:
        "Accepted",

      out_for_delivery:
        "Out for Delivery",

      delivered:
        "Delivered",

      cancelled:
        "Cancelled"

    };


    return (
      labels[status] ||
      "New Order"
    );

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
     CLONE ORDER
     ------------------------------------------------------- */

  clone(order) {

    return {

      ...order,

      customer: {

        ...(order?.customer || {})

      },

      delivery: {

        ...(order?.delivery || {}),

        location: {

          ...(order?.delivery?.location || {})

        }

      },

      items:

        Array.isArray(
          order?.items
        )

          ? order.items.map(
              item => ({
                ...item
              })
            )

          : []

    };

  }

};


/* =========================================================
   PUBLIC ORDER API
   ========================================================= */

window.AgarwalOrderData =
  AgarwalOrderData;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-data-ready"
  )

);
