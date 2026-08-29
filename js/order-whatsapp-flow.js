/* =========================================================
   AGARWAL STORE
   CODE 51 — ORDER + WHATSAPP FLOW
   ========================================================= */


const AgarwalOrderWhatsAppFlow = {


  /* -------------------------------------------------------
     CREATE FINAL ORDER
     ------------------------------------------------------- */

  async createOrder() {

    if (
      !window.AgarwalOrderBuilder
    ) {

      throw new Error(
        "Order builder is not ready."
      );

    }


    const validation =
      window.AgarwalCartValidation
        ?.validate();


    if (
      validation &&
      !validation.valid
    ) {

      throw new Error(
        validation.message ||
        "Cart validation failed."
      );

    }


    const prepared =
      window.AgarwalOrderBuilder
        .prepare();


    if (
      !prepared.success
    ) {

      throw new Error(

        prepared.errors?.join(
          " "
        ) ||

        "Unable to prepare order."

      );

    }


    const order =
      prepared.order;


    /* -----------------------------------------------------
       GENERATE UNIQUE ORDER NUMBER
       ----------------------------------------------------- */

    if (
      window.AgarwalOrderCounter
    ) {

      order.orderNumber =

        await window.AgarwalOrderCounter
          .getNextFormatted();

    }


    return order;

  },


  /* -------------------------------------------------------
     SAVE ORDER
     ------------------------------------------------------- */

  async saveOrder(
    order
  ) {

    if (!order) {

      throw new Error(
        "Order data is required."
      );

    }


    if (
      !window.AgarwalOrderStorage
    ) {

      throw new Error(
        "Order storage is not ready."
      );

    }


    const saved =

      await window.AgarwalOrderStorage
        .create(
          order
        );


    return saved;

  },


  /* -------------------------------------------------------
     OPEN WHATSAPP
     ------------------------------------------------------- */

  openWhatsApp(
    order
  ) {

    if (
      !window.AgarwalWhatsAppOrder
    ) {

      throw new Error(
        "WhatsApp order system is not ready."
      );

    }


    return window.AgarwalWhatsAppOrder
      .openOrder(
        order
      );

  },


  /* -------------------------------------------------------
     COMPLETE ORDER FLOW
     ------------------------------------------------------- */

  async placeOrder() {

    const order =
      await this.createOrder();


    const saved =
      await this.saveOrder(
        order
      );


    const finalOrder = {

      ...order,

      ...saved,

      orderNumber:

        saved?.orderNumber ||

        order.orderNumber

    };


    this.openWhatsApp(
      finalOrder
    );


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:order-created",
        {
          detail: {

            order:
              finalOrder

          }

        }
      )

    );


    return finalOrder;

  },


  /* -------------------------------------------------------
     CLEAR CART AFTER SUCCESS
     ------------------------------------------------------- */

  clearCart() {

    if (
      window.AgarwalCartDataManager
    ) {

      window.AgarwalCartDataManager
        .clear();

    }


    if (
      window.AgarwalStore?.state
    ) {

      window.AgarwalStore
        .state
        .cart = [];

    }


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:cart-cleared-after-order"
      )

    );


    return true;

  }

};


/* =========================================================
   PUBLIC ORDER WHATSAPP API
   ========================================================= */

window.AgarwalOrderWhatsAppFlow =
  AgarwalOrderWhatsAppFlow;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-whatsapp-flow-ready"
  )

);
