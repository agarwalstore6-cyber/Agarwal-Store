/* =========================================================
   AGARWAL STORE
   CODE 23 — PWA FOUNDATION
   ========================================================= */


const AgarwalPWA = {


  deferredInstallPrompt: null,


  /* -------------------------------------------------------
     INITIALIZE
     ------------------------------------------------------- */

  init() {

    this.listenForInstall();

    this.listenForAppInstalled();

  },


  /* -------------------------------------------------------
     INSTALL PROMPT
     ------------------------------------------------------- */

  listenForInstall() {

    window.addEventListener(
      "beforeinstallprompt",
      event => {

        event.preventDefault();

        this.deferredInstallPrompt =
          event;


        window.dispatchEvent(

          new CustomEvent(
            "agarwal:pwa-install-available"
          )

        );

      }
    );

  },


  /* -------------------------------------------------------
     APP INSTALLED
     ------------------------------------------------------- */

  listenForAppInstalled() {

    window.addEventListener(
      "appinstalled",
      () => {

        this.deferredInstallPrompt =
          null;


        window.dispatchEvent(

          new CustomEvent(
            "agarwal:pwa-installed"
          )

        );

      }
    );

  },


  /* -------------------------------------------------------
     SHOW INSTALL PROMPT
     ------------------------------------------------------- */

  async install() {

    if (
      !this.deferredInstallPrompt
    ) {

      return false;

    }


    this.deferredInstallPrompt
      .prompt();


    const result =
      await this.deferredInstallPrompt
        .userChoice;


    this.deferredInstallPrompt =
      null;


    return (
      result?.outcome ===
      "accepted"
    );

  },


  /* -------------------------------------------------------
     CHECK STANDALONE MODE
     ------------------------------------------------------- */

  isInstalled() {

    return (

      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||

      window.navigator.standalone === true

    );

  },


  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  getInstallPrompt() {

    return this.deferredInstallPrompt;

  }

};


/* =========================================================
   PUBLIC PWA API
   ========================================================= */

window.AgarwalPWA =
  AgarwalPWA;


/* =========================================================
   INITIALIZE
   ========================================================= */

AgarwalPWA.init();


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:pwa-ready"
  )

);
