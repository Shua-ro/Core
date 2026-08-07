let myChart = null; // keep a reference so we can destroy/redraw safely

/* This fucntion handles the toggling of the view class for sections*/
const sectionNames = document.querySelectorAll("[data-view]");
function viewName(sectionName) {
  sectionNames.forEach((section) => {
    section.classList.remove("active");
    if (section.dataset.view === sectionName) {
      section.classList.toggle("active");
    }
  });
}
function renderChart() {
  const canvas = document.getElementById("myChart");
  if (!canvas) return;

  // destroy any previous instance before redrawing
  // (Chart.js throws "Canvas is already in use" otherwise)
  if (myChart) {
    myChart.destroy();
  }

  const categories = [
    "Electricity",
    "Groceries",
    "Pigery",
    "Allowance",
    "Loans",
  ];
  const data_array = [230, 250, 2300, 1500, 1000]; // TODO: replace with SQLite data via IPC
  const categoryColors = [
    "#199e70",
    "#3987e5",
    "#d62b22",
    "#d55181",
    "#c98500",
  ];

  myChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          data: data_array,
          borderColor: "none",
          backgroundColor: categoryColors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      layout: { padding: 30 },
      radius: "100%",
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: window.devicePixelRatio || 1,
    },
  });
}

/* USED FOR CHART RENDERING ONLY */
const dashboardLi = document.querySelector(".dashboard");
function activeChecker() {
  if (dashboardLi.classList.contains("selected")) {
    renderChart();
    console.log("chart is rendered");
  } else {
    if (myChart) {
      myChart.destroy();
    }
  }
}

/* REMOVING AND ADDING HIGHLIGHT IN SIDE PANNEL */
const listTarget = document.querySelectorAll("[data-target]");
function removeActiveSide() {
  listTarget.forEach((list) => {
    list.classList.remove("selected");
  });
}
function navInit(){
  listTarget.forEach((list) => {
    list.addEventListener("click", (e) => {
      removeActiveSide();
      list.classList.toggle("selected");
      viewName(list.dataset.target);
      activeChecker();
    });
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  navInit();
  viewName("dashboard");
  renderChart();
});