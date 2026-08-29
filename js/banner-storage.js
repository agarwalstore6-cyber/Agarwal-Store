/* =========================================================
   AGARWAL STORE
   CODE 35 — BANNER STORAGE
   ========================================================= */


const AgarwalBannerStorage = {


  /* -------------------------------------------------------
     COLLECTION
     ------------------------------------------------------- */

  collectionName:
    "banners",


  /* -------------------------------------------------------
     GET ALL BANNERS
     ------------------------------------------------------- */

  async getAll() {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const banners =
      await window.AgarwalFirestore
        .getCollectionData(

          this.collectionName

        );


    const sorted =
      window.AgarwalBannerData
        ?.sort(
          banners
        ) ||
      banners;


    window.AgarwalStore
      .state
      .banners =
      sorted;


    return sorted;

  },


  /* -------------------------------------------------------
     GET ACTIVE BANNERS
     ------------------------------------------------------- */

  async getActive() {

    const banners =
      await this.getAll();


    return (

      window.AgarwalBannerData
        ?.getActive(
          banners
        ) ||

      banners.filter(
        banner =>
          banner?.active !== false
      )

    );

  },


  /* -------------------------------------------------------
     GET ONE BANNER
     ------------------------------------------------------- */

  async get(
    bannerId
  ) {

    if (!bannerId) {

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

          bannerId

        )

    );

  },


  /* -------------------------------------------------------
     ADD BANNER
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


    const banner =
      window.AgarwalBannerData
        ?.create(
          data
        ) ||
      data;


    const validation =
      window.AgarwalBannerData
        ?.validate(
          banner
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

          banner

        );


    const saved = {

      ...banner,

      id:
        id

    };


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:banner-added",
        {
          detail: {
            banner:
              saved
          }
        }
      )

    );


    return saved;

  },


  /* -------------------------------------------------------
     UPDATE BANNER
     ------------------------------------------------------- */

  async update(
    bannerId,
    changes
  ) {

    if (!bannerId) {

      throw new Error(
        "Banner ID is required."
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

        bannerId,

        changes

      );


    const updated =
      await this.get(
        bannerId
      );


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:banner-updated",
        {
          detail: {
            banner:
              updated
          }
        }
      )

    );


    return updated;

  },


  /* -------------------------------------------------------
     DELETE BANNER
     ------------------------------------------------------- */

  async remove(
    bannerId
  ) {

    if (!bannerId) {

      throw new Error(
        "Banner ID is required."
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

        bannerId

      );


    await this.getAll();


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:banner-deleted",
        {
          detail: {
            bannerId
          }
        }
      )

    );


    return true;

  },


  /* -------------------------------------------------------
     ENABLE BANNER
     ------------------------------------------------------- */

  async enable(
    bannerId
  ) {

    return this.update(

      bannerId,

      {

        active:
          true

      }

    );

  },


  /* -------------------------------------------------------
     DISABLE BANNER
     ------------------------------------------------------- */

  async disable(
    bannerId
  ) {

    return this.update(

      bannerId,

      {

        active:
          false

      }

    );

  },


  /* -------------------------------------------------------
     CHANGE BANNER ORDER
     ------------------------------------------------------- */

  async setSortOrder(
    bannerId,
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
        "Invalid banner order."
      );

    }


    return this.update(

      bannerId,

      {

        sortOrder:
          order

      }

    );

  }

};


/* =========================================================
   PUBLIC BANNER STORAGE API
   ========================================================= */

window.AgarwalBannerStorage =
  AgarwalBannerStorage;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:banner-storage-ready"
  )

);
