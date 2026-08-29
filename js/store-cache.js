/* =========================================================
   AGARWAL STORE
   CODE 46 — STORE DATA CACHE
   ========================================================= */


const AgarwalStoreCache = {


  data: {

    catalogues: [],

    products: [],

    banners: [],

    deliveryAreas: [],

    settings: null

  },


  updatedAt: {

    catalogues: 0,

    products: 0,

    banners: 0,

    deliveryAreas: 0,

    settings: 0

  },


  /* -------------------------------------------------------
     SET DATA
     ------------------------------------------------------- */

  set(
    key,
    value
  ) {

    if (
      !Object.prototype.hasOwnProperty
        .call(
          this.data,
          key
        )
    ) {

      return false;

    }


    this.data[key] =
      value;


    this.updatedAt[key] =
      Date.now();


    return true;

  },


  /* -------------------------------------------------------
     GET DATA
     ------------------------------------------------------- */

  get(
    key
  ) {

    if (
      !Object.prototype.hasOwnProperty
        .call(
          this.data,
          key
        )
    ) {

      return null;

    }


    return this.data[key];

  },


  /* -------------------------------------------------------
     GET ALL DATA
     ------------------------------------------------------- */

  getAll() {

    return {

      catalogues:
        this.data.catalogues,

      products:
        this.data.products,

      banners:
        this.data.banners,

      deliveryAreas:
        this.data.deliveryAreas,

      settings:
        this.data.settings

    };

  },


  /* -------------------------------------------------------
     UPDATE FROM STORE STATE
     ------------------------------------------------------- */

  sync() {

    const state =
      window.AgarwalStore
        ?.state;


    if (!state) {

      return false;

    }


    this.set(

      "catalogues",

      state.catalogues || []

    );


    this.set(

      "products",

      state.products || []

    );


    this.set(

      "banners",

      state.banners || []

    );


    this.set(

      "deliveryAreas",

      state.deliveryAreas || []

    );


    this.set(

      "settings",

      state.settings || null

    );


    return true;

  },


  /* -------------------------------------------------------
     FIND CATALOGUE
     ------------------------------------------------------- */

  findCatalogue(
    catalogueId
  ) {

    return (

      this.data.catalogues.find(

        catalogue =>
          catalogue?.id ===
          catalogueId

      ) ||

      null

    );

  },


  /* -------------------------------------------------------
     FIND PRODUCT
     ------------------------------------------------------- */

  findProduct(
    productId
  ) {

    return (

      this.data.products.find(

        product =>
          product?.id ===
          productId

      ) ||

      null

    );

  },


  /* -------------------------------------------------------
     GET CATALOGUE PRODUCTS
     ------------------------------------------------------- */

  getCatalogueProducts(
    catalogueId
  ) {

    return this.data.products.filter(

      product =>

        product?.catalogueId ===
        catalogueId &&

        product?.active !== false

    );

  },


  /* -------------------------------------------------------
     GET RELATED PRODUCTS
     ------------------------------------------------------- */

  getRelatedProducts(
    productId,
    maximum = 8
  ) {

    const product =
      this.findProduct(
        productId
      );


    if (!product) {

      return [];

    }


    return this.data.products

      .filter(

        item =>

          item?.catalogueId ===
          product.catalogueId &&

          item?.id !==
          product.id &&

          item?.active !== false

      )

      .slice(

        0,

        maximum

      );

  },


  /* -------------------------------------------------------
     CLEAR CACHE
     ------------------------------------------------------- */

  clear() {

    this.data = {

      catalogues: [],

      products: [],

      banners: [],

      deliveryAreas: [],

      settings: null

    };


    this.updatedAt = {

      catalogues: 0,

      products: 0,

      banners: 0,

      deliveryAreas: 0,

      settings: 0

    };


    return true;

  },


  /* -------------------------------------------------------
     CHECK CACHE
     ------------------------------------------------------- */

  hasData(
    key
  ) {

    const value =
      this.get(
        key
      );


    if (
      Array.isArray(
        value
      )
    ) {

      return value.length > 0;

    }


    return Boolean(
      value
    );

  },


  /* -------------------------------------------------------
     LAST UPDATE
     ------------------------------------------------------- */

  getLastUpdated(
    key
  ) {

    return (

      this.updatedAt[key] ||
      0

    );

  }

};


/* =========================================================
   PUBLIC CACHE API
   ========================================================= */

window.AgarwalStoreCache =
  AgarwalStoreCache;


/* =========================================================
   SYNC WHEN STORE DATA LOADS
   ========================================================= */

window.addEventListener(

  "agarwal:store-data-loaded",

  () => {

    AgarwalStoreCache.sync();

  }

);


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:store-cache-ready"
  )

);
