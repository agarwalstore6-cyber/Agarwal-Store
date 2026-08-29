/* =========================================================
   AGARWAL STORE
   CODE 63 — CATALOGUE UI RENDERER
   ========================================================= */


const AgarwalCatalogueUI = {


  /* -------------------------------------------------------
     GET GRID
     ------------------------------------------------------- */

  getGrid() {

    return document.getElementById(
      "catalogueGrid"
    );

  },


  /* -------------------------------------------------------
     ESCAPE HTML
     ------------------------------------------------------- */

  escape(
    value
  ) {

    return String(
      value ?? ""
    )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

  },


  /* -------------------------------------------------------
     CREATE CARD
     ------------------------------------------------------- */

  createCard(
    catalogue,
    index
  ) {

    const id =
      this.escape(
        catalogue?.id ||
        `catalogue-${index}`
      );


    const name =
      this.escape(
        catalogue?.name ||
        catalogue?.title ||
        "Catalogue"
      );


    const description =
      this.escape(
        catalogue?.description ||
        "Browse products"
      );


    const image =
      this.escape(
        catalogue?.image ||
        catalogue?.imageUrl ||
        ""
      );


    const imageHTML =

      image

        ? `
          <img
            src="${image}"
            alt="${name}"
            loading="lazy"
          >
        `

        : `

          <div class="catalogue-placeholder">
            🛍️
          </div>

        `;


    return `

      <article
        class="catalogue-card"
        data-catalogue-id="${id}"
      >

        <div class="catalogue-image">

          ${imageHTML}

        </div>


        <div class="catalogue-info">

          <h3>
            ${name}
          </h3>

          <p>
            ${description}
          </p>


          <button
            type="button"
            class="catalogue-open"
            data-catalogue-id="${id}"
          >

            View products

          </button>

        </div>

      </article>

    `;

  },


  /* -------------------------------------------------------
     RENDER EMPTY
     ------------------------------------------------------- */

  renderEmpty() {

    const grid =
      this.getGrid();


    if (!grid) {

      return;

    }


    grid.innerHTML = `

      <div class="empty">

        🛍️

        <h3>
          Categories coming soon
        </h3>

        <p>
          Products and catalogues will appear here.
        </p>

      </div>

    `;

  },


  /* -------------------------------------------------------
     RENDER CATALOGUES
     ------------------------------------------------------- */

  render(
    catalogues = []
  ) {

    const grid =
      this.getGrid();


    if (!grid) {

      return false;

    }


    if (
      !Array.isArray(
        catalogues
      ) ||
      catalogues.length === 0
    ) {

      this.renderEmpty();

      return true;

    }


    grid.innerHTML =
      catalogues
        .map(

          (
            catalogue,
            index
          ) =>

            this.createCard(
              catalogue,
              index
            )

        )
        .join("");


    this.bindEvents();


    return true;

  },


  /* -------------------------------------------------------
     OPEN CATALOGUE
     ------------------------------------------------------- */

  open(
    catalogueId
  ) {

    if (
      !catalogueId
    ) {

      return;

    }


    window.AgarwalStore
      .state
      .currentCatalogue =
      catalogueId;


    window.dispatchEvent(

      new CustomEvent(
        "agarwal:open-catalogue",
        {
          detail: {

            catalogueId

          }

        }
      )

    );

  },


  /* -------------------------------------------------------
     BUTTON EVENTS
     ------------------------------------------------------- */

  bindEvents() {

    const buttons =
      document.querySelectorAll(
        ".catalogue-open"
      );


    buttons.forEach(

      button => {

        button.addEventListener(

          "click",

          () => {

            this.open(

              button.dataset
                .catalogueId

            );

          }

        );

      }

    );

  },


  /* -------------------------------------------------------
     LOAD FROM STORE STATE
     ------------------------------------------------------- */

  renderFromState() {

    const catalogues =

      window.AgarwalStore
        ?.state
        ?.catalogues || [];


    return this.render(
      catalogues
    );

  }

};


/* =========================================================
   BASIC CATALOGUE CARD STYLES
   ========================================================= */

const catalogueStyle =
  document.createElement(
    "style"
  );


catalogueStyle.textContent = `

  .catalogue-card {

    overflow:
      hidden;

    border:
      1px solid #e1e9e4;

    border-radius:
      20px;

    background:
      white;

    box-shadow:
      0 8px 24px rgba(18,61,43,.06);

  }


  .catalogue-image {

    width:
      100%;

    aspect-ratio:
      1 / 1;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    overflow:
      hidden;

    background:
      #eef4ef;

  }


  .catalogue-image img {

    width:
      100%;

    height:
      100%;

    object-fit:
      cover;

  }


  .catalogue-placeholder {

    font-size:
      42px;

  }


  .catalogue-info {

    padding:
      13px;

  }


  .catalogue-info h3 {

    margin:
      0 0 5px;

    font-size:
      16px;

    color:
      #173126;

  }


  .catalogue-info p {

    margin:
      0 0 12px;

    font-size:
      12px;

    color:
      #718179;

  }


  .catalogue-open {

    width:
      100%;

    min-height:
      38px;

    border:
      0;

    border-radius:
      11px;

    background:
      #123D2B;

    color:
      white;

    font-size:
      12px;

    font-weight:
      800;

  }


  .catalogue-open:active {

    transform:
      scale(.97);

  }


  @media (
    min-width: 700px
  ) {

    .catalogue-info {

      padding:
        15px;

    }

  }

`;


document.head.appendChild(
  catalogueStyle
);


/* =========================================================
   PUBLIC API
   ========================================================= */

window.AgarwalCatalogueUI =
  AgarwalCatalogueUI;


/* =========================================================
   READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:catalogue-ui-ready"
  )

);
