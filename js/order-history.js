/* =========================================================
   AGARWAL STORE
   CODE 56 — ORDER HISTORY
   ========================================================= */


const AgarwalOrderHistory = {


  /* -------------------------------------------------------
     GET CUSTOMER ORDERS
     ------------------------------------------------------- */

  async getCustomerOrders(
    customerUid
  ) {

    if (
      !customerUid
    ) {

      return [];

    }


    if (
      !window.AgarwalOrderStorage
    ) {

      throw new Error(
        "Order storage is not ready."
      );

    }


    return (

      await window.AgarwalOrderStorage
        .getCustomerOrders(
          customerUid
        )

    ) || [];

  },


  /* -------------------------------------------------------
     GET CURRENT CUSTOMER ORDERS
     ------------------------------------------------------- */

  async getCurrentCustomerOrders() {

    const customer =
      window.AgarwalCustomerSession
        ?.getCustomer?.();


    const uid =
      customer?.uid ||
      customer?.id ||
      "";


    if (!uid) {

      return [];

    }


    return this.getCustomerOrders(
      uid
    );

  },


  /* -------------------------------------------------------
     FIND ORDER
     ------------------------------------------------------- */

  async find(
    orderNumber
  ) {

    if (
      !orderNumber
    ) {

      return null;

    }


    if (
      !window.AgarwalOrderStorage
    ) {

      throw new Error(
        "Order storage is not ready."
      );

    }


    return (

      await window.AgarwalOrderStorage
        .findByOrderNumber(
          orderNumber
        )

    );

  },


  /* -------------------------------------------------------
     SORT ORDERS
     ------------------------------------------------------- */

  sortLatestFirst(
    orders
  ) {

    if (
      !Array.isArray(
        orders
      )
    ) {

      return [];

    }


    return [...orders].sort(

      (
        first,
        second
      ) => {

        const firstTime =
          new Date(
            first?.createdAt || 0
          ).getTime();


        const secondTime =
          new Date(
            second?.createdAt || 0
          ).getTime();


        return (
          secondTime -
          firstTime
        );

      }

    );

  },


  /* -------------------------------------------------------
     FORMAT STATUS
     ------------------------------------------------------- */

  formatStatus(
    status
  ) {

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
     FORMAT ORDER
     ------------------------------------------------------- */

  formatOrder(
    order
  ) {

    if (!order) {

      return null;

    }


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
            item?.quantity || 0
          ),

        0

      );


    return {

      id:
        order.id || "",

      orderNumber:
        order.orderNumber ||
        "#PENDING",

      customer:
        order.customer || {},

      items:
        items,

      itemCount:
        itemCount,

      total:
        Number(
          order.total || 0
        ),

      status:
        order.status ||
        order.orderStatus ||
        "new",

      statusLabel:
        this.formatStatus(

          order.status ||
          order.orderStatus ||
          "new"

        ),

      paymentMethod:
        order.paymentMethod ||
        "cash_on_delivery",

      deliveryAddress:
        order.deliveryAddress ||
        {},

      createdAt:
        order.createdAt ||
        "",

      updatedAt:
        order.updatedAt ||
        ""

    };

  },


  /* -------------------------------------------------------
     FORMAT MANY ORDERS
     ------------------------------------------------------- */

  formatOrders(
    orders
  ) {

    return this
      .sortLatestFirst(
        orders
      )
      .map(

        order =>
          this.formatOrder(
            order
          )

      );

  }

};


/* =========================================================
   PUBLIC ORDER HISTORY API
   ========================================================= */

window.AgarwalOrderHistory =
  AgarwalOrderHistory;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-history-ready"
  )

);
