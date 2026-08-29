/* =========================================================
   AGARWAL STORE
   CODE 17 — PRODUCT DATA FOUNDATION
   ========================================================= */

const AgarwalProductData = {


  /* -------------------------------------------------------
     CREATE PRODUCT
     ------------------------------------------------------- */

  create(data = {}) {

    return {

      id:
        data.id ||
        this.createId(),

      catalogueId:
        data.catalogueId ||
        "",

      name:
        data.name ||
        "",

      image:
        data.image ||
        "",

      description:
        data.description ||
        "",

      size:
        data.size ||
        "",

      unit:
        data.unit ||
        "",

      mrp:
        this.number(
          data.mrp
        ),

      price:
        this.number(
          data.price
        ),

      outOfStock:
        data.outOfStock === true,

      active:
        data.active !== false,

      createdAt:
        data.createdAt ||
        null,

      updatedAt:
        data.updatedAt ||
        null

    };

  },


  /* -------------------------------------------------------
     CREATE PRODUCT ID
     ------------------------------------------------------- */

  createId() {

    return (

      "product_" +

      Date.now().toString(36) +

      "_" +

      Math.random()
        .toString(36)
        .slice(2, 8)

    );

  },


  /* -------------------------------------------------------
     NUMBER CONVERSION
     ------------------------------------------------------- */

  number(value) {

    const number =
      Number(value);


    if (
      !Number.isFinite(number)
    ) {

      return 0;

    }


    return Math.max(
      0,
      number
    );

  },


  /* -------------------------------------------------------
     VALIDATE PRODUCT
     ------------------------------------------------------- */

  validate(product) {

    const errors = [];


    if (
      !product.name ||
      !product.name.trim()
    ) {

      errors.push(
        "Product name is required."
      );

    }


    if (
      !product.catalogueId
    ) {

      errors.push(
        "Catalogue is required."
      );

    }


    if (
      product.price <= 0
    ) {

      errors.push(
        "Selling price must be greater than zero."
      );

    }


    if (
      product.mrp > 0 &&
      product.price > product.mrp
    ) {

      errors.push(
        "Selling price cannot be greater than MRP."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     DISCOUNT
     ------------------------------------------------------- */

  getDiscount(product) {

    const mrp =
      this.number(
        product?.mrp
      );

    const price =
      this.number(
        product?.price
      );


    if (
      mrp <= 0 ||
      price >= mrp
    ) {

      return 0;

    }


    return Math.round(

      (
        (mrp - price) /
        mrp
      ) * 100

    );

  },


  /* -------------------------------------------------------
     PRODUCT STATUS
     ------------------------------------------------------- */

  getStatus(product) {

    if (
      product?.outOfStock === true
    ) {

      return "out_of_stock";

    }


    if (
      product?.active === false
    ) {

      return "inactive";

    }


    return "available";

  },


  /* -------------------------------------------------------
     PRICE DISPLAY
     ------------------------------------------------------- */

  getPriceText(product) {

    return (
      "₹" +
      this.number(
        product?.price
      ).toFixed(2)
    );

  },


  /* -------------------------------------------------------
     MRP DISPLAY
     ------------------------------------------------------- */

  getMrpText(product) {

    const mrp =
      this.number(
        product?.mrp
      );


    if (!mrp) {

      return "";

    }


    return (
      "₹" +
      mrp.toFixed(2)
    );

  },


  /* -------------------------------------------------------
     COPY PRODUCT
     ------------------------------------------------------- */

  clone(product) {

    return {

      ...product,

      description:
        product.description || "",

      size:
        product.size || "",

      unit:
        product.unit || ""

    };

  }

};


/* =========================================================
   PUBLIC PRODUCT API
   ========================================================= */

window.AgarwalProductData =
  AgarwalProductData;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:product-data-ready"
  )

);
