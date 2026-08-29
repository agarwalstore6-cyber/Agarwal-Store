/* =========================================================
   AGARWAL STORE
   CODE 31 — BANNER SLIDER ENGINE
   ========================================================= */


const AgarwalBannerSlider = {


  /* -------------------------------------------------------
     STATE
     ------------------------------------------------------- */

  banners: [],

  currentIndex: 0,

  timer: null,

  interval:
    4000,

  running:
    false,


  /* -------------------------------------------------------
     INITIALIZE
     ------------------------------------------------------- */

  init(
    banners = [],
    interval = 4000
  ) {

    this.stop();

    this.banners =
      window.AgarwalBannerData
        ?.getActive(
          banners
        ) ||

      banners.filter(
        banner =>
          banner?.active !== false
      );


    this.interval =
      Number(interval) >= 1000
        ? Number(interval)
        : 4000;


    this.currentIndex = 0;


    if (
      this.banners.length > 1
    ) {

      this.start();

    }


    this.emit();

  },


  /* -------------------------------------------------------
     START
     ------------------------------------------------------- */

  start() {

    this.stop();


    if (
      this.banners.length <= 1
    ) {

      return;

    }


    this.running =
      true;


    this.timer =
      setInterval(
        () => {

          this.next();

        },

        this.interval

      );

  },


  /* -------------------------------------------------------
     STOP
     ------------------------------------------------------- */

  stop() {

    if (
      this.timer
    ) {

      clearInterval(
        this.timer
      );

    }


    this.timer =
      null;

    this.running =
      false;

  },


  /* -------------------------------------------------------
     NEXT
     ------------------------------------------------------- */

  next() {

    if (
      this.banners.length === 0
    ) {

      return null;

    }


    this.currentIndex =

      (
        this.currentIndex +
        1
      ) %

      this.banners.length;


    this.emit();


    return this.getCurrent();

  },


  /* -------------------------------------------------------
     PREVIOUS
     ------------------------------------------------------- */

  previous() {

    if (
      this.banners.length === 0
    ) {

      return null;

    }


    this.currentIndex =

      (
        this.currentIndex -
        1 +
        this.banners.length
      ) %

      this.banners.length;


    this.emit();


    return this.getCurrent();

  },


  /* -------------------------------------------------------
     GET CURRENT BANNER
     ------------------------------------------------------- */

  getCurrent() {

    return (

      this.banners[
        this.currentIndex
      ] ||

      null

    );

  },


  /* -------------------------------------------------------
     GET ALL
     ------------------------------------------------------- */

  getBanners() {

    return [
      ...this.banners
    ];

  },


  /* -------------------------------------------------------
     GO TO INDEX
     ------------------------------------------------------- */

  goTo(index) {

    if (
      this.banners.length === 0
    ) {

      return null;

    }


    const number =
      Number(index);


    if (
      !Number.isInteger(
        number
      )
    ) {

      return this.getCurrent();

    }


    this.currentIndex =

      Math.max(

        0,

        Math.min(

          number,

          this.banners.length - 1

        )

      );


    this.emit();


    return this.getCurrent();

  },


  /* -------------------------------------------------------
     UPDATE BANNERS
     ------------------------------------------------------- */

  update(
    banners = []
  ) {

    const wasRunning =
      this.running;


    this.stop();


    this.banners =

      window.AgarwalBannerData
        ?.getActive(
          banners
        ) ||

      banners.filter(
        banner =>
          banner?.active !== false
      );


    if (
      this.currentIndex >=
      this.banners.length
    ) {

      this.currentIndex =
        0;

    }


    if (
      wasRunning &&
      this.banners.length > 1
    ) {

      this.start();

    }


    this.emit();

  },


  /* -------------------------------------------------------
     SET INTERVAL
     ------------------------------------------------------- */

  setInterval(
    milliseconds
  ) {

    const value =
      Number(
        milliseconds
      );


    if (
      !Number.isFinite(
        value
      ) ||
      value < 1000
    ) {

      return false;

    }


    this.interval =
      value;


    if (
      this.running
    ) {

      this.start();

    }


    return true;

  },


  /* -------------------------------------------------------
     EMIT CURRENT BANNER
     ------------------------------------------------------- */

  emit() {

    window.dispatchEvent(

      new CustomEvent(
        "agarwal:banner-changed",
        {

          detail: {

            banner:
              this.getCurrent(),

            index:
              this.currentIndex,

            total:
              this.banners.length

          }

        }

      )

    );

  }

};


/* =========================================================
   PUBLIC BANNER SLIDER API
   ========================================================= */

window.AgarwalBannerSlider =
  AgarwalBannerSlider;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:banner-slider-ready"
  )

);
