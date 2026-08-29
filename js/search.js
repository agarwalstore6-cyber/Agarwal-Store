/* =========================================================
   AGARWAL STORE
   CODE 24 — SEARCH FOUNDATION
   ========================================================= */


const AgarwalSearch = {


  /* -------------------------------------------------------
     SEARCH PRODUCTS
     ------------------------------------------------------- */

  searchProducts(
    products = [],
    query = ""
  ) {

    const searchText =
      String(query || "")
        .trim()
        .toLowerCase();


    if (!searchText) {

      return [...products];

    }


    return products.filter(
      product => {

        const name =
          String(
            product?.name || ""
          ).toLowerCase();


        const description =
          String(
            product?.description || ""
          ).toLowerCase();


        const size =
          String(
            product?.size || ""
          ).toLowerCase();


        const unit =
          String(
            product?.unit || ""
          ).toLowerCase();


        return (

          name.includes(
            searchText
          ) ||

          description.includes(
            searchText
          ) ||

          size.includes(
            searchText
          ) ||

          unit.includes(
            searchText
          )

        );

      }
    );

  },


  /* -------------------------------------------------------
     SEARCH CATALOGUES
     ------------------------------------------------------- */

  searchCatalogues(
    catalogues = [],
    query = ""
  ) {

    const searchText =
      String(query || "")
        .trim()
        .toLowerCase();


    if (!searchText) {

      return [...catalogues];

    }


    return catalogues.filter(
      catalogue => {

        const name =
          String(
            catalogue?.name || ""
          ).toLowerCase();


        return name.includes(
          searchText
        );

      }
    );

  },


  /* -------------------------------------------------------
     SEARCH EVERYTHING
     ------------------------------------------------------- */

  search(
    products = [],
    catalogues = [],
    query = ""
  ) {

    return {

      products:
        this.searchProducts(
          products,
          query
        ),

      catalogues:
        this.searchCatalogues(
          catalogues,
          query
        )

    };

  },


  /* -------------------------------------------------------
     SORT BY RELEVANCE
     ------------------------------------------------------- */

  sortByRelevance(
    products = [],
    query = ""
  ) {

    const searchText =
      String(query || "")
        .trim()
        .toLowerCase();


    if (!searchText) {

      return [...products];

    }


    return [...products].sort(
      (first, second) => {

        const firstName =
          String(
            first?.name || ""
          ).toLowerCase();


        const secondName =
          String(
            second?.name || ""
          ).toLowerCase();


        const firstStarts =
          firstName.startsWith(
            searchText
          );


        const secondStarts =
          secondName.startsWith(
            searchText
          );


        if (
          firstStarts &&
          !secondStarts
        ) {

          return -1;

        }


        if (
          !firstStarts &&
          secondStarts
        ) {

          return 1;

        }


        return 0;

      }
    );

  },


  /* -------------------------------------------------------
     GET SEARCH SUGGESTIONS
     ------------------------------------------------------- */

  suggestions(
    products = [],
    query = "",
    maximum = 8
  ) {

    const results =
      this.searchProducts(
        products,
        query
      );


    return results
      .slice(
        0,
        maximum
      );

  },


  /* -------------------------------------------------------
     CHECK QUERY
     ------------------------------------------------------- */

  hasQuery(query) {

    return Boolean(

      String(query || "")
        .trim()

    );

  }

};


/* =========================================================
   PUBLIC SEARCH API
   ========================================================= */

window.AgarwalSearch =
  AgarwalSearch;


/* =========================================================
   SEARCH EVENT
   ========================================================= */

window.addEventListener(
  "agarwal:search",
  event => {

    const query =
      event.detail?.query || "";


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:search-results",
        {
          detail: {

            query,

            products:
              AgarwalSearch.searchProducts(
                window.AgarwalStore
                  ?.state
                  ?.products || [],

                query

              ),

            catalogues:
              AgarwalSearch.searchCatalogues(
                window.AgarwalStore
                  ?.state
                  ?.catalogues || [],

                query

              )

          }

        }
      )

    );

  }
);


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:search-ready"
  )

);
