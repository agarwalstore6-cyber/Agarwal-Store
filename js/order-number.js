/* =========================================================
   AGARWAL STORE
   CODE 16 — ORDER NUMBER FOUNDATION
   ========================================================= */


/*
 * Temporary local sequence for development.
 *
 * Production order numbering will use Firestore so that
 * multiple customers cannot accidentally receive the same
 * order number.
 */


const AgarwalOrderNumber = {


  /* -------------------------------------------------------
     STORAGE KEY
     ------------------------------------------------------- */

  storageKey:
    "agarwal_store_last_order_number",


  /* -------------------------------------------------------
     STARTING NUMBER
     ------------------------------------------------------- */

  startingNumber:
    126,


  /* -------------------------------------------------------
     GET LAST LOCAL NUMBER
     ------------------------------------------------------- */

  getLastNumber() {

    try {

      const saved =
        localStorage.getItem(
          this.storageKey
        );


      if (
        saved === null
      ) {

        return this.startingNumber;

      }


      const number =
        Number(saved);


      if (
        !Number.isFinite(number)
      ) {

        return this.startingNumber;

      }


      return number;

    } catch (error) {

      return this.startingNumber;

    }

  },


  /* -------------------------------------------------------
     GET NEXT DEVELOPMENT NUMBER
     ------------------------------------------------------- */

  getNextLocalNumber() {

    const nextNumber =
      this.getLastNumber() + 1;


    try {

      localStorage.setItem(

        this.storageKey,

        String(nextNumber)

      );

    } catch (error) {

      console.info(
        "Order number could not be saved locally."
      );

    }


    return nextNumber;

  },


  /* -------------------------------------------------------
     DISPLAY FORMAT
     ------------------------------------------------------- */

  format(number) {

    return "#" +
      String(number);

  },


  /* -------------------------------------------------------
     GET NEXT DISPLAY NUMBER
     ------------------------------------------------------- */

  getNextDisplayNumber() {

    const number =
      this.getNextLocalNumber();


    return this.format(
      number
    );

  }

};


/* =========================================================
   PUBLIC ORDER NUMBER API
   ========================================================= */

window.AgarwalOrderNumber =
  AgarwalOrderNumber;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-number-ready"
  )

);
