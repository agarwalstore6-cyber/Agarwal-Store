/* =========================================================
   AGARWAL STORE
   CODE 38 — CUSTOMER MAP INTEGRATION
   ========================================================= */


const AgarwalCustomerMap = {


  mapObject: null,

  marker: null,

  initialized: false,


  /* -------------------------------------------------------
     INITIALIZE
     ------------------------------------------------------- */

  async init() {

    if (this.initialized) {

      return;

    }


    this.initialized =
      true;


    window.addEventListener(

      "agarwal:customer-profile-ready",

      () => {

        this.prepareMap();

      }

    );


    window.addEventListener(

      "agarwal:customer-phone-verified",

      () => {

        this.prepareMap();

      }

    );

  },


  /* -------------------------------------------------------
     PREPARE MAP
     ------------------------------------------------------- */

  async prepareMap() {

    const container =
      document.getElementById(
        "customerMapPlaceholder"
      );


    if (!container) {

      return;

    }


    if (
      container.dataset.mapReady ===
      "true"
    ) {

      return;

    }


    container.innerHTML = `

      <div
        id="agarwalCustomerMap"
        class="agarwal-customer-map"
      ></div>

      <button
        type="button"
        id="useCurrentLocation"
        class="map-location-button"
      >
        Use my current location
      </button>

      <div
        id="selectedLocationText"
        class="selected-location-text"
      >
        Tap on the map to select your delivery location.
      </div>

    `;


    container.dataset.mapReady =
      "true";


    this.addStyles();


    try {

      this.mapObject =
        await window.AgarwalMap
          ?.createMap(

            document.getElementById(
              "agarwalCustomerMap"
            ),

            {

              lat:
                26.1542,

              lng:
                85.8918,

              zoom:
                14

            }

          );


      if (!this.mapObject) {

        throw new Error(
          "Map system is not ready."
        );

      }


      await window.AgarwalMap
        .addLocationMarker(

          this.mapObject,

          location => {

            this.setLocation(
              location
            );

          }

        );


      document
        .getElementById(
          "useCurrentLocation"
        )
        ?.addEventListener(

          "click",

          () => {

            this.useCurrentLocation();

          }

        );


    } catch (error) {

      console.error(
        "Customer map error:",
        error
      );


      this.setMapMessage(
        "Unable to load map. Please try again."
      );

    }

  },


  /* -------------------------------------------------------
     CURRENT LOCATION
     ------------------------------------------------------- */

  async useCurrentLocation() {

    try {

      this.setMapMessage(
        "Getting your location..."
      );


      const location =
        await window.AgarwalMap
          .getCurrentLocation();


      if (
        this.mapObject?.map
      ) {

        this.mapObject.map
          .setView(

            [
              location.lat,

              location.lng

            ],

            17

          );

      }


      this.setLocation(
        location
      );


    } catch (error) {

      console.error(
        "Current location error:",
        error
      );


      this.setMapMessage(
        "Location permission was not available. Please select the location on the map."
      );

    }

  },


  /* -------------------------------------------------------
     SET LOCATION
     ------------------------------------------------------- */

  setLocation(
    location
  ) {

    if (!location) {

      return;

    }


    const latitude =
      Number(
        location.lat
      );


    const longitude =
      Number(
        location.lng
      );


    if (
      !Number.isFinite(
        latitude
      ) ||
      !Number.isFinite(
        longitude
      )
    ) {

      return;

    }


    const savedLocation = {

      lat:
        latitude,

      lng:
        longitude

    };


    window.AgarwalStore
      .state
      .deliveryLocation =
      savedLocation;


    const text =
      document.getElementById(
        "selectedLocationText"
      );


    if (text) {

      text.textContent =

        "Location selected: " +

        latitude.toFixed(6) +

        ", " +

        longitude.toFixed(6);

    }


    this.reverseGeocode(
      savedLocation
    );


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:customer-location-selected",
        {
          detail: {

            location:
              savedLocation

          }

        }
      )

    );

  },


  /* -------------------------------------------------------
     REVERSE GEOCODING
     ------------------------------------------------------- */

  async reverseGeocode(
    location
  ) {

    if (!location) {

      return;

    }


    try {

      const url =

        "https://nominatim.openstreetmap.org/reverse" +

        "?format=jsonv2" +

        "&lat=" +

        encodeURIComponent(
          location.lat
        ) +

        "&lon=" +

        encodeURIComponent(
          location.lng
        );


      const response =
        await fetch(
          url,
          {
            headers: {

              "Accept":
                "application/json"

            }

          }
        );


      if (!response.ok) {

        return;

      }


      const data =
        await response.json();


      const address =
        data?.address ||
        {};


      this.fillAddress(
        address
      );


    } catch (error) {

      console.info(
        "Address lookup unavailable."
      );

    }

  },


  /* -------------------------------------------------------
     AUTO FILL ADDRESS
     ------------------------------------------------------- */

  fillAddress(
    address
  ) {

    const area =
      address.suburb ||

      address.neighbourhood ||

      address.village ||

      address.town ||

      "";


    const city =
      address.city ||

      address.town ||

      address.municipality ||

      "Darbhanga";


    const pincode =
      address.postcode ||
      "846003";


    const areaInput =
      document.getElementById(
        "customerArea"
      );


    const cityInput =
      document.getElementById(
        "customerCity"
      );


    const pincodeInput =
      document.getElementById(
        "customerPincode"
      );


    if (
      areaInput &&
      area
    ) {

      areaInput.value =
        area;

    }


    if (
      cityInput &&
      city
    ) {

      cityInput.value =
        city;

    }


    if (
      pincodeInput &&
      pincode
    ) {

      pincodeInput.value =
        pincode;

    }


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:address-autofilled",
        {
          detail: {

            address

          }

        }
      )

    );

  },


  /* -------------------------------------------------------
     MAP MESSAGE
     ------------------------------------------------------- */

  setMapMessage(
    message
  ) {

    const text =
      document.getElementById(
        "selectedLocationText"
      );


    if (text) {

      text.textContent =
        message;

    }

  },


  /* -------------------------------------------------------
     GET LOCATION
     ------------------------------------------------------- */

  getLocation() {

    return (

      window.AgarwalStore
        ?.state
        ?.deliveryLocation ||

      null

    );

  },


  /* -------------------------------------------------------
     ADD MAP STYLES
     ------------------------------------------------------- */

  addStyles() {

    if (
      document.getElementById(
        "agarwalCustomerMapStyles"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "agarwalCustomerMapStyles";


    style.textContent = `

      .agarwal-customer-map {

        width:
          100%;

        height:
          260px;

        border-radius:
          16px;

        overflow:
          hidden;

      }


      .map-location-button {

        width:
          100%;

        min-height:
          46px;

        margin-top:
          10px;

        border:
          1px solid #DDE4DE;

        border-radius:
          12px;

        background:
          #FFFFFF;

        color:
          #123D2B;

        font-weight:
          800;

      }


      .selected-location-text {

        margin-top:
          9px;

        color:
          #66736B;

        font-size:
          12px;

        line-height:
          1.4;

      }

    `;


    document.head.appendChild(
      style
    );

  }

};


/* =========================================================
   PUBLIC MAP API
   ========================================================= */

window.AgarwalCustomerMap =
  AgarwalCustomerMap;


/* =========================================================
   INITIALIZE
   ========================================================= */

AgarwalCustomerMap.init();


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:customer-map-ready"
  )

);
