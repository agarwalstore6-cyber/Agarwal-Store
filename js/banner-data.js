/* =========================================================
   AGARWAL STORE
   CODE 26 — SPECIAL OFFER BANNER FOUNDATION
   ========================================================= */


const AgarwalBannerData = {


  /* -------------------------------------------------------
     CREATE BANNER
     ------------------------------------------------------- */

  create(data = {}) {

    return {

      id:
        data.id ||
        this.createId(),

      image:
        data.image ||
        "",

      title:
        data.title ||
        "",

      subtitle:
        data.subtitle ||
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
     CREATE ID
     ------------------------------------------------------- */

  createId() {

    return (

      "banner_" +

      Date.now().toString(36) +

      "_" +

      Math.random()
        .toString(36)
        .slice(2, 8)

    );

  },


  /* -------------------------------------------------------
     NUMBER
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
     VALIDATE
     ------------------------------------------------------- */

  validate(banner) {

    const errors = [];


    if (
      !banner?.image
    ) {

      errors.push(
        "Banner image is required."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     ACTIVE BANNERS
     ------------------------------------------------------- */

  getActive(
    banners = []
  ) {

    return banners

      .filter(
        banner =>
          banner?.active !== false
      )

      .sort(
        (first, second) =>

          this.number(
            first.sortOrder
          ) -

          this.number(
            second.sortOrder
          )

      );

  },


  /* -------------------------------------------------------
     SORT BANNERS
     ------------------------------------------------------- */

  sort(
    banners = []
  ) {

    return [...banners].sort(

      (first, second) =>

        this.number(
          first.sortOrder
        ) -

        this.number(
          second.sortOrder
        )

    );

  },


  /* -------------------------------------------------------
     GET NEXT BANNER
     ------------------------------------------------------- */

  getNextIndex(
    currentIndex,
    total
  ) {

    if (
      total <= 0
    ) {

      return 0;

    }


    return (

      (
        currentIndex +
        1
      ) %

      total

    );

  },


  /* -------------------------------------------------------
     CLONE
     ------------------------------------------------------- */

  clone(banner) {

    return {

      ...banner,

      image:
        banner?.image ||
        "",

      title:
        banner?.title ||
        "",

      subtitle:
        banner?.subtitle ||
        "",

      active:
        banner?.active !== false,

      sortOrder:
        this.number(
          banner?.sortOrder
        )

    };

  }

};


/* =========================================================
   PUBLIC BANNER API
   ========================================================= */

window.AgarwalBannerData =
  AgarwalBannerData;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:banner-data-ready"
  )

);
