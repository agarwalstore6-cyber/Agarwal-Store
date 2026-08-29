/* =========================================================
   AGARWAL STORE
   CODE 40 — FIREBASE ORDER COUNTER
   ========================================================= */


const AgarwalOrderCounter = {


  /* -------------------------------------------------------
     FIRESTORE DOCUMENT
     ------------------------------------------------------- */

  collectionName:
    "counters",

  documentId:
    "orders",


  /* -------------------------------------------------------
     STARTING ORDER NUMBER
     ------------------------------------------------------- */

  startingNumber:
    126,


  /* -------------------------------------------------------
     GET CURRENT NUMBER
     ------------------------------------------------------- */

  async getCurrent() {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const counter =
      await window.AgarwalFirestore
        .getDocumentData(

          this.collectionName,

          this.documentId

        );


    if (
      !counter ||
      !Number.isFinite(
        Number(counter.value)
      )
    ) {

      return this.startingNumber;

    }


    return Number(
      counter.value
    );

  },


  /* -------------------------------------------------------
     GET NEXT NUMBER
     ------------------------------------------------------- */

  async getNext() {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    if (
      typeof
      window.AgarwalFirestore
        .runTransaction !==
      "function"
    ) {

      throw new Error(
        "Firestore transaction system is not ready."
      );

    }


    const nextNumber =

      await window.AgarwalFirestore
        .runTransaction(

          async transaction => {

            const current =
              await transaction.get(

                this.collectionName,

                this.documentId

              );


            let currentValue =
              this.startingNumber;


            if (
              current &&
              Number.isFinite(
                Number(
                  current.value
                )
              )
            ) {

              currentValue =
                Number(
                  current.value
                );

            }


            const next =
              currentValue + 1;


            transaction.set(

              this.collectionName,

              this.documentId,

              {

                value:
                  next,

                updatedAt:
                  new Date().toISOString()

              }

            );


            return next;

          }

        );


    return Number(
      nextNumber
    );

  },


  /* -------------------------------------------------------
     GET FORMATTED NUMBER
     ------------------------------------------------------- */

  async getNextFormatted() {

    const number =
      await this.getNext();


    return (

      "#" +
      String(number)

    );

  },


  /* -------------------------------------------------------
     INITIALIZE COUNTER
     ------------------------------------------------------- */

  async initialize() {

    if (
      !window.AgarwalFirestore
    ) {

      throw new Error(
        "Firestore is not ready."
      );

    }


    const existing =
      await window.AgarwalFirestore
        .getDocumentData(

          this.collectionName,

          this.documentId

        );


    if (existing) {

      return existing;

    }


    const data = {

      value:
        this.startingNumber,

      updatedAt:
        new Date().toISOString()

    };


    await window.AgarwalFirestore
      .setDocument(

        this.collectionName,

        this.documentId,

        data

      );


    return data;

  }

};


/* =========================================================
   PUBLIC ORDER COUNTER API
   ========================================================= */

window.AgarwalOrderCounter =
  AgarwalOrderCounter;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-counter-ready"
  )

);
