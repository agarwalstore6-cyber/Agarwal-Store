/* =========================================================
   AGARWAL STORE
   CODE 15 — CART FOUNDATION
   ========================================================= */


const AgarwalCart = {


  /* -------------------------------------------------------
     CART STATE
     ------------------------------------------------------- */

  items: [],


  /* -------------------------------------------------------
     INITIALIZE
     ------------------------------------------------------- */

  init() {

    this.load();

    this.save();

  },


  /* -------------------------------------------------------
     ADD PRODUCT
     ------------------------------------------------------- */

  addProduct(product, quantity = 1) {

    if (!product || !product.id) {

      throw new Error(
        "Invalid product."
      );

    }


    if (
      product.outOfStock === true
    ) {

      throw new Error(
        "This product is out of stock."
      );

    }


    const existing =
      this.items.find(
        item =>
          item.productId ===
          product.id
      );


    if (existing) {

      existing.quantity +=
        quantity;

    } else {

      this.items.push({

        productId:
          product.id,

        name:
          product.name || "",

        image:
          product.image || "",

        size:
          product.size || "",

        unit:
          product.unit || "",

        price:
          Number(
            product.price || 0
          ),

        mrp:
          Number(
            product.mrp || 0
          ),

        quantity:
          Math.max(
            1,
            Number(quantity)
          )

      });

    }


    this.save();

    this.emitChange();


    return this.items;

  },


  /* -------------------------------------------------------
     INCREASE QUANTITY
     ------------------------------------------------------- */

  increase(productId) {

    const item =
      this.items.find(
        product =>
          product.productId ===
          productId
      );


    if (!item) {

      return;

    }


    item.quantity += 1;


    this.save();

    this.emitChange();

  },


  /* -------------------------------------------------------
     DECREASE QUANTITY
     ------------------------------------------------------- */

  decrease(productId) {

    const item =
      this.items.find(
        product =>
          product.productId ===
          productId
      );


    if (!item) {

      return;

    }


    if (
      item.quantity > 1
    ) {

      item.quantity -= 1;

    } else {

      this.remove(
        productId
      );

      return;

    }


    this.save();

    this.emitChange();

  },


  /* -------------------------------------------------------
     REMOVE PRODUCT
     ------------------------------------------------------- */

  remove(productId) {

    this.items =
      this.items.filter(
        item =>
          item.productId !==
          productId
      );


    this.save();

    this.emitChange();

  },


  /* -------------------------------------------------------
     CLEAR CART
     ------------------------------------------------------- */

  clear() {

    this.items = [];

    this.save();

    this.emitChange();

  },


  /* -------------------------------------------------------
     GET ITEMS
     ------------------------------------------------------- */

  getItems() {

    return this.items.map(
      item => ({
        ...item
      })
    );

  },


  /* -------------------------------------------------------
     TOTAL ITEMS
     ------------------------------------------------------- */

  getItemCount() {

    return this.items.reduce(

      (total, item) =>

        total +
        item.quantity,

      0

    );

  },


  /* -------------------------------------------------------
     SUBTOTAL
     ------------------------------------------------------- */

  getSubtotal() {

    return this.items.reduce(

      (total, item) =>

        total +
        (
          item.price *
          item.quantity
        ),

      0

    );

  },


  /* -------------------------------------------------------
     DELIVERY CHARGE
     ------------------------------------------------------- */

  getDeliveryCharge() {

    return 0;

  },


  /* -------------------------------------------------------
     GRAND TOTAL
     ------------------------------------------------------- */

  getTotal() {

    return (

      this.getSubtotal() +

      this.getDeliveryCharge()

    );

  },


  /* -------------------------------------------------------
     MINIMUM ORDER CHECK
     ------------------------------------------------------- */

  meetsMinimumOrder() {

    const minimum =
      Number(
        window.AgarwalConfig
          ?.delivery
          ?.minimumOrder ??
        99
      );


    return (
      this.getTotal() >=
      minimum
    );

  },


  /* -------------------------------------------------------
     MINIMUM ORDER MESSAGE
     ------------------------------------------------------- */

  getMinimumOrderMessage() {

    const minimum =
      Number(
        window.AgarwalConfig
          ?.delivery
          ?.minimumOrder ??
        99
      );


    if (
      this.meetsMinimumOrder()
    ) {

      return "";

    }


    return (
      "Sorry, minimum order amount is ₹" +
      minimum +
      "."
    );

  },


  /* -------------------------------------------------------
     SAVE CART
     ------------------------------------------------------- */

  save() {

    try {

      localStorage.setItem(

        "agarwal_store_cart",

        JSON.stringify(
          this.items
        )

      );

    } catch (error) {

      console.info(
        "Cart could not be saved locally."
      );

    }

  },


  /* -------------------------------------------------------
     LOAD CART
     ------------------------------------------------------- */

  load() {

    try {

      const saved =
        localStorage.getItem(
          "agarwal_store_cart"
        );


      if (!saved) {

        this.items = [];

        return;

      }


      const parsed =
        JSON.parse(
          saved
        );


      this.items =
        Array.isArray(parsed)
          ? parsed
          : [];

    } catch (error) {

      this.items = [];

    }

  },


  /* -------------------------------------------------------
     CART CHANGE EVENT
     ------------------------------------------------------- */

  emitChange() {

    window.dispatchEvent(

      new CustomEvent(
        "agarwal:cart-changed",
        {
          detail: {

            items:
              this.getItems(),

            count:
              this.getItemCount(),

            subtotal:
              this.getSubtotal(),

            total:
              this.getTotal()

          }

        }
      )

    );

  }

};


/* =========================================================
   PUBLIC CART API
   ========================================================= */

window.AgarwalCart =
  AgarwalCart;


/* =========================================================
   INITIALIZE CART
   ========================================================= */

AgarwalCart.init();


/* =========================================================
   CART READY
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:cart-ready"
  )

);
