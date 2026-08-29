/* =========================================================
   AGARWAL STORE
   CODE 58 — ORDER STATUS MANAGER
   ========================================================= */


const AgarwalOrderStatus = {


  statuses: [

    "new",

    "confirmed",

    "packing",

    "out_for_delivery",

    "delivered",

    "cancelled"

  ],


  labels: {

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

  },


  /* -------------------------------------------------------
     CHECK STATUS
     ------------------------------------------------------- */

  isValid(
    status
  ) {

    return this.statuses.includes(
      status
    );

  },


  /* -------------------------------------------------------
     GET LABEL
     ------------------------------------------------------- */

  getLabel(
    status
  ) {

    return (

      this.labels[status] ||

      this.labels.new

    );

  },


  /* -------------------------------------------------------
     GET STATUS
     ------------------------------------------------------- */

  get(
    order
  ) {

    return (

      order?.orderStatus ||

      order?.status ||

      "new"

    );

  },


  /* -------------------------------------------------------
     CHECK FINAL STATUS
     ------------------------------------------------------- */

  isFinal(
    status
  ) {

    return (

      status ===
        "delivered" ||

      status ===
        "cancelled"

    );

  },


  /* -------------------------------------------------------
     CHECK ACTIVE
     ------------------------------------------------------- */

  isActive(
    status
  ) {

    return (

      this.isValid(
        status
      ) &&

      !this.isFinal(
        status
      )

    );

  },


  /* -------------------------------------------------------
     NEXT STATUS
     ------------------------------------------------------- */

  getNext(
    status
  ) {

    const index =
      this.statuses.indexOf(
        status
      );


    if (
      index < 0
    ) {

      return "confirmed";

    }


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
      normalIndex < 0 ||
      normalIndex >=
        normalStatuses.length - 1
    ) {

      return null;

    }


    return normalStatuses[
      normalIndex + 1
    ];

  },


  /* -------------------------------------------------------
     CAN MOVE TO STATUS
     ------------------------------------------------------- */

  canMoveTo(
    currentStatus,
    newStatus
  ) {

    if (
      !this.isValid(
        currentStatus
      ) ||

      !this.isValid(
        newStatus
      )
    ) {

      return false;

    }


    if (
      currentStatus ===
      newStatus
    ) {

      return true;

    }


    if (
      currentStatus ===
      "cancelled"
    ) {

      return false;

    }


    if (
      currentStatus ===
      "delivered"
    ) {

      return false;

    }


    if (
      newStatus ===
      "cancelled"
    ) {

      return true;

    }


    const currentIndex =
      this.statuses.indexOf(
        currentStatus
      );


    const newIndex =
      this.statuses.indexOf(
        newStatus
      );


    return (
      newIndex >
      currentIndex
    );

  },


  /* -------------------------------------------------------
     UPDATE ORDER
     ------------------------------------------------------- */

  async update(
    orderId,
    newStatus
  ) {

    if (
      !orderId
    ) {

      throw new Error(
        "Order ID is required."
      );

    }


    if (
      !this.isValid(
        newStatus
      )
    ) {

      throw new Error(
        "Invalid order status."
      );

    }


    if (
      !window.AgarwalOrderStorage
    ) {

      throw new Error(
        "Order storage is not ready."
      );

    }


    const updated =

      await window.AgarwalOrderStorage
        .updateStatus(

          orderId,

          newStatus

        );


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:order-status-updated",
        {
          detail: {

            orderId:

              orderId,

            status:

              newStatus,

            label:

              this.getLabel(
                newStatus
              )

          }

        }
      )

    );


    return updated;

  },


  /* -------------------------------------------------------
     CREATE STATUS SUMMARY
     ------------------------------------------------------- */

  summary(
    order
  ) {

    const status =
      this.get(
        order
      );


    return {

      status:
        status,

      label:
        this.getLabel(
          status
        ),

      active:
        this.isActive(
          status
        ),

      final:
        this.isFinal(
          status
        ),

      next:
        this.getNext(
          status
        )

    };

  }

};


/* =========================================================
   PUBLIC ORDER STATUS API
   ========================================================= */

window.AgarwalOrderStatus =
  AgarwalOrderStatus;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-status-ready"
  )

);
