/* =========================================================
   AGARWAL STORE
   CODE 34 — PRODUCT STORAGE
   ========================================================= */


const AgarwalProductStorage = {


  /* -------------------------------------------------------
     COLLECTION
     ------------------------------------------------------- */

  collectionName:
    "products",


  /* -------------------------------------------------------
     GET ALL PRODUCTS
     ------------------------------------------------------- */

  async getAll() {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const products =
      await window.AgarwalFirestore
        .getCollectionData(

          this.collectionName

        );


    window.AgarwalStore
      .state
      .products =
      products;


    return products;

  },


  /* -------------------------------------------------------
     GET PRODUCTS BY CATALOGUE
     ------------------------------------------------------- */

  async getByCatalogue(
    catalogueId
  ) {

    if (!catalogueId) {

      return [];

    }


    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const products =
      await window.AgarwalFirestore
        .findDocuments(

          this.collectionName,

          "catalogueId",

          "==",

          catalogueId

        );


    return products.filter(

      product =>
        product?.active !== false

    );

  },


  /* -------------------------------------------------------
     GET ONE PRODUCT
     ------------------------------------------------------- */

  async get(
    productId
  ) {

    if (!productId) {

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

          productId

        )

    );

  },


  /* -------------------------------------------------------
     ADD PRODUCT
     ------------------------------------------------------- */

  async add(
    data
  ) {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const product =
      window.AgarwalProductData
        ?.create(
          data
        ) ||
      data;


    const validation =
      window.AgarwalProductData
        ?.validate(
          product
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


    const id =
      await window.AgarwalFirestore
        .addDocument(

          this.collectionName,

          product

        );


    const saved = {

      ...product,

      id:
        id

    };


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:product-added",
        {
          detail: {
            product:
              saved
          }
        }
      )

    );


    return saved;

  },


  /* -------------------------------------------------------
     UPDATE PRODUCT
     ------------------------------------------------------- */

  async update(
    productId,
    changes
  ) {

    if (!productId) {

      throw new Error(
        "Product ID is required."
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

        productId,

        changes

      );


    const updated =
      await this.get(
        productId
      );


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:product-updated",
        {
          detail: {
            product:
              updated
          }
        }
      )

    );


    return updated;

  },


  /* -------------------------------------------------------
     DELETE PRODUCT
     ------------------------------------------------------- */

  async remove(
    productId
  ) {

    if (!productId) {

      throw new Error(
        "Product ID is required."
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
      .deleteDocument(

        this.collectionName,

        productId

      );


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:product-deleted",
        {
          detail: {
            productId
          }
        }
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     OUT OF STOCK
     ------------------------------------------------------- */

  async setOutOfStock(
    productId,
    value = true
  ) {

    return this.update(

      productId,

      {

        outOfStock:
          value === true

      }

    );

  },


  /* -------------------------------------------------------
     MARK AVAILABLE
     ------------------------------------------------------- */

  async setAvailable(
    productId
  ) {

    return this.update(

      productId,

      {

        outOfStock:
          false

      }

    );

  },


  /* -------------------------------------------------------
     ENABLE PRODUCT
     ------------------------------------------------------- */

  async enable(
    productId
  ) {

    return this.update(

      productId,

      {

        active:
          true

      }

    );

  },


  /* -------------------------------------------------------
     DISABLE PRODUCT
     ------------------------------------------------------- */

  async disable(
    productId
  ) {

    return this.update(

      productId,

      {

        active:
          false

      }

    );

  }

};


/* =========================================================
   PUBLIC PRODUCT STORAGE API
   ========================================================= */

window.AgarwalProductStorage =
  AgarwalProductStorage;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:product-storage-ready"
  )

);
