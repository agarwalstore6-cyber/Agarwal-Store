/* =========================================================
   AGARWAL STORE
   CODE 47 — CART DATA MANAGER
   ========================================================= */


const AgarwalCartDataManager = {


  storageKey:
    "agarwal_store_cart",


  /* -------------------------------------------------------
     GET CART
     ------------------------------------------------------- */

  get() {

    try {

      const saved =
        localStorage.getItem(
          this.storageKey
        );


      if (!saved) {

        return [];

      }


      const cart =
        JSON.parse(
          saved
        );


      if (
        !Array.isArray(
          cart
        )
      ) {

        return [];

      }


      return cart;

    } catch (error) {

      console.error(
        "Cart read error:",
        error
      );


      return [];

    }

  },


  /* -------------------------------------------------------
     SAVE CART
     ------------------------------------------------------- */

  save(
    cart
  ) {

    if (
      !Array.isArray(
        cart
      )
    ) {

      return false;

    }


    try {

      localStorage.setItem(

        this.storageKey,

        JSON.stringify(
          cart
        )

      );


      window.dispatchEvent(

        new CustomEvent(
          "agarwal:cart-data-updated",
          {
            detail: {
              cart
            }
          }
        )

      );


      return true;

    } catch (error) {

      console.error(
        "Cart save error:",
        error
      );


      return false;

    }

  },


  /* -------------------------------------------------------
     CLEAR CART
     ------------------------------------------------------- */

  clear() {

    try {

      localStorage.removeItem(
        this.storageKey
      );

    } catch (error) {

      console.error(
        "Cart clear error:",
        error
      );

    }


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:cart-data-cleared"
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     ADD PRODUCT
     ------------------------------------------------------- */

  add(
    product,
    quantity = 1
  ) {

    if (!product?.id) {

      return false;

    }


    const amount =
      Math.max(
        1,
        Number(quantity) || 1
      );


    const cart =
      this.get();


    const existingIndex =
      cart.findIndex(

        item =>
          item?.productId ===
          product.id

      );


    if (
      existingIndex >= 0
    ) {

      cart[
        existingIndex
      ].quantity += amount;

    } else {

      cart.push({

        productId:
          product.id,

        catalogueId:
          product.catalogueId ||
          "",

        name:
          product.name ||
          "",

        image:
          product.image ||
          product.imageUrl ||
          "",

        unit:
          product.unit ||
          "",

        price:
          Number(
            product.price ||
            product.sellingPrice ||
            0
          ),

        mrp:
          Number(
            product.mrp ||
            0
          ),

        quantity:
          amount

      });

    }


    this.save(
      cart
    );


    return cart;

  },


  /* -------------------------------------------------------
     UPDATE QUANTITY
     ------------------------------------------------------- */

  updateQuantity(
    productId,
    quantity
  ) {

    const cart =
      this.get();


    const index =
      cart.findIndex(

        item =>
          item?.productId ===
          productId

      );


    if (
      index < 0
    ) {

      return cart;

    }


    const amount =
      Number(
        quantity
      );


    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {

      cart.splice(
        index,
        1
      );

    } else {

      cart[index].quantity =
        Math.floor(
          amount
        );

    }


    this.save(
      cart
    );


    return cart;

  },


  /* -------------------------------------------------------
     INCREASE
     ------------------------------------------------------- */

  increase(
    productId
  ) {

    const cart =
      this.get();


    const item =
      cart.find(

        product =>
          product?.productId ===
          productId

      );


    if (!item) {

      return cart;

    }


    return this.updateQuantity(

      productId,

      item.quantity + 1

    );

  },


  /* -------------------------------------------------------
     DECREASE
     ------------------------------------------------------- */

  decrease(
    productId
  ) {

    const cart =
      this.get();


    const item =
      cart.find(

        product =>
          product?.productId ===
          productId

      );


    if (!item) {

      return cart;

    }


    return this.updateQuantity(

      productId,

      item.quantity - 1

    );

  },


  /* -------------------------------------------------------
     REMOVE PRODUCT
     ------------------------------------------------------- */

  remove(
    productId
  ) {

    return this.updateQuantity(

      productId,

      0

    );

  },


  /* -------------------------------------------------------
     TOTAL ITEMS
     ------------------------------------------------------- */

  getTotalItems() {

    return this.get().reduce(

      (
        total,
        item
      ) =>

        total +
        Number(
          item.quantity || 0
        ),

      0

    );

  },


  /* -------------------------------------------------------
     TOTAL AMOUNT
     ------------------------------------------------------- */

  getTotalAmount() {

    return this.get().reduce(

      (
        total,
        item
      ) =>

        total +

        (
          Number(
            item.price || 0
          ) *

          Number(
            item.quantity || 0
          )

        ),

      0

    );

  },


  /* -------------------------------------------------------
     GET ITEM
     ------------------------------------------------------- */

  getItem(
    productId
  ) {

    return (

      this.get().find(

        item =>
          item?.productId ===
          productId

      ) ||

      null

    );

  },


  /* -------------------------------------------------------
     HAS PRODUCT
     ------------------------------------------------------- */

  has(
    productId
  ) {

    return Boolean(

      this.getItem(
        productId
      )

    );

  }

};


/* =========================================================
   PUBLIC CART DATA API
   ========================================================= */

window.AgarwalCartDataManager =
  AgarwalCartDataManager;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:cart-data-manager-ready"
  )

);
