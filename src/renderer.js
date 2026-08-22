import { loadElectricityData, electricityPage } from "./electricity";
import { loadGroceriesData, groceriesPage } from "./groceries";
import { loadAllowanceData, allowancePage } from "./allowance";
import { loadCategories, loadSavingsData, savingsPage } from "./savings";
export let page = 1;

export function renderAll() {
  loadElectricityData(electricityPage);
  loadGroceriesData(groceriesPage);
  loadAllowanceData(allowancePage);
  loadCategories();
  loadSavingsData(savingsPage);
}

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
function renderChart(electricity, groceries, allowance, savings) {
  const canvas = document.getElementById("myChart");
  if (!canvas) return;

  // destroy any previous instance before redrawing
  // (Chart.js throws "Canvas is already in use" otherwise)
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  const categories = ["Electricity", "Groceries", "Allowance", "Savings"];
  const data_array = [electricity, groceries, allowance, savings]; // TODO: replace with SQLite data via IPC
  const categoryColors = ["#199e70", "#3987e5", "#d62b22", "#c98500"];

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
const dashboardMobileLi = document.querySelector(".dashboardMobile");
const dashboardTotal = document.querySelector(".dashboardTotal");
const projectedTotal = document.querySelector(".projectedTotal");
function activeChecker() {
  if (
    dashboardLi.classList.contains("selected") ||
    dashboardMobileLi.classList.contains("selected")
  ) {
    totalExpense();
  } else {
    const existingChart = Chart.getChart(document.getElementById("myChart"));
    if (existingChart) {
      existingChart.destroy();
    }
  }
}

export async function totalExpense() {
  const electricityTotal = await window.electronAPI.getElectricity();
  const groceryTotal = await window.electronAPI.getGrocery();
  const allowanceTotal = await window.electronAPI.getAllowance();
  const savingsTotal = await window.electronAPI.getSavings();

  const elecTotal = electricityTotal.reduce((accumulator, currentvalue) => {
    return accumulator + Number(currentvalue.amount);
  }, 0);
  const grocerytotal = groceryTotal.reduce((accumulator, currentvalue) => {
    return accumulator + Number(currentvalue.amount);
  }, 0);
  const allowancetotal = allowanceTotal.reduce((accumulator, currentvalue) => {
    return accumulator + Number(currentvalue.amount);
  }, 0);
  const savingstotal = savingsTotal.reduce((accumulator, currentvalue) => {
    return accumulator + Number(currentvalue.amount);
  }, 0);

  const overAll = elecTotal + grocerytotal + allowancetotal + savingstotal;
  dashboardTotal.innerText = "₱" + overAll;
  renderChart(elecTotal, grocerytotal, allowancetotal, savingstotal);
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
    list.addEventListener("click", () => {
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
  /* renderChart(); */
  totalExpense();
  renderAll();
});
