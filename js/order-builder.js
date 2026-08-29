/* =========================================================
   AGARWAL STORE
   CODE 49 — ORDER DATA BUILDER
   ========================================================= */


const AgarwalOrderBuilder = {


  /* -------------------------------------------------------
     DEFAULT PAYMENT METHOD
     ------------------------------------------------------- */

  paymentMethod:
    "cash_on_delivery",


  /* -------------------------------------------------------
     STORE INFORMATION
     ------------------------------------------------------- */

  getStoreInfo() {

    const config =
      window.AgarwalConfig || {};


    return {

      name:
        config.store?.name ||
        "Agarwal Store",

      address:
        config.store?.address ||
        "Ayachinagar Benta",

      city:
        config.store?.city ||
        "Darbhanga",

      pincode:
        config.store?.pincode ||
        "846003",

      phone:
        config.contact?.phone ||
        "9229609882",

      whatsapp:
        config.contact?.whatsapp ||
        "9229609882"

    };

  },


  /* -------------------------------------------------------
     GET CUSTOMER
     ------------------------------------------------------- */

  getCustomer() {

    const session =
      window.AgarwalCustomerSession;


    if (
      session?.getCustomer
    ) {

      return (
        session.getCustomer() ||
        {}
      );

    }


    return (

      window.AgarwalStore
        ?.state
        ?.currentUser ||

      {}

    );

  },


  /* -------------------------------------------------------
     GET CART
     ------------------------------------------------------- */

  getCart() {

    if (
      window.AgarwalCartDataManager
    ) {

      return window.AgarwalCartDataManager
        .get();

    }


    return (

      window.AgarwalStore
        ?.state
        ?.cart ||

      []

    );

  },


  /* -------------------------------------------------------
     CREATE ITEM
     ------------------------------------------------------- */

  createItem(
    item
  ) {

    const quantity =
      Math.max(

        1,

        Number(
          item?.quantity || 1
        )

      );


    const price =
      Math.max(

        0,

        Number(
          item?.price || 0
        )

      );


    return {

      productId:
        item?.productId ||
        "",

      catalogueId:
        item?.catalogueId ||
        "",

      name:
        item?.name ||
        "Product",

      image:
        item?.image ||
        "",

      unit:
        item?.unit ||
        "",

      price:
        price,

      mrp:
        Math.max(

          0,

          Number(
            item?.mrp || 0
          )

        ),

      quantity:
        quantity,

      subtotal:
        price * quantity

    };

  },


  /* -------------------------------------------------------
     CREATE ITEMS
     ------------------------------------------------------- */

  createItems(
    cart = this.getCart()
  ) {

    if (
      !Array.isArray(
        cart
      )
    ) {

      return [];

    }


    return cart.map(

      item =>
        this.createItem(
          item
        )

    );

  },


  /* -------------------------------------------------------
     CALCULATE TOTAL
     ------------------------------------------------------- */

  calculateTotal(
    items
  ) {

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
          item?.subtotal || 0
        ),

      0

    );

  },


  /* -------------------------------------------------------
     GET DELIVERY LOCATION
     ------------------------------------------------------- */

  getDeliveryLocation() {

    return (

      window.AgarwalStore
        ?.state
        ?.deliveryLocation ||

      window.AgarwalCustomerMap
        ?.getLocation?.() ||

      null

    );

  },


  /* -------------------------------------------------------
     GET ADDRESS
     ------------------------------------------------------- */

  getAddress() {

    const customer =
      this.getCustomer();


    const location =
      this.getDeliveryLocation();


    return {

      fullAddress:
        customer?.address ||
        customer?.fullAddress ||
        "",

      area:
        customer?.area ||
        "",

      city:
        customer?.city ||
        "Darbhanga",

      pincode:
        customer?.pincode ||
        "846003",

      latitude:
        Number(
          location?.lat || 0
        ),

      longitude:
        Number(
          location?.lng || 0
        )

    };

  },


  /* -------------------------------------------------------
     BUILD ORDER
     ------------------------------------------------------- */

  build() {

    const customer =
      this.getCustomer();


    const items =
      this.createItems();


    const total =
      this.calculateTotal(
        items
      );


    const address =
      this.getAddress();


    const store =
      this.getStoreInfo();


    return {

      orderNumber:
        "",

      customer: {

        uid:
          customer?.uid ||
          customer?.id ||
          "",

        name:
          customer?.name ||
          "",

        phone:
          customer?.phone ||
          customer?.phoneNumber ||
          ""

      },

      deliveryAddress:
        address,

      items:
        items,

      total:
        total,

      paymentMethod:
        this.paymentMethod,

      paymentStatus:
        "pending",

      orderStatus:
        "new",

      store:
        store,

      notes:
        "",

      whatsappSent:
        false,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    };

  },


  /* -------------------------------------------------------
     CHECK ORDER OBJECT
     ------------------------------------------------------- */

  validateOrder(
    order
  ) {

    const errors = [];


    if (
      !order?.customer?.name
    ) {

      errors.push(
        "Customer name is missing."
      );

    }


    if (
      !order?.customer?.phone
    ) {

      errors.push(
        "Customer phone number is missing."
      );

    }


    if (
      !Array.isArray(
        order?.items
      ) ||
      order.items.length === 0
    ) {

      errors.push(
        "Order has no products."
      );

    }


    if (
      Number(
        order?.total || 0
      ) <= 0
    ) {

      errors.push(
        "Order total must be greater than zero."
      );

    }


    if (
      !order?.deliveryAddress
        ?.city
    ) {

      errors.push(
        "Delivery city is missing."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors:
        errors

    };

  },


  /* -------------------------------------------------------
     PREPARE ORDER
     ------------------------------------------------------- */

  prepare() {

    const order =
      this.build();


    const validation =
      this.validateOrder(
        order
      );


    if (
      !validation.valid
    ) {

      return {

        success:
          false,

        order:
          order,

        errors:
          validation.errors

      };

    }


    return {

      success:
        true,

      order:
        order,

      errors:
        []

    };

  }

};


/* =========================================================
   PUBLIC ORDER BUILDER API
   ========================================================= */

window.AgarwalOrderBuilder =
  AgarwalOrderBuilder;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-builder-ready"
  )

);
