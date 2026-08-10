let myChart = null;

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
function navInit() {
  listTarget.forEach((list) => {
    list.addEventListener("click", (e) => {
      removeActiveSide();
      list.classList.toggle("selected");
      viewName(list.dataset.target);
      activeChecker();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  navInit();
  viewName("dashboard");
  renderChart();
  loadElectricityData();
});

/* SAVE BUTTON LOGIC */
const electricityButton = document.querySelector(".electricity-save");
const electricityForm = document.getElementById("elec-form");

electricityForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const result = {
    amount: document.getElementById("electricity-amount").value.trim(),
    date: document.getElementById("electricity-date").value.trim(),
    note: document.getElementById("electricity-note").value.trim(),
  };
  await window.electronAPI.addElectricity(result);
  loadElectricityData();
  electricityForm.reset();
});

/* RENDER VALUES */
const totalValueElectricity = document.querySelector(
  ".electricity-expense-value",
);
const totalValueElectricityMain = document.querySelector(".electricity-value");
const rateChange = document.querySelector(".electricity-percentage");

async function loadElectricityData() {
  const entries = await window.electronAPI.getElectricity();
  const total = await electricityTotal();
  totalValueElectricity.innerText = "₱" + total;
  totalValueElectricityMain.innerText = "₱" + total;

  const changeRate = change(entries);
  rateChange.innerText = changeRate;
  entryAppending(entries);
}

function createElectricalRows(data) {
  const col1 = document.createElement("p");
  const col2 = document.createElement("p");
  const col3 = document.createElement("p");

  col1.classList.add("valuedate");
  col2.classList.add("valueamount");
  col3.classList.add("valuenote");

  if (data.date) {
    col1.innerText = data.date;
  } else if (data.date === "") {
    col1.innerText = "----";
  } else {
    col1.innerText = "----";
  }
  if (data.amount) {
    col2.innerText = "₱" + data.amount;
  } else if (data.amount === "") {
  } else {
    col2.innerText = "----";
  }

  if (data.note) {
    col3.innerText = data.note;
  } else if (data.note === "") {
    col3.innerText = "----";
  } else {
    col3.innerText = "----";
  }

  const row = document.createElement("div");
  row.classList.add("row-value");

  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  return row;
}
function createElectricalActionButtons() {
  const col1 = document.createElement("button");
  const col2 = document.createElement("button");

  col1.classList.add("button", "edit");
  col2.classList.add("button", "del");

  col1.innerText = "Edit";
  col2.innerText = "Delete";
  const row = document.createElement("div");
  row.classList.add("action-buttons");

  row.appendChild(col1);
  row.appendChild(col2);
  return row;
}
/* APPENDING */
function entryAppending(entries) {
  const rower = document.querySelector(".row");
  const rowContainer = document.getElementById("elec-row");
  rowContainer.innerHTML = "";
  entries.forEach((rows) => {
    const flexContainerRow = document.createElement("div");
    flexContainerRow.classList.add("rowContainer");
    /* Row */
    const row = createElectricalRows(rows);
    flexContainerRow.appendChild(row);
    /* Button */
    const buttons = createElectricalActionButtons();
    flexContainerRow.appendChild(buttons);

    rowContainer.appendChild(flexContainerRow);
  });
}
/* Calculations */
/* ELECTRICITY */
async function electricityTotal() {
  const entries = await window.electronAPI.getElectricity();
  const total = entries.reduce((sum, row) => {
    return sum + Number(row.amount);
  }, 0);
  return total;
}
function change(entries) {
  if (entries.length < 2) {
    return "0%";
  }
  const x1 = entries[entries.length - 2].amount;
  const x2 = entries[entries.length - 1].amount;
  const rate = ((x1 - x2) / x1) * 100;
  return Math.abs(rate).toFixed(0) + "%";
}

function pagination(entries, page) {
  const pageSize = 5;
  const totalPages = Math.ceil(entries.length / pageSize);

  const currentPage = page; 
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageEntries = entries.slice(start, end);
  return pageEntries;
}
