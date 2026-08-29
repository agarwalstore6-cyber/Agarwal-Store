/* =========================================================
   AGARWAL STORE
   CODE 25 — CATALOGUE / PRODUCT RELATION
   ========================================================= */


const AgarwalCatalogueProducts = {


  /* -------------------------------------------------------
     GET PRODUCTS OF CATALOGUE
     ------------------------------------------------------- */

  getProducts(
    catalogueId,
    products = []
  ) {

    if (!catalogueId) {

      return [];

    }


    return products.filter(

      product =>

        product?.catalogueId ===
        catalogueId &&

        product?.active !== false

    );

  },


  /* -------------------------------------------------------
     GET AVAILABLE PRODUCTS
     ------------------------------------------------------- */

  getAvailableProducts(
    catalogueId,
    products = []
  ) {

    return this.getProducts(
      catalogueId,
      products
    )
    .filter(

      product =>
        product?.outOfStock !== true

    );

  },


  /* -------------------------------------------------------
     GET PRODUCT
     ------------------------------------------------------- */

  getProduct(
    productId,
    products = []
  ) {

    if (!productId) {

      return null;

    }


    return (

      products.find(

        product =>
          product?.id ===
          productId

      ) ||

      null

    );

  },


  /* -------------------------------------------------------
     GET CATALOGUE
     ------------------------------------------------------- */

  getCatalogue(
    catalogueId,
    catalogues = []
  ) {

    if (!catalogueId) {

      return null;

    }


    return (

      catalogues.find(

        catalogue =>
          catalogue?.id ===
          catalogueId

      ) ||

      null

    );

  },


  /* -------------------------------------------------------
     PRODUCTS COUNT
     ------------------------------------------------------- */

  countProducts(
    catalogueId,
    products = []
  ) {

    return this
      .getProducts(
        catalogueId,
        products
      )
      .length;

  },


  /* -------------------------------------------------------
     RELATED PRODUCTS
     ------------------------------------------------------- */

  getRelatedProducts(
    product,
    products = [],
    maximum = 8
  ) {

    if (!product) {

      return [];

    }


    return this

      .getProducts(
        product.catalogueId,
        products
      )

      .filter(

        item =>
          item.id !==
          product.id

      )

      .slice(
        0,
        maximum
      );

  },


  /* -------------------------------------------------------
     CHECK CATALOGUE
     ------------------------------------------------------- */

  hasProducts(
    catalogueId,
    products = []
  ) {

    return (

      this.countProducts(
        catalogueId,
        products
      ) > 0

    );

  },


  /* -------------------------------------------------------
     GROUP PRODUCTS
     ------------------------------------------------------- */

  groupByCatalogue(
    products = []
  ) {

    const groups = {};


    products.forEach(
      product => {

        const id =
          product?.catalogueId;


        if (!id) {

          return;

        }


        if (
          !groups[id]
        ) {

          groups[id] = [];

        }


        groups[id].push(
          product
        );

      }
    );


    return groups;

  }

};


/* =========================================================
   PUBLIC API
   ========================================================= */

window.AgarwalCatalogueProducts =
  AgarwalCatalogueProducts;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:catalogue-products-ready"
  )

);
