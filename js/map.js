/* =========================================================
   AGARWAL STORE
   CODE 14 — FREE MAP FOUNDATION
   ========================================================= */

const AGARWAL_MAP = {

  libraryUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",

  cssUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",

  defaultLocation: {

    lat: 26.1542,

    lng: 85.8918

  }

};


/* =========================================================
   LOAD LEAFLET CSS
   ========================================================= */

function loadMapCSS() {

  if (
    document.getElementById(
      "agarwal-leaflet-css"
    )
  ) {

    return;

  }


  const link =
    document.createElement("link");

  link.id =
    "agarwal-leaflet-css";

  link.rel =
    "stylesheet";

  link.href =
    AGARWAL_MAP.cssUrl;

  document.head.appendChild(
    link
  );

}


/* =========================================================
   LOAD LEAFLET JAVASCRIPT
   ========================================================= */

function loadMapLibrary() {

  return new Promise(
    (resolve, reject) => {

      if (
        window.L
      ) {

        resolve(
          window.L
        );

        return;

      }


      const script =
        document.createElement("script");

      script.src =
        AGARWAL_MAP.libraryUrl;

      script.async =
        true;


      script.onload =
        () => {

          resolve(
            window.L
          );

        };


      script.onerror =
        () => {

          reject(
            new Error(
              "Unable to load map library."
            )
          );

        };


      document.head.appendChild(
        script
      );

    }
  );

}


/* =========================================================
   CREATE MAP
   ========================================================= */

async function createMap(
  element,
  options = {}
) {

  if (!element) {

    throw new Error(
      "Map container not found."
    );

  }


  loadMapCSS();


  const L =
    await loadMapLibrary();


  const latitude =
    options.lat ??
    AGARWAL_MAP.defaultLocation.lat;


  const longitude =
    options.lng ??
    AGARWAL_MAP.defaultLocation.lng;


  const zoom =
    options.zoom ??
    14;


  const map =
    L.map(
      element
    ).setView(
      [
        latitude,
        longitude
      ],
      zoom
    );


  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {

      maxZoom: 19,

      attribution:
        "&copy; OpenStreetMap contributors"

    }
  ).addTo(
    map
  );


  return {

    map,

    leaflet: L

  };

}


/* =========================================================
   ADD SELECTABLE MARKER
   ========================================================= */

async function addLocationMarker(
  mapObject,
  callback
) {

  if (
    !mapObject ||
    !mapObject.map ||
    !mapObject.leaflet
  ) {

    throw new Error(
      "Valid map object is required."
    );

  }


  const {
    map,
    leaflet: L
  } =
    mapObject;


  let marker =
    null;


  map.on(
    "click",
    event => {

      const {
        lat,
        lng
      } =
        event.latlng;


      if (marker) {

        marker.setLatLng(
          [
            lat,
            lng
          ]
        );

      } else {

        marker =
          L.marker(
            [
              lat,
              lng
            ],
            {
              draggable:
                true
            }
          )
          .addTo(
            map
          );

      }


      const location = {

        lat,

        lng

      };


      window.AgarwalStore
        .state
        .deliveryLocation =
        location;


      if (
        typeof callback ===
        "function"
      ) {

        callback(
          location
        );

      }

    }
  );


  return marker;

}


/* =========================================================
   GET CURRENT DEVICE LOCATION
   ========================================================= */

function getCurrentLocation() {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      if (
        !navigator.geolocation
      ) {

        reject(
          new Error(
            "Location is not supported on this device."
          )
        );

        return;

      }


      navigator.geolocation.getCurrentPosition(

        position => {

          resolve({

            lat:
              position.coords.latitude,

            lng:
              position.coords.longitude

          });

        },

        error => {

          reject(
            error
          );

        },

        {

          enableHighAccuracy:
            true,

          timeout:
            10000,

          maximumAge:
            60000

        }

      );

    }
  );

}


/* =========================================================
   DISTANCE BETWEEN TWO LOCATIONS
   ========================================================= */

function distanceInKm(
  first,
  second
) {

  const earthRadius =
    6371;


  const toRadians =
    degrees =>
      degrees *
      Math.PI /
      180;


  const latitudeDifference =
    toRadians(
      second.lat -
      first.lat
    );


  const longitudeDifference =
    toRadians(
      second.lng -
      first.lng
    );


  const a =

    Math.sin(
      latitudeDifference / 2
    ) ** 2 +

    Math.cos(
      toRadians(first.lat)
    ) *

    Math.cos(
      toRadians(second.lat)
    ) *

    Math.sin(
      longitudeDifference / 2
    ) ** 2;


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );


  return (
    earthRadius * c
  );

}


/* =========================================================
   PUBLIC MAP API
   ========================================================= */

window.AgarwalMap = {

  createMap,

  addLocationMarker,

  getCurrentLocation,

  distanceInKm,

  config:
    AGARWAL_MAP

};


/* =========================================================
   MAP READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:map-ready"
  )

);
