/* =========================================================
   AGARWAL STORE
   CODE 41 — FIREBASE FIRESTORE WRAPPER
   ========================================================= */


const AgarwalFirestore = {


  /* -------------------------------------------------------
     FIRESTORE INSTANCE
     ------------------------------------------------------- */

  db: null,


  /* -------------------------------------------------------
     INITIALIZE
     ------------------------------------------------------- */

  init() {

    if (
      typeof firebase ===
      "undefined"
    ) {

      throw new Error(
        "Firebase SDK is not loaded."
      );

    }


    if (
      !firebase.firestore
    ) {

      throw new Error(
        "Firebase Firestore SDK is not loaded."
      );

    }


    if (
      firebase.apps &&
      firebase.apps.length === 0
    ) {

      throw new Error(
        "Firebase has not been initialized."
      );

    }


    this.db =
      firebase.firestore();


    return this.db;

  },


  /* -------------------------------------------------------
     GET FIRESTORE
     ------------------------------------------------------- */

  getDB() {

    if (!this.db) {

      this.init();

    }


    return this.db;

  },


  /* -------------------------------------------------------
     GET ONE DOCUMENT
     ------------------------------------------------------- */

  async getDocumentData(
    collectionName,
    documentId
  ) {

    const db =
      this.getDB();


    const snapshot =
      await db
        .collection(
          collectionName
        )
        .doc(
          documentId
        )
        .get();


    if (
      !snapshot.exists
    ) {

      return null;

    }


    return {

      id:
        snapshot.id,

      ...snapshot.data()

    };

  },


  /* -------------------------------------------------------
     GET COLLECTION
     ------------------------------------------------------- */

  async getCollectionData(
    collectionName
  ) {

    const db =
      this.getDB();


    const snapshot =
      await db
        .collection(
          collectionName
        )
        .get();


    const result = [];


    snapshot.forEach(
      document => {

        result.push({

          id:
            document.id,

          ...document.data()

        });

      }
    );


    return result;

  },


  /* -------------------------------------------------------
     ADD DOCUMENT
     ------------------------------------------------------- */

  async addDocument(
    collectionName,
    data
  ) {

    const db =
      this.getDB();


    const document =
      await db
        .collection(
          collectionName
        )
        .add({

          ...data,

          createdAt:
            data.createdAt ||
            firebase.firestore
              .FieldValue
              .serverTimestamp(),

          updatedAt:
            firebase.firestore
              .FieldValue
              .serverTimestamp()

        });


    return document.id;

  },


  /* -------------------------------------------------------
     SET DOCUMENT
     ------------------------------------------------------- */

  async setDocument(
    collectionName,
    documentId,
    data
  ) {

    const db =
      this.getDB();


    await db
      .collection(
        collectionName
      )
      .doc(
        documentId
      )
      .set(

        {

          ...data,

          updatedAt:
            firebase.firestore
              .FieldValue
              .serverTimestamp()

        },

        {

          merge:
            true

        }

      );


    return true;

  },


  /* -------------------------------------------------------
     UPDATE DOCUMENT
     ------------------------------------------------------- */

  async updateDocument(
    collectionName,
    documentId,
    data
  ) {

    const db =
      this.getDB();


    await db
      .collection(
        collectionName
      )
      .doc(
        documentId
      )
      .update({

        ...data,

        updatedAt:
          firebase.firestore
            .FieldValue
            .serverTimestamp()

      });


    return true;

  },


  /* -------------------------------------------------------
     DELETE DOCUMENT
     ------------------------------------------------------- */

  async deleteDocument(
    collectionName,
    documentId
  ) {

    const db =
      this.getDB();


    await db
      .collection(
        collectionName
      )
      .doc(
        documentId
      )
      .delete();


    return true;

  },


  /* -------------------------------------------------------
     FIND DOCUMENTS
     ------------------------------------------------------- */

  async findDocuments(
    collectionName,
    field,
    operator,
    value
  ) {

    const db =
      this.getDB();


    const snapshot =
      await db
        .collection(
          collectionName
        )
        .where(

          field,

          operator,

          value

        )
        .get();


    const result = [];


    snapshot.forEach(
      document => {

        result.push({

          id:
            document.id,

          ...document.data()

        });

      }
    );


    return result;

  },


  /* -------------------------------------------------------
     GET LATEST DOCUMENTS
     ------------------------------------------------------- */

  async getLatestDocuments(
    collectionName,
    field = "createdAt",
    maximum = 50
  ) {

    const db =
      this.getDB();


    const snapshot =
      await db
        .collection(
          collectionName
        )
        .orderBy(
          field,
          "desc"
        )
        .limit(
          Number(maximum) || 50
        )
        .get();


    const result = [];


    snapshot.forEach(
      document => {

        result.push({

          id:
            document.id,

          ...document.data()

        });

      }
    );


    return result;

  },


  /* -------------------------------------------------------
     FIRESTORE TRANSACTION
     ------------------------------------------------------- */

  async runTransaction(
    callback
  ) {

    const db =
      this.getDB();


    return db.runTransaction(

      async transaction => {

        const wrapper = {


          /* -----------------------------------------------
             GET DOCUMENT INSIDE TRANSACTION
             ----------------------------------------------- */

          async get(
            collectionName,
            documentId
          ) {

            const reference =
              db
                .collection(
                  collectionName
                )
                .doc(
                  documentId
                );


            const snapshot =
              await transaction.get(
                reference
              );


            if (
              !snapshot.exists
            ) {

              return null;

            }


            return {

              id:
                snapshot.id,

              ...snapshot.data()

            };

          },


          /* -----------------------------------------------
             SET DOCUMENT
             ----------------------------------------------- */

          set(
            collectionName,
            documentId,
            data
          ) {

            const reference =
              db
                .collection(
                  collectionName
                )
                .doc(
                  documentId
                );


            transaction.set(

              reference,

              {

                ...data,

                updatedAt:
                  firebase.firestore
                    .FieldValue
                    .serverTimestamp()

              },

              {

                merge:
                  true

              }

            );

          },


          /* -----------------------------------------------
             UPDATE DOCUMENT
             ----------------------------------------------- */

          update(
            collectionName,
            documentId,
            data
          ) {

            const reference =
              db
                .collection(
                  collectionName
                )
                .doc(
                  documentId
                );


            transaction.update(

              reference,

              {

                ...data,

                updatedAt:
                  firebase.firestore
                    .FieldValue
                    .serverTimestamp()

              }

            );

          },


          /* -----------------------------------------------
             DELETE DOCUMENT
             ----------------------------------------------- */

          delete(
            collectionName,
            documentId
          ) {

            const reference =
              db
                .collection(
                  collectionName
                )
                .doc(
                  documentId
                );


            transaction.delete(
              reference
            );

          }

        };


        return callback(
          wrapper
        );

      }

    );

  }

};


/* =========================================================
   PUBLIC FIRESTORE API
   ========================================================= */

window.AgarwalFirestore =
  AgarwalFirestore;


/* =========================================================
   INITIALIZE
   ========================================================= */

try {

  AgarwalFirestore.init();

} catch (error) {

  console.info(
    "Firestore initialization will wait for Firebase."
  );

}


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:firestore-ready"
  )

);
