/* =========================================================
   AGARWAL STORE
   CODE 36 — DELIVERY AREA STORAGE
   ========================================================= */


const AgarwalDeliveryAreaStorage = {


  /* -------------------------------------------------------
     COLLECTION
     ------------------------------------------------------- */

  collectionName:
    "deliveryAreas",


  /* -------------------------------------------------------
     GET ALL DELIVERY AREAS
     ------------------------------------------------------- */

  async getAll() {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const areas =
      await window.AgarwalFirestore
        .getCollectionData(

          this.collectionName

        );


    window.AgarwalStore
      .state
      .deliveryAreas =
      areas;


    return areas;

  },


  /* -------------------------------------------------------
     GET ACTIVE DELIVERY AREAS
     ------------------------------------------------------- */

  async getActive() {

    const areas =
      await this.getAll();


    return areas.filter(

      area =>
        area?.active !== false

    );

  },


  /* -------------------------------------------------------
     GET ONE AREA
     ------------------------------------------------------- */

  async get(
    areaId
  ) {

    if (!areaId) {

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

          areaId

        )

    );

  },


  /* -------------------------------------------------------
     ADD AREA
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


    const area =
      window.AgarwalDeliveryArea
        ?.create(
          data
        ) ||
      data;


    const validation =
      window.AgarwalDeliveryArea
        ?.validate(
          area
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

          area

        );


    const saved = {

      ...area,

      id:
        id

    };


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:delivery-area-added",
        {
          detail: {
            area:
              saved
          }
        }
      )

    );


    return saved;

  },


  /* -------------------------------------------------------
     UPDATE AREA
     ------------------------------------------------------- */

  async update(
    areaId,
    changes
  ) {

    if (!areaId) {

      throw new Error(
        "Delivery area ID is required."
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

        areaId,

        changes

      );


    const updated =
      await this.get(
        areaId
      );


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:delivery-area-updated",
        {
          detail: {
            area:
              updated
          }
        }
      )

    );


    return updated;

  },


  /* -------------------------------------------------------
     DELETE AREA
     ------------------------------------------------------- */

  async remove(
    areaId
  ) {

    if (!areaId) {

      throw new Error(
        "Delivery area ID is required."
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

        areaId

      );


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:delivery-area-deleted",
        {
          detail: {
            areaId
          }
        }
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     ENABLE AREA
     ------------------------------------------------------- */

  async enable(
    areaId
  ) {

    return this.update(

      areaId,

      {

        active:
          true

      }

    );

  },


  /* -------------------------------------------------------
     DISABLE AREA
     ------------------------------------------------------- */

  async disable(
    areaId
  ) {

    return this.update(

      areaId,

      {

        active:
          false

      }

    );

  }

};


/* =========================================================
   PUBLIC DELIVERY AREA STORAGE API
   ========================================================= */

window.AgarwalDeliveryAreaStorage =
  AgarwalDeliveryAreaStorage;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:delivery-area-storage-ready"
  )

);
