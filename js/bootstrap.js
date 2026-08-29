/* =========================================================
   AGARWAL STORE
   CODE 7 — MODULE BOOTSTRAP
   ========================================================= */

window.AgarwalModules =
  window.AgarwalModules || {};


/* =========================================================
   MODULE REGISTRATION
   ========================================================= */

window.registerAgarwalModule =
  function (name, module) {

    if (!name || !module) {
      return;
    }

    window.AgarwalModules[name] =
      module;

  };


/* =========================================================
   MODULE READY CHECK
   ========================================================= */

window.isAgarwalModuleReady =
  function (name) {

    return Boolean(
      window.AgarwalModules[name]
    );

  };


/* =========================================================
   EVENT BUS
   ========================================================= */

window.AgarwalEvents = {

  emit(name, detail = {}) {

    window.dispatchEvent(
      new CustomEvent(
        name,
        { detail }
      )
    );

  },

  on(name, callback) {

    window.addEventListener(
      name,
      event => {

        callback(
          event.detail
        );

      }
    );

  }

};


/* =========================================================
   FOUNDATION READY
   ========================================================= */

window.AgarwalEvents.emit(
  "agarwal:bootstrap-ready"
);
