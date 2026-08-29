/* =========================================================
   AGARWAL STORE
   CODE 28 — CUSTOMER PROFILE STORAGE
   ========================================================= */


const AgarwalCustomerStorage = {


  /* -------------------------------------------------------
     COLLECTION
     ------------------------------------------------------- */

  collectionName:
    "customers",


  /* -------------------------------------------------------
     SAVE CUSTOMER
     ------------------------------------------------------- */

  async save(
    profile
  ) {

    if (!profile?.uid) {

      throw new Error(
        "Customer ID is required."
      );

    }


    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const customer =
      window.AgarwalCustomerData
        ?.create(profile) ||
      profile;


    await window.AgarwalFirestore
      .setDocument(

        this.collectionName,

        customer.uid,

        customer

      );


    window.AgarwalStore
      .state
      .currentUser =
      customer;


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:customer-saved",
        {
          detail: {
            customer
          }
        }
      )

    );


    return customer;

  },


  /* -------------------------------------------------------
     GET CUSTOMER
     ------------------------------------------------------- */

  async get(
    uid
  ) {

    if (!uid) {

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

          uid

        )

    );

  },


  /* -------------------------------------------------------
     UPDATE CUSTOMER
     ------------------------------------------------------- */

  async update(
    uid,
    changes
  ) {

    if (!uid) {

      throw new Error(
        "Customer ID is required."
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

        uid,

        changes

      );


    const updated =
      await this.get(
        uid
      );


    window.AgarwalStore
      .state
      .currentUser =
      updated;


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:customer-updated",
        {
          detail: {
            customer:
              updated
          }
        }
      )

    );


    return updated;

  },


  /* -------------------------------------------------------
     BLOCK CUSTOMER
     ------------------------------------------------------- */

  async block(
    uid
  ) {

    return this.update(

      uid,

      {

        status:
          "blocked",

        blocked:
          true

      }

    );

  },


  /* -------------------------------------------------------
     UNBLOCK CUSTOMER
     ------------------------------------------------------- */

  async unblock(
    uid
  ) {

    return this.update(

      uid,

      {

        status:
          "active",

        blocked:
          false

      }

    );

  },


  /* -------------------------------------------------------
     CHECK BLOCKED
     ------------------------------------------------------- */

  async isBlocked(
    uid
  ) {

    const customer =
      await this.get(
        uid
      );


    if (!customer) {

      return false;

    }


    return (

      customer.blocked === true ||

      customer.status ===
        "blocked"

    );

  }

};


/* =========================================================
   PUBLIC CUSTOMER STORAGE API
   ========================================================= */

window.AgarwalCustomerStorage =
  AgarwalCustomerStorage;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:customer-storage-ready"
  )

);
