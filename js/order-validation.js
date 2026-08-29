/* =========================================================
   AGARWAL STORE
   CODE 27 — ORDER VALIDATION FOUNDATION
   ========================================================= */


const AgarwalOrderValidation = {


  /* -------------------------------------------------------
     VALIDATE CART
     ------------------------------------------------------- */

  validateCart(cart = []) {

    const errors = [];


    if (!Array.isArray(cart)) {

      errors.push(
        "Cart is not valid."
      );

      return {
        valid: false,
        errors
      };

    }


    if (cart.length === 0) {

      errors.push(
        "Your cart is empty."
      );

    }


    cart.forEach(
      item => {

        if (
          !item?.productId
        ) {

          errors.push(
            "A product in the cart is invalid."
          );

        }


        if (
          Number(item?.quantity || 0) < 1
        ) {

          errors.push(
            "Product quantity is invalid."
          );

        }


        if (
          item?.outOfStock === true
        ) {

          errors.push(
            (
              item.name ||
              "A product"
            ) +
            " is out of stock."
          );

        }

      }
    );


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     VALIDATE MINIMUM ORDER
     ------------------------------------------------------- */

  validateMinimumOrder(
    total
  ) {

    const minimum =
      Number(
        window.AgarwalConfig
          ?.delivery
          ?.minimumOrder ??
        99
      );


    const amount =
      Number(
        total || 0
      );


    if (
      amount < minimum
    ) {

      return {

        valid: false,

        message:
          "Sorry, minimum order amount is ₹" +
          minimum +
          "."

      };

    }


    return {

      valid: true,

      message: ""

    };

  },


  /* -------------------------------------------------------
     VALIDATE CUSTOMER
     ------------------------------------------------------- */

  validateCustomer(
    customer
  ) {

    const errors = [];


    if (
      !customer
    ) {

      errors.push(
        "Please create your profile first."
      );

      return {

        valid: false,

        errors

      };

    }


    if (
      !customer.uid
    ) {

      errors.push(
        "Customer account is missing."
      );

    }


    if (
      !customer.name ||
      !customer.name.trim()
    ) {

      errors.push(
        "Customer name is required."
      );

    }


    if (
      !customer.phone ||
      !customer.phone.trim()
    ) {

      errors.push(
        "Customer phone number is required."
      );

    }


    if (
      customer.phoneVerified !== true
    ) {

      errors.push(
        "Please verify your phone number."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     VALIDATE ADDRESS
     ------------------------------------------------------- */

  validateAddress(
    delivery
  ) {

    const errors = [];


    if (
      !delivery
    ) {

      errors.push(
        "Delivery address is required."
      );

      return {

        valid: false,

        errors

      };

    }


    if (
      !delivery.city
    ) {

      errors.push(
        "City is required."
      );

    }


    if (
      !delivery.pincode
    ) {

      errors.push(
        "PIN code is required."
      );

    }


    if (
      !delivery.location ||
      !Number.isFinite(
        Number(
          delivery.location.lat
        )
      ) ||
      !Number.isFinite(
        Number(
          delivery.location.lng
        )
      )
    ) {

      errors.push(
        "Please select your delivery location on the map."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors

    };

  },


  /* -------------------------------------------------------
     VALIDATE DELIVERY AREA
     ------------------------------------------------------- */

  validateDeliveryArea(
    location,
    areas = []
  ) {

    if (
      !location
    ) {

      return {

        valid: false,

        message:
          "Delivery location is required."

      };

    }


    if (
      !window.AgarwalDeliveryArea
    ) {

      return {

        valid: false,

        message:
          "Delivery area system is not ready."

      };

    }


    const available =
      window.AgarwalDeliveryArea
        .isDeliveryAvailable(
          location,
          areas
        );


    if (!available) {

      return {

        valid: false,

        message:
          "Sorry, we are not available here."

      };

    }


    return {

      valid: true,

      message:
        "Delivery is available."

    };

  },


  /* -------------------------------------------------------
     COMPLETE ORDER VALIDATION
     ------------------------------------------------------- */

  validateOrder(
    order,
    deliveryAreas = []
  ) {

    const errors = [];


    const cartResult =
      this.validateCart(
        order?.items || []
      );


    if (
      !cartResult.valid
    ) {

      errors.push(
        ...cartResult.errors
      );

    }


    const minimumResult =
      this.validateMinimumOrder(
        order?.total
      );


    if (
      !minimumResult.valid
    ) {

      errors.push(
        minimumResult.message
      );

    }


    const customerResult =
      this.validateCustomer(
        order?.customer
      );


    if (
      !customerResult.valid
    ) {

      errors.push(
        ...customerResult.errors
      );

    }


    const addressResult =
      this.validateAddress(
        order?.delivery
      );


    if (
      !addressResult.valid
    ) {

      errors.push(
        ...addressResult.errors
      );

    }


    if (
      order?.delivery?.location
    ) {

      const areaResult =
        this.validateDeliveryArea(

          order.delivery.location,

          deliveryAreas

        );


      if (
        !areaResult.valid
      ) {

        errors.push(
          areaResult.message
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
     FIRST ERROR
     ------------------------------------------------------- */

  getFirstError(
    result
  ) {

    if (
      !result ||
      !Array.isArray(
        result.errors
      )
    ) {

      return "";

    }


    return (
      result.errors[0] ||
      ""
    );

  }

};


/* =========================================================
   PUBLIC API
   ========================================================= */

window.AgarwalOrderValidation =
  AgarwalOrderValidation;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:order-validation-ready"
  )

);
