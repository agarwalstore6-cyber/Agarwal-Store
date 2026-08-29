/* =========================================================
   AGARWAL STORE
   CODE 57 — ORDER TRACKING
   ========================================================= */


const AgarwalOrderTracking = {


  /* -------------------------------------------------------
     STATUS LIST
     ------------------------------------------------------- */

  statuses: [

    "new",

    "confirmed",

    "packing",

    "out_for_delivery",

    "delivered",

    "cancelled"

  ],


  /* -------------------------------------------------------
     GET STATUS
     ------------------------------------------------------- */

  getStatus(
    order
  ) {

    return (

      order?.orderStatus ||

      order?.status ||

      "new"

    );

  },


  /* -------------------------------------------------------
     STATUS LABEL
     ------------------------------------------------------- */

  getStatusLabel(
    status
  ) {

    const labels = {

      new:
        "Order Received",

      confirmed:
        "Order Confirmed",

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
     STATUS INDEX
     ------------------------------------------------------- */

  getStatusIndex(
    status
  ) {

    return this.statuses.indexOf(
      status
    );

  },


  /* -------------------------------------------------------
     IS CANCELLED
     ------------------------------------------------------- */

  isCancelled(
    order
  ) {

    return (

      this.getStatus(
        order
      ) ===
      "cancelled"

    );

  },


  /* -------------------------------------------------------
     IS DELIVERED
     ------------------------------------------------------- */

  isDelivered(
    order
  ) {

    return (

      this.getStatus(
        order
      ) ===
      "delivered"

    );

  },


  /* -------------------------------------------------------
     GET PROGRESS
     ------------------------------------------------------- */

  getProgress(
    order
  ) {

    const status =
      this.getStatus(
        order
      );


    if (
      status ===
      "cancelled"
    ) {

      return {

        percentage:
          0,

        status:
          status

      };

    }


    const index =
      this.getStatusIndex(
        status
      );


    const normalStatuses =
      this.statuses.filter(

        item =>
          item !==
          "cancelled"

      );


    const normalIndex =
      normalStatuses.indexOf(
        status
      );


    if (
      normalIndex < 0
    ) {

      return {

        percentage:
          0,

        status:
          status

      };

    }


    const percentage =

      (
        normalIndex /
        (normalStatuses.length - 1)
      ) *

      100;


    return {

      percentage:
        Math.round(
          percentage
        ),

      status:
        status

    };

  },


  /* -------------------------------------------------------
     GET TIMELINE
     ------------------------------------------------------- */

  getTimeline(
    order
  ) {

    const currentStatus =
      this.getStatus(
        order
      );


    const currentIndex =
      this.getStatusIndex(
        currentStatus
      );


    return this.statuses
      .filter(

        status =>
          status !==
          "cancelled"

      )
      .map(

        (
          status,
          index
        ) => ({

          status:

            status,

          label:

            this.getStatusLabel(
              status
            ),

          completed:

            currentStatus !==
              "cancelled" &&

            index <=
              currentIndex,

          current:

            status ===
            currentStatus

        })

      );

  },


  /* -------------------------------------------------------
     TRACK ORDER
     ------------------------------------------------------- */

  async track(
    orderNumber
  ) {

    if (
      !orderNumber
    ) {

      throw new Error(
        "Order number is required."
      );

    }


    if (
      !window.AgarwalOrderStorage
    ) {

      throw new Error(
        "Order storage is not ready."
      );

    }


    const order =

      await window.AgarwalOrderStorage
        .findByOrderNumber(
          orderNumber
        );


    if (!order) {

      return {

        found:
          false,

        order:
          null,

        message:
          "Order not found."

      };

    }


    return {

      found:
        true,

      order:
        order,

      status:
        this.getStatus(
          order
        ),

      statusLabel:
        this.getStatusLabel(

          this.getStatus(
            order
          )

        ),

      progress:
        this.getProgress(
          order
        ),

      timeline:
        this.getTimeline(
          order
        ),

      message:
        "Order found."

    };

  },


  /* -------------------------------------------------------
     FORMAT TRACKING RESULT
     ------------------------------------------------------- */

  format(
    result
  ) {

    if (
      !result?.found
    ) {

      return {

        found:
          false,

        orderNumber:
          "",

        status:
          "",

        statusLabel:
          "",

        progress:
          0,

        timeline:
          [],

        message:
          result?.message ||
          "Order not found."

      };

    }


    return {

      found:
        true,

      orderNumber:

        result.order
          ?.orderNumber ||

        "#PENDING",

      status:
        result.status,

      statusLabel:
        result.statusLabel,

      progress:
        result.progress
          ?.percentage || 0,

      timeline:
        result.timeline || [],

      message:
        result.message

    };

  }

};


/* =========================================================
   PUBLIC ORDER TRACKING API
   ========================================================= */

window.AgarwalOrderTracking =
  AgarwalOrderTracking;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-tracking-ready"
  )

);
