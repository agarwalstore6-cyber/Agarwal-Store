/* =========================================================
   AGARWAL STORE
   CODE 18 — CATALOGUE DATA FOUNDATION
   ========================================================= */

const AgarwalCatalogueData = {


  /* -------------------------------------------------------
     CREATE CATALOGUE
     ------------------------------------------------------- */

  create(data = {}) {

    return {

      id:
        data.id ||
        this.createId(),

      name:
        data.name ||
        "",

      image:
        data.image ||
        "",

      active:
        data.active !== false,

      sortOrder:
        this.number(
          data.sortOrder
        ),

      createdAt:
        data.createdAt ||
        null,

      updatedAt:
        data.updatedAt ||
        null

    };

  },


  /* -------------------------------------------------------
     CREATE CATALOGUE ID
     ------------------------------------------------------- */

  createId() {

    return (

      "catalogue_" +

      Date.now().toString(36) +

      "_" +

      Math.random()
        .toString(36)
        .slice(2, 8)

    );

  },


  /* -------------------------------------------------------
     NUMBER CONVERSION
     ------------------------------------------------------- */

  number(value) {

    const number =
      Number(value);


    if (
      !Number.isFinite(number)
    ) {

      return 0;

    }


    return number;

  },


  /* -------------------------------------------------------
     VALIDATE CATALOGUE
     ------------------------------------------------------- */

  validate(catalogue) {

    const errors = [];


    if (
      !catalogue?.name ||
      !catalogue.name.trim()
    ) {

      errors.push(
        "Catalogue name is required."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     ACTIVE CHECK
     ------------------------------------------------------- */

  isActive(catalogue) {

    return (
      catalogue?.active !== false
    );

  },


  /* -------------------------------------------------------
     SORT CATALOGUES
     ------------------------------------------------------- */

  sort(catalogues = []) {

    return [...catalogues].sort(

      (first, second) => {

        return (
          this.number(
            first.sortOrder
          ) -

          this.number(
            second.sortOrder
          )
        );

      }

    );

  },


  /* -------------------------------------------------------
     CLONE CATALOGUE
     ------------------------------------------------------- */

  clone(catalogue) {

    return {

      ...catalogue,

      name:
        catalogue?.name || "",

      image:
        catalogue?.image || "",

      active:
        catalogue?.active !== false,

      sortOrder:
        this.number(
          catalogue?.sortOrder
        )

    };

  }

};


/* =========================================================
   PUBLIC CATALOGUE API
   ========================================================= */

window.AgarwalCatalogueData =
  AgarwalCatalogueData;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:catalogue-data-ready"
  )

);
