/* =========================================================
   AGARWAL STORE
   CODE 53 — ORDER RESULT MANAGER
   ========================================================= */


const AgarwalOrderResult = {


  currentOrder:
    null,


  /* -------------------------------------------------------
     SET ORDER
     ------------------------------------------------------- */

  setOrder(
    order
  ) {

    if (!order) {

      return false;

    }


    this.currentOrder =
      order;


    if (
      window.AgarwalStore?.state
    ) {

      window.AgarwalStore
        .state
        .lastOrder =
        order;

    }


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:order-result-ready",
        {
          detail: {

            order

          }

        }
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     GET ORDER
     ------------------------------------------------------- */

  getOrder() {

    return (
      this.currentOrder ||

      window.AgarwalStore
        ?.state
        ?.lastOrder ||

      null
    );

  },


  /* -------------------------------------------------------
     GET ORDER NUMBER
     ------------------------------------------------------- */

  getOrderNumber() {

    const order =
      this.getOrder();


    return (

      order?.orderNumber ||

      "#PENDING"

    );

  },


  /* -------------------------------------------------------
     GET TOTAL
     ------------------------------------------------------- */

  getTotal() {

    const order =
      this.getOrder();


    return Number(
      order?.total || 0
    );

  },


  /* -------------------------------------------------------
     FORMAT TOTAL
     ------------------------------------------------------- */

  getFormattedTotal() {

    const total =
      this.getTotal();


    return (

      "₹" +

      total.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits:
            2
        }
      )

    );

  },


  /* -------------------------------------------------------
     GET CUSTOMER NAME
     ------------------------------------------------------- */

  getCustomerName() {

    return (

      this.getOrder()
        ?.customer
        ?.name ||

      ""

    );

  },


  /* -------------------------------------------------------
     GET ITEM COUNT
     ------------------------------------------------------- */

  getItemCount() {

    const items =
      this.getOrder()
        ?.items;


    if (
      !Array.isArray(
        items
      )
    ) {

      return 0;

    }


    return items.reduce(

      (
        total,
        item
      ) =>

        total +

        Number(
          item?.quantity || 0
        ),

      0

    );

  },


  /* -------------------------------------------------------
     GET PAYMENT
     ------------------------------------------------------- */

  getPaymentMethod() {

    return (

      this.getOrder()
        ?.paymentMethod ||

      "cash_on_delivery"

    );

  },


  /* -------------------------------------------------------
     GET PAYMENT LABEL
     ------------------------------------------------------- */

  getPaymentLabel() {

    if (
      this.getPaymentMethod() ===
      "cash_on_delivery"
    ) {

      return "Cash on Delivery";

    }


    return this.getPaymentMethod();

  },


  /* -------------------------------------------------------
     WHATSAPP STATUS
     ------------------------------------------------------- */

  markWhatsAppOpened() {

    const order =
      this.getOrder();


    if (!order) {

      return false;

    }


    order.whatsappSent =
      true;


    order.whatsappOpenedAt =
      new Date()
        .toISOString();


    this.setOrder(
      order
    );


    return true;

  },


  /* -------------------------------------------------------
     ORDER SUMMARY
     ------------------------------------------------------- */

  getSummary() {

    const order =
      this.getOrder();


    if (!order) {

      return null;

    }


    return {

      orderNumber:
        this.getOrderNumber(),

      customerName:
        this.getCustomerName(),

      total:
        this.getTotal(),

      formattedTotal:
        this.getFormattedTotal(),

      itemCount:
        this.getItemCount(),

      payment:
        this.getPaymentLabel(),

      orderStatus:
        order.orderStatus ||
        "new",

      whatsappOpened:
        order.whatsappSent === true

    };

  },


  /* -------------------------------------------------------
     CLEAR RESULT
     ------------------------------------------------------- */

  clear() {

    this.currentOrder =
      null;


    if (
      window.AgarwalStore?.state
    ) {

      window.AgarwalStore
        .state
        .lastOrder =
        null;

    }


    return true;

  }

};


/* =========================================================
   PUBLIC ORDER RESULT API
   ========================================================= */

window.AgarwalOrderResult =
  AgarwalOrderResult;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-result-ready"
  )

);
