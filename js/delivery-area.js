/* =========================================================
   AGARWAL STORE
   CODE 20 — DELIVERY AREA FOUNDATION
   ========================================================= */

const AgarwalDeliveryArea = {


  /* -------------------------------------------------------
     CREATE DELIVERY AREA
     ------------------------------------------------------- */

  create(data = {}) {

    return {

      id:
        data.id ||
        this.createId(),

      name:
        data.name ||
        "",

      type:
        data.type ||
        "circle",

      center: {

        lat:
          this.number(
            data.center?.lat
          ),

        lng:
          this.number(
            data.center?.lng
          )

      },

      radiusKm:
        this.number(
          data.radiusKm
        ),

      polygon:
        Array.isArray(
          data.polygon
        )
          ? data.polygon
          : [],

      active:
        data.active !== false,

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

      "delivery_" +

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
     DISTANCE BETWEEN LOCATIONS
     ------------------------------------------------------- */

  distanceKm(
    first,
    second
  ) {

    if (
      !first ||
      !second
    ) {

      return Infinity;

    }


    const earthRadius =
      6371;


    const toRadians =
      value =>
        value *
        Math.PI /
        180;


    const latDifference =
      toRadians(
        second.lat -
        first.lat
      );


    const lngDifference =
      toRadians(
        second.lng -
        first.lng
      );


    const firstLat =
      toRadians(
        first.lat
      );


    const secondLat =
      toRadians(
        second.lat
      );


    const a =

      Math.sin(
        latDifference / 2
      ) ** 2 +

      Math.cos(
        firstLat
      ) *

      Math.cos(
        secondLat
      ) *

      Math.sin(
        lngDifference / 2
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

  },


  /* -------------------------------------------------------
     POINT INSIDE CIRCLE
     ------------------------------------------------------- */

  isInsideCircle(
    location,
    area
  ) {

    if (
      !location ||
      !area?.center
    ) {

      return false;

    }


    const distance =
      this.distanceKm(

        location,

        area.center

      );


    return (

      distance <=
      this.number(
        area.radiusKm
      )

    );

  },


  /* -------------------------------------------------------
     POINT INSIDE POLYGON
     ------------------------------------------------------- */

  isInsidePolygon(
    location,
    polygon
  ) {

    if (
      !location ||
      !Array.isArray(polygon) ||
      polygon.length < 3
    ) {

      return false;

    }


    const x =
      location.lng;

    const y =
      location.lat;


    let inside = false;


    for (
      let i = 0,
          j = polygon.length - 1;

      i < polygon.length;

      j = i++
    ) {

      const xi =
        polygon[i].lng;

      const yi =
        polygon[i].lat;

      const xj =
        polygon[j].lng;

      const yj =
        polygon[j].lat;


      const intersects =

        (
          yi > y
        ) !==
        (
          yj > y
        ) &&

        x <

        (
          (xj - xi) *
          (y - yi) /
          (yj - yi) +
          xi
        );


      if (
        intersects
      ) {

        inside =
          !inside;

      }

    }


    return inside;

  },


  /* -------------------------------------------------------
     CHECK ONE AREA
     ------------------------------------------------------- */

  isLocationInsideArea(
    location,
    area
  ) {

    if (
      !area ||
      area.active === false
    ) {

      return false;

    }


    if (
      area.type === "polygon"
    ) {

      return this.isInsidePolygon(

        location,

        area.polygon

      );

    }


    return this.isInsideCircle(

      location,

      area

    );

  },


  /* -------------------------------------------------------
     CHECK ALL DELIVERY AREAS
     ------------------------------------------------------- */

  isDeliveryAvailable(
    location,
    areas = []
  ) {

    if (
      !location ||
      !Array.isArray(areas)
    ) {

      return false;

    }


    return areas.some(

      area =>

        this.isLocationInsideArea(
          location,
          area
        )

    );

  },


  /* -------------------------------------------------------
     GET MATCHING AREA
     ------------------------------------------------------- */

  getMatchingArea(
    location,
    areas = []
  ) {

    if (
      !location ||
      !Array.isArray(areas)
    ) {

      return null;

    }


    return (

      areas.find(

        area =>

          this.isLocationInsideArea(
            location,
            area
          )

      ) ||

      null

    );

  },


  /* -------------------------------------------------------
     DELIVERY MESSAGE
     ------------------------------------------------------- */

  getDeliveryMessage(
    location,
    areas = []
  ) {

    const available =
      this.isDeliveryAvailable(
        location,
        areas
      );


    if (available) {

      return (
        "Delivery is available at your location."
      );

    }


    return (
      "Sorry, we are not available here."
    );

  },


  /* -------------------------------------------------------
     VALIDATE AREA
     ------------------------------------------------------- */

  validate(area) {

    const errors = [];


    if (
      !area?.name ||
      !area.name.trim()
    ) {

      errors.push(
        "Delivery area name is required."
      );

    }


    if (
      area?.type === "polygon"
    ) {

      if (
        !Array.isArray(
          area.polygon
        ) ||
        area.polygon.length < 3
      ) {

        errors.push(
          "Polygon needs at least three points."
        );

      }

    } else {

      if (
        !area?.center ||
        !this.number(
          area.center.lat
        ) ||
        !this.number(
          area.center.lng
        )
      ) {

        errors.push(
          "Delivery area center is required."
        );

      }


      if (
        this.number(
          area.radiusKm
        ) <= 0
      ) {

        errors.push(
          "Delivery radius must be greater than zero."
        );

      }

    }


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     CLONE AREA
     ------------------------------------------------------- */

  clone(area) {

    return {

      ...area,

      center: {

        ...(area?.center || {})

      },

      polygon:

        Array.isArray(
          area?.polygon
        )

          ? area.polygon.map(
              point => ({
                ...point
              })
            )

          : []

    };

  }

};


/* =========================================================
   PUBLIC DELIVERY API
   ========================================================= */

window.AgarwalDeliveryArea =
  AgarwalDeliveryArea;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:delivery-area-ready"
  )

);
