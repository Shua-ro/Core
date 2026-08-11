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
  loadElectricityData(page);
  electricityForm.reset();
});

/* RENDER VALUES */
const totalValueElectricity = document.querySelector(
  ".electricity-expense-value",
);
const totalValueElectricityMain = document.querySelector(".electricity-value");
const rateChange = document.querySelector(".electricity-percentage");

async function loadElectricityData(page) {
  const entries = await window.electronAPI.getElectricity();
  const total = await electricityTotal();
  totalValueElectricity.innerText = "₱" + total;
  totalValueElectricityMain.innerText = "₱" + total;

  const changeRate = change(entries);
  rateChange.innerText = changeRate;

  entryAppending(entries, page);
  paginationControls(page, entries);
}

function entryAppending(entries, page) {
  const rower = document.querySelector(".row");
  const rowContainer = document.getElementById("elec-row");
  rowContainer.innerHTML = "";

  const pageRow = pageValues(entries, page);
  pageRow.forEach((rows) => {
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

function pageValues(entries, page) {
  const pageSize = 5;
  const totalPages = Math.ceil(entries.length / pageSize);

  const currentPage = page;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageEntries = entries.slice(start, end);
  return pageEntries;
}
function paginationControls(page, entries) {
  const pageSize = 5;
  const totalPages = Math.ceil(entries.length / pageSize);
  if (page <= 1) {
    elecPrev.disabled = true;
  } else {
    elecPrev.disabled = false;
  }

  if (page >= totalPages) {
    elecNext.disabled = true;
  } else {
    elecNext.disabled = false;
  }
}

const elecPrev = document.getElementById("elec-prev");
const elecNext = document.getElementById("elec-next");
let page = 1;

elecPrev.addEventListener("click", () => {
  page--;
  loadElectricityData(page);
});
elecNext.addEventListener("click", () => {
  page++;
  loadElectricityData(page);
});
