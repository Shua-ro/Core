document.addEventListener("DOMContentLoaded", () => {
  loadAllowanceData(allowancePage);
  forAllowanceValue();
});
const allowanceForm = document.getElementById("allowance-form");
allowanceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const result = {
    amount: document.getElementById("allowance-amount").value.trim(),
    date: document.getElementById("allowance-date").value.trim(),
    child: document.getElementById("person").value.trim(),
  };
  console.log(result);

  await window.electronAPI.addAllowance(result);
  loadAllowanceData(allowancePage);
  forAllowanceValue();
  allowanceForm.reset();
});
const totalValueAllowanceMain = document.querySelector(".allowance-main");
const totalValueAllowance = document.querySelector(".allowance-expense-value");
/* MAIN FUNCTION */
async function loadAllowanceData(page) {
  const entries = await window.electronAPI.getAllowance();
  const total = await allowanceTotal();
  totalValueAllowance.innerText = "₱" + total;
  totalValueAllowanceMain.innerText = "₱" + total;

  /* console.log(entries);
  console.log(pageValuesElectricity(entries, page)); */

  entryAppendingAllowance(entries, page);
  paginationControls(page, entries);
}
async function forAllowanceValue() {
  const entries = await window.electronAPI.getAllowance();
  let josh = 0;
  let janrry = 0;
  let min = 0;
  entries.forEach((entry) => {
    if (entry.child === "Joshua") {
      josh += entry.amount;
    } else if (entry.child === "Jonas") {
      janrry += entry.amount;
    } else if (entry.child === "Jasmine") {
      min += entry.amount;
    } else {
      return;
    }
  });

  const joshua = document.querySelector(".joshua");
  const jonas = document.querySelector(".jonas");
  const jasmine = document.querySelector(".jasmine");

  joshua.innerText = josh;
  jonas.innerText = janrry;
  jasmine.innerText = min;
}
async function allowanceTotal() {
  const entries = await window.electronAPI.getAllowance();
  const total = entries.reduce((sum, row) => {
    return sum + Number(row.amount);
  }, 0);
  return total;
}

function entryAppendingAllowance(entries, page) {
  const rowContainer = document.getElementById("allowance-row");

  rowContainer.innerHTML = "";

  const pageRow = pageValuesElectricity(entries, page);
  pageRow.forEach((rows) => {
    const flexContainerRow = document.createElement("div");
    flexContainerRow.classList.add("rowContainer");
    /* Row */
    const row = createAllowanceRows(rows);
    flexContainerRow.appendChild(row);

    /* Button */
    const buttons = createAllowanceActionButtons(rows, page);

    flexContainerRow.appendChild(buttons);

    rowContainer.appendChild(flexContainerRow);
  });
}
function createAllowanceRows(data) {
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
    col2.innerText = "0";
  } else {
    col2.innerText = "----";
  }

  if (data.child) {
    col3.innerText = data.child;
  } else if (data.child === "") {
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
function createAllowanceActionButtons(rows, page) {
  const col1 = document.createElement("button");
  const col2 = document.createElement("button");

  col1.classList.add("button", "edit");
  col2.classList.add("button", "del", "elec-del");
  col2.dataset.id = rows.id;

  col1.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>
</svg>
<span class="btn-label">Edit</span>`;

  col2.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"/>
  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
  <path d="M10 11v6"/>
  <path d="M14 11v6"/>
  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
</svg>
<span class="btn-label">Delete</span>`;
  const row = document.createElement("div");
  row.classList.add("action-buttons");

  col2.addEventListener("click", async () => {
    const buttonId = col2.dataset.id;
    await window.electronAPI.deleteAllowance(Number(buttonId));
    loadAllowanceData(page);
    forAllowanceValue();
  });

  row.appendChild(col1);
  row.appendChild(col2);
  return row;
}
function pageValuesElectricity(entries, page) {
  const pageSize = 3;

  const currentPage = page;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageEntries = entries.slice(start, end);
  return pageEntries;
}
function paginationControls(page, entries) {
  const pageSize = 3;
  const totalPages = Math.ceil(entries.length / pageSize);
  const allowancePaginationInfo = document.getElementById(
    "allowance-pagination-info",
  );

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
  allowancePaginationInfo.innerText =
    "Showing page " + page + " of " + totalPages;
}
let allowancePage = 1;
const elecPrev = document.getElementById("allowance-prev");
const elecNext = document.getElementById("allowance-next");

elecPrev.addEventListener("click", () => {
  allowancePage--;
  loadAllowanceData(allowancePage);
});
elecNext.addEventListener("click", () => {
  allowancePage++;
  loadAllowanceData(allowancePage);
});
