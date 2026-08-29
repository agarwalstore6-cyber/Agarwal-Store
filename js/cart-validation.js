/* =========================================================
   AGARWAL STORE
   CODE 48 — CART VALIDATION
   ========================================================= */


const AgarwalCartValidation = {


  /* -------------------------------------------------------
     GET MINIMUM ORDER
     ------------------------------------------------------- */

  getMinimumOrder() {

    const configured =
      window.AgarwalSettingsRuntime
        ?.getMinimumOrder?.();


    if (
      Number.isFinite(
        Number(configured)
      )
    ) {

      return Number(
        configured
      );

    }


    const config =
      window.AgarwalConfig
        ?.delivery
        ?.minimumOrder;


    return Number(
      config || 99
    );

  },


  /* -------------------------------------------------------
     GET CART
     ------------------------------------------------------- */

  getCart() {

    if (
      window.AgarwalCartDataManager
    ) {

      return window.AgarwalCartDataManager
        .get();

    }


    if (
      window.AgarwalStore
        ?.state
        ?.cart
    ) {

      return window.AgarwalStore
        .state
        .cart;

    }


    return [];

  },


  /* -------------------------------------------------------
     GET TOTAL
     ------------------------------------------------------- */

  getTotal(
    cart = this.getCart()
  ) {

    if (
      !Array.isArray(
        cart
      )
    ) {

      return 0;

    }


    return cart.reduce(

      (
        total,
        item
      ) => {

        const price =
          Number(
            item?.price || 0
          );


        const quantity =
          Number(
            item?.quantity || 0
          );


        return (

          total +

          (
            price *
            quantity
          )

        );

      },

      0

    );

  },


  /* -------------------------------------------------------
     CHECK EMPTY CART
     ------------------------------------------------------- */

  checkEmpty(
    cart = this.getCart()
  ) {

    if (
      !Array.isArray(
        cart
      ) ||
      cart.length === 0
    ) {

      return {

        valid:
          false,

        code:
          "EMPTY_CART",

        message:
          "Your cart is empty."

      };

    }


    return {

      valid:
        true,

      code:
        "OK",

      message:
        ""

    };

  },


  /* -------------------------------------------------------
     CHECK QUANTITIES
     ------------------------------------------------------- */

  checkQuantities(
    cart = this.getCart()
  ) {

    const invalid =
      cart.filter(

        item => {

          const quantity =
            Number(
              item?.quantity
            );


          return (

            !Number.isFinite(
              quantity
            ) ||

            quantity <= 0 ||

            !Number.isInteger(
              quantity
            )

          );

        }

      );


    if (
      invalid.length > 0
    ) {

      return {

        valid:
          false,

        code:
          "INVALID_QUANTITY",

        message:
          "One or more product quantities are invalid."

      };

    }


    return {

      valid:
        true,

      code:
        "OK",

      message:
        ""

    };

  },


  /* -------------------------------------------------------
     CHECK PRODUCT AVAILABILITY
     ------------------------------------------------------- */

  checkAvailability(
    cart = this.getCart()
  ) {

    const products =
      window.AgarwalStore
        ?.state
        ?.products || [];


    if (
      products.length === 0
    ) {

      return {

        valid:
          true,

        code:
          "PRODUCT_DATA_PENDING",

        message:
          ""

      };

    }


    const unavailable = [];


    cart.forEach(

      item => {

        const product =
          products.find(

            current =>
              current?.id ===
              item?.productId

          );


        if (!product) {

          unavailable.push({

            id:
              item?.productId,

            name:
              item?.name || "Product"

          });


          return;

        }


        if (
          product.active === false
        ) {

          unavailable.push({

            id:
              product.id,

            name:
              product.name ||
              item.name ||
              "Product"

          });


          return;

        }


        if (
          product.outOfStock === true
        ) {

          unavailable.push({

            id:
              product.id,

            name:
              product.name ||
              item.name ||
              "Product"

          });

        }

      }

    );


    if (
      unavailable.length > 0
    ) {

      return {

        valid:
          false,

        code:
          "PRODUCT_UNAVAILABLE",

        products:
          unavailable,

        message:
          "One or more products are currently unavailable."

      };

    }


    return {

      valid:
        true,

      code:
        "OK",

      products:
        [],

      message:
        ""

    };

  },


  /* -------------------------------------------------------
     CHECK MINIMUM ORDER
     ------------------------------------------------------- */

  checkMinimumOrder(
    total = this.getTotal()
  ) {

    const minimum =
      this.getMinimumOrder();


    if (
      total < minimum
    ) {

      return {

        valid:
          false,

        code:
          "MINIMUM_ORDER",

        total:
          total,

        minimum:
          minimum,

        remaining:
          Math.max(
            0,
            minimum - total
          ),

        message:

          "Sorry, minimum order amount is ₹" +

          minimum +

          "."

      };

    }


    return {

      valid:
        true,

      code:
        "OK",

      total:
        total,

      minimum:
        minimum,

      remaining:
        0,

      message:
        ""

    };

  },


  /* -------------------------------------------------------
     CHECK CUSTOMER
     ------------------------------------------------------- */

  checkCustomer() {

    const session =
      window.AgarwalCustomerSession;


    if (
      !session
    ) {

      return {

        valid:
          true,

        code:
          "SESSION_PENDING",

        message:
          ""

      };

    }


    if (
      !session.isLoggedIn()
    ) {

      return {

        valid:
          false,

        code:
          "LOGIN_REQUIRED",

        message:
          "Please login first."

      };

    }


    if (
      !session.hasProfile()
    ) {

      return {

        valid:
          false,

        code:
          "PROFILE_REQUIRED",

        message:
          "Please complete your profile first."

      };

    }


    if (
      session.isBlocked()
    ) {

      return {

        valid:
          false,

        code:
          "CUSTOMER_BLOCKED",

        message:
          "Your account is currently unavailable for placing orders."

      };

    }


    return {

      valid:
        true,

      code:
        "OK",

      message:
        ""

    };

  },


  /* -------------------------------------------------------
     CHECK DELIVERY
     ------------------------------------------------------- */

  checkDelivery() {

    const delivery =
      window.AgarwalDeliveryCheck;


    if (
      !delivery
    ) {

      return {

        valid:
          true,

        code:
          "DELIVERY_CHECK_PENDING",

        message:
          ""

      };

    }


    if (
      !delivery.canDeliver()
    ) {

      return {

        valid:
          false,

        code:
          "DELIVERY_UNAVAILABLE",

        message:
          delivery.getMessage()

      };

    }


    return {

      valid:
        true,

      code:
        "OK",

      message:
        ""

    };

  },


  /* -------------------------------------------------------
     COMPLETE VALIDATION
     ------------------------------------------------------- */

  validate(
    cart = this.getCart()
  ) {

    const checks = [

      this.checkEmpty(
        cart
      ),

      this.checkQuantities(
        cart
      ),

      this.checkAvailability(
        cart
      ),

      this.checkMinimumOrder(
        this.getTotal(
          cart
        )
      ),

      this.checkCustomer(),

      this.checkDelivery()

    ];


    const failed =
      checks.find(

        result =>
          result.valid === false

      );


    if (
      failed
    ) {

      window.dispatchEvent(

        new CustomEvent(
          "agarwal:cart-validation-failed",
          {
            detail:
              failed
          }
        )

      );


      return failed;

    }


    const success = {

      valid:
        true,

      code:
        "OK",

      total:
        this.getTotal(
          cart
        ),

      minimum:
        this.getMinimumOrder(),

      message:
        "Cart is ready for order."

    };


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:cart-validation-success",
        {
          detail:
            success
        }
      )

    );


    return success;

  },


  /* -------------------------------------------------------
     CAN PLACE ORDER
     ------------------------------------------------------- */

  canPlaceOrder() {

    return Boolean(

      this.validate()
        .valid

    );

  }

};


/* =========================================================
   PUBLIC CART VALIDATION API
   ========================================================= */

window.AgarwalCartValidation =
  AgarwalCartValidation;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:cart-validation-ready"
  )

);
