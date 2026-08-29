/* =========================================================
   AGARWAL STORE
   CODE 29 — ORDER STORAGE
   ========================================================= */


const AgarwalOrderStorage = {


  /* -------------------------------------------------------
     COLLECTION
     ------------------------------------------------------- */

  collectionName:
    "orders",


  /* -------------------------------------------------------
     SAVE ORDER
     ------------------------------------------------------- */

  async save(order) {

    if (!order) {

      throw new Error(
        "Order information is required."
      );

    }


    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const preparedOrder =
      window.AgarwalOrderData?.create(
        order
      ) || order;


    const validation =
      window.AgarwalOrderData?.validate(
        preparedOrder
      );


    if (
      validation &&
      !validation.valid
    ) {

      throw new Error(
        validation.errors.join(
          " "
        )
      );

    }


    const orderId =
      await window.AgarwalFirestore
        .addDocument(

          this.collectionName,

          preparedOrder

        );


    const savedOrder = {

      ...preparedOrder,

      id:
        orderId

    };


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:order-saved",
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
     GET ONE ORDER
     ------------------------------------------------------- */

  async get(
    orderId
  ) {

    if (!orderId) {

      return null;

    }


    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    return (

      await window.AgarwalFirestore
        .getDocumentData(

          this.collectionName,

          orderId

        )

    );

  },


  /* -------------------------------------------------------
     GET LATEST ORDERS
     ------------------------------------------------------- */

  async getLatest(
    maximum = 50
  ) {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    return (

      await window.AgarwalFirestore
        .getLatestDocuments(

          this.collectionName,

          "createdAt",

          maximum

        )

    );

  },


  /* -------------------------------------------------------
     UPDATE ORDER STATUS
     ------------------------------------------------------- */

  async updateStatus(
    orderId,
    status
  ) {

    if (!orderId) {

      throw new Error(
        "Order ID is required."
      );

    }


    if (!status) {

      throw new Error(
        "Order status is required."
      );

    }


    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    await window.AgarwalFirestore
      .updateDocument(

        this.collectionName,

        orderId,

        {

          status:
            status

        }

      );


    const updatedOrder =
      await this.get(
        orderId
      );


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:order-status-updated",
        {
          detail: {
            order:
              updatedOrder
          }
        }
      )

    );


    return updatedOrder;

  },


  /* -------------------------------------------------------
     CANCEL ORDER
     ------------------------------------------------------- */

  async cancel(
    orderId
  ) {

    return this.updateStatus(

      orderId,

      "cancelled"

    );

  },


  /* -------------------------------------------------------
     MARK DELIVERED
     ------------------------------------------------------- */

  async markDelivered(
    orderId
  ) {

    return this.updateStatus(

      orderId,

      "delivered"

    );

  },


  /* -------------------------------------------------------
     CHECK OPEN ORDER
     ------------------------------------------------------- */

  isOpen(
    order
  ) {

    if (
      !order
    ) {

      return false;

    }


    return (

      order.status !==
        "delivered" &&

      order.status !==
        "cancelled"

    );

  }

};


/* =========================================================
   PUBLIC ORDER STORAGE API
   ========================================================= */

window.AgarwalOrderStorage =
  AgarwalOrderStorage;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-storage-ready"
  )

);
