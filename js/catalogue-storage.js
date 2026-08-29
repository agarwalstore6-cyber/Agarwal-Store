/* =========================================================
   AGARWAL STORE
   CODE 33 — CATALOGUE STORAGE
   ========================================================= */


const AgarwalCatalogueStorage = {


  /* -------------------------------------------------------
     COLLECTION
     ------------------------------------------------------- */

  collectionName:
    "catalogues",


  /* -------------------------------------------------------
     GET ALL CATALOGUES
     ------------------------------------------------------- */

  async getAll() {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const catalogues =
      await window.AgarwalFirestore
        .getCollectionData(

          this.collectionName

        );


    const sorted =
      window.AgarwalCatalogueData
        ?.sort(
          catalogues
        ) ||
      catalogues;


    window.AgarwalStore
      .state
      .catalogues =
      sorted;


    return sorted;

  },


  /* -------------------------------------------------------
     GET ACTIVE CATALOGUES
     ------------------------------------------------------- */

  async getActive() {

    const catalogues =
      await this.getAll();


    return catalogues.filter(

      catalogue =>
        catalogue?.active !== false

    );

  },


  /* -------------------------------------------------------
     GET ONE CATALOGUE
     ------------------------------------------------------- */

  async get(
    catalogueId
  ) {

    if (!catalogueId) {

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

          catalogueId

        )

    );

  },


  /* -------------------------------------------------------
     ADD CATALOGUE
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


    const catalogue =
      window.AgarwalCatalogueData
        ?.create(
          data
        ) ||
      data;


    const validation =
      window.AgarwalCatalogueData
        ?.validate(
          catalogue
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

          catalogue

        );


    const saved = {

      ...catalogue,

      id:
        id

    };


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:catalogue-added",
        {
          detail: {
            catalogue:
              saved
          }
        }
      )

    );


    return saved;

  },


  /* -------------------------------------------------------
     UPDATE CATALOGUE
     ------------------------------------------------------- */

  async update(
    catalogueId,
    changes
  ) {

    if (!catalogueId) {

      throw new Error(
        "Catalogue ID is required."
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

        catalogueId,

        changes

      );


    const updated =
      await this.get(
        catalogueId
      );


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:catalogue-updated",
        {
          detail: {
            catalogue:
              updated
          }
        }
      )

    );


    return updated;

  },


  /* -------------------------------------------------------
     DELETE CATALOGUE
     ------------------------------------------------------- */

  async remove(
    catalogueId
  ) {

    if (!catalogueId) {

      throw new Error(
        "Catalogue ID is required."
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

        catalogueId

      );


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:catalogue-deleted",
        {
          detail: {
            catalogueId
          }
        }
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     ENABLE CATALOGUE
     ------------------------------------------------------- */

  async enable(
    catalogueId
  ) {

    return this.update(

      catalogueId,

      {

        active:
          true

      }

    );

  },


  /* -------------------------------------------------------
     DISABLE CATALOGUE
     ------------------------------------------------------- */

  async disable(
    catalogueId
  ) {

    return this.update(

      catalogueId,

      {

        active:
          false

      }

    );

  },


  /* -------------------------------------------------------
     CHANGE ORDER
     ------------------------------------------------------- */

  async setSortOrder(
    catalogueId,
    sortOrder
  ) {

    const order =
      Number(
        sortOrder
      );


    if (
      !Number.isFinite(
        order
      )
    ) {

      throw new Error(
        "Invalid catalogue order."
      );

    }


    return this.update(

      catalogueId,

      {

        sortOrder:
          order

      }

    );

  }

};


/* =========================================================
   PUBLIC CATALOGUE STORAGE API
   ========================================================= */

window.AgarwalCatalogueStorage =
  AgarwalCatalogueStorage;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:catalogue-storage-ready"
  )

);
