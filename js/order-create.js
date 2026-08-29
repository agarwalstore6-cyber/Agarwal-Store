/* =========================================================
   AGARWAL STORE
   CODE 69 — ORDER CREATION + FIRESTORE SAVE
   ========================================================= */


const AgarwalOrderCreate = {


  /* -------------------------------------------------------
     CREATE ORDER NUMBER
     ------------------------------------------------------- */

  createOrderNumber() {

    if (
      window.AgarwalOrderNumber
        ?.getNextDisplayNumber
    ) {

      return window.AgarwalOrderNumber
        .getNextDisplayNumber();

    }


    const number =
      Date.now()
        .toString()
        .slice(-8);


    return "#" + number;

  },


  /* -------------------------------------------------------
     CREATE ORDER DATA
     ------------------------------------------------------- */

  create(
    checkoutOrder = {}
  ) {

    const orderNumber =
      this.createOrderNumber();


    const now =
      new Date()
        .toISOString();


    return {

      orderNumber,

      customer:
        checkoutOrder.customer ||
        {},

      deliveryAddress:
        checkoutOrder.deliveryAddress ||
        {},

      items:
        Array.isArray(
          checkoutOrder.items
        )
          ? checkoutOrder.items
          : [],

      total:
        Number(
          checkoutOrder.total ||
          0
        ),

      paymentMethod:
        checkoutOrder.paymentMethod ||
        "cash_on_delivery",

      paymentStatus:
        checkoutOrder.paymentStatus ||
        "pending",

      orderStatus:
        checkoutOrder.orderStatus ||
        "new",

      whatsappSent:
        false,

      createdAt:
        now,

      updatedAt:
        now

    };

  },


  /* -------------------------------------------------------
     VALIDATE ORDER
     ------------------------------------------------------- */

  validate(
    order
  ) {

    if (!order) {

      return {

        valid:
          false,

        message:
          "Order data is missing."

      };

    }


    if (
      !order.customer
        ?.name
    ) {

      return {

        valid:
          false,

        message:
          "Customer name is required."

      };

    }


    if (
      !/^[0-9]{10}$/.test(

        String(
          order.customer
            ?.phone ||
          ""
        )

      )
    ) {

      return {

        valid:
          false,

        message:
          "Valid mobile number is required."

      };

    }


    if (
      !order.deliveryAddress
        ?.fullAddress
    ) {

      return {

        valid:
          false,

        message:
          "Delivery address is required."

      };

    }


    if (
      String(
        order.deliveryAddress
          ?.area ||
        ""
      )
      .toLowerCase() !==
      "benta"
    ) {

      return {

        valid:
          false,

        message:
          "Delivery is available only in Benta."

      };

    }


    if (
      String(
        order.deliveryAddress
          ?.pincode ||
        ""
      ) !==
      "846003"
    ) {

      return {

        valid:
          false,

        message:
          "Delivery is available in Benta, PIN 846003."

      };

    }


    if (
      !Array.isArray(
        order.items
      ) ||
      order.items.length === 0
    ) {

      return {

        valid:
          false,

        message:
          "Your cart is empty."

      };

    }


    if (
      Number(
        order.total
      ) < 99
    ) {

      return {

        valid:
          false,

        message:
          "Minimum order value is ₹99."

      };

    }


    return {

      valid:
        true,

      message:
        "Order is valid."

    };

  },


  /* -------------------------------------------------------
     SAVE TO FIRESTORE
     ------------------------------------------------------- */

  async save(
    order
  ) {

    const validation =
      this.validate(
        order
      );


    if (
      !validation.valid
    ) {

      throw new Error(
        validation.message
      );

    }


    const firestore =
      window.AgarwalFirestore;


    if (!firestore) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const finalOrder =
      this.create(
        order
      );


    let saved;


    /*
     * Try the project's existing
     * Firestore helper first.
     */

    if (
      typeof firestore
        .addDocument ===
      "function"
    ) {

      saved =

        await firestore
          .addDocument(

            "orders",

            finalOrder

          );

    }


    else if (
      typeof firestore
        .add ===
      "function"
    ) {

      saved =

        await firestore
          .add(

            "orders",

            finalOrder

          );

    }


    else if (
      typeof firestore
        .createDocument ===
      "function"
    ) {

      saved =

        await firestore
          .createDocument(

            "orders",

            finalOrder

          );

    }


    else {

      throw new Error(

        "No Firestore order-save method is available."

      );

    }


    const savedOrder = {

      ...finalOrder,

      id:
        saved?.id ||

        saved?.documentId ||

        saved?.key ||

        ""

    };


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:order-created",
        {
          detail: {

            order:
              savedOrder

          }

        }
      )

    );


    return savedOrder;

  },


  /* -------------------------------------------------------
     CREATE + SAVE
     ------------------------------------------------------- */

  async createAndSave(
    checkoutOrder
  ) {

    const order =
      this.create(
        checkoutOrder
      );


    return this.save(
      order
    );

  }

};


/* =========================================================
   PUBLIC ORDER CREATION API
   ========================================================= */

window.AgarwalOrderCreate =
  AgarwalOrderCreate;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-create-ready"
  )

);
