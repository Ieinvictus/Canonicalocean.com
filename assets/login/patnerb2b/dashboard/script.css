/* =========================================================
   CANONICAL OCEAN
   DASHBOARD
   NEW USER = EMPTY STATE
   REAL DATA = LATER FROM CATALYST / FIREBASE
========================================================= */


/* =========================================================
   EMPTY DASHBOARD DATA
========================================================= */

const dashboardData = {

  partner: {
    name: "",
    partnerId: "",
    status: ""
  },

  summary: {
    activeOrders: 0,
    pendingQuotes: 0,
    outstanding: "",
    deliveries: 0
  },

  orders: []

};


/* =========================================================
   LOAD PARTNER INFORMATION
========================================================= */

function loadPartnerData() {

  const partnerName =
    document.getElementById("partnerName");


  if (partnerName) {

    partnerName.textContent =
      dashboardData.partner.name || "";

  }


  const partnerId =
    document.getElementById("partnerId");


  if (partnerId) {

    partnerId.textContent =
      dashboardData.partner.partnerId || "";

  }


  const partnerStatus =
    document.getElementById("partnerStatus");


  if (partnerStatus) {

    partnerStatus.textContent =
      dashboardData.partner.status || "";

  }

}


/* =========================================================
   LOAD SUMMARY
========================================================= */

function loadSummaryData() {

  const activeOrders =
    document.getElementById("activeOrders");

  const pendingQuotes =
    document.getElementById("pendingQuotes");

  const outstandingAmount =
    document.getElementById("outstandingAmount");

  const upcomingDeliveries =
    document.getElementById("upcomingDeliveries");


  if (activeOrders) {

    activeOrders.textContent =
      dashboardData.summary.activeOrders
        ? String(
            dashboardData.summary.activeOrders
          ).padStart(2, "0")
        : "—";

  }


  if (pendingQuotes) {

    pendingQuotes.textContent =
      dashboardData.summary.pendingQuotes
        ? String(
            dashboardData.summary.pendingQuotes
          ).padStart(2, "0")
        : "—";

  }


  if (outstandingAmount) {

    outstandingAmount.textContent =
      dashboardData.summary.outstanding ||
      "—";

  }


  if (upcomingDeliveries) {

    upcomingDeliveries.textContent =
      dashboardData.summary.deliveries
        ? String(
            dashboardData.summary.deliveries
          ).padStart(2, "0")
        : "—";

  }

}


/* =========================================================
   EMPTY STATE HELPER
========================================================= */

function showEmptyState(
  container,
  title,
  message
) {

  if (!container) {
    return;
  }


  container.innerHTML = `
    <div class="dashboard-empty-state">

      <div class="dashboard-empty-icon">
        <i class="fa-regular fa-folder-open"></i>
      </div>

      <h3>
        ${title}
      </h3>

      <p>
        ${message}
      </p>

    </div>
  `;

}


/* =========================================================
   LOAD ORDERS
========================================================= */

function loadOrders() {

  const ordersContainer =
    document.getElementById(
      "ordersList"
    );


  if (!ordersContainer) {
    return;
  }


  /*
    New user = no orders.
  */

  if (
    !dashboardData.orders ||
    dashboardData.orders.length === 0
  ) {

    showEmptyState(
      ordersContainer,
      "No orders yet",
      "Your orders will appear here once you place your first order."
    );

    return;

  }


  ordersContainer.innerHTML =
    dashboardData.orders
      .map(order => {

        return `
          <div class="order-item">

            <div>
              <strong>
                ${order.id}
              </strong>

              <span>
                ${order.product}
              </span>
            </div>

            <div>
              <strong>
                ${order.amount}
              </strong>

              <span>
                ${order.date}
              </span>
            </div>

            <span class="order-status">
              ${order.status}
            </span>

          </div>
        `;

      })
      .join("");

}


/* =========================================================
   DASHBOARD NAVIGATION
========================================================= */

const dashboardOpenButtons =
  document.querySelectorAll(
    "[data-dashboard-open]"
  );


dashboardOpenButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const section =
          button.dataset.dashboardOpen;


        if (
          typeof openSection === "function"
        ) {

          openSection(section);

        }

      }
    );

  }
);


/* =========================================================
   FUTURE CATALYST API
========================================================= */

/*
  Later this function will replace
  dashboardData with real data.

  IMPORTANT:

  The browser should NOT contain
  Zoho/Catalyst secret keys.

  Use a secure backend endpoint.

  Example:

  async function fetchDashboardData() {

    const response =
      await fetch(
        "/api/dashboard"
      );

    if (!response.ok) {

      throw new Error(
        "Unable to load dashboard data."
      );

    }

    return await response.json();

  }
*/


/* =========================================================
   INITIALIZE
========================================================= */

function initializeDashboard() {

  loadPartnerData();

  loadSummaryData();

  loadOrders();

}


if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
  );

} else {

  initializeDashboard();

        }
