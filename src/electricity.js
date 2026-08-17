document.addEventListener("DOMContentLoaded", () => {
  loadElectricityData(electricityPage);
});

/* SAVE BUTTON LOGIC */
const elecPaginationInfo = document.getElementById("elec-pagination-info");
const electricityForm = document.getElementById("elec-form");

electricityForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const result = {
    amount: document.getElementById("electricity-amount").value.trim(),
    date: document.getElementById("electricity-date").value.trim(),
    note: document.getElementById("electricity-note").value.trim(),
  };
  await window.electronAPI.addElectricity(result);
  loadElectricityData(electricityPage);
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

  entryAppendingSavings(entries, page);
  paginationControls(page, entries);
}

function entryAppendingSavings(entries, page) {
  const rowContainer = document.getElementById("elec-row");
  rowContainer.innerHTML = "";

  const pageRow = pageValuesSavings(entries, page);
  pageRow.forEach((rows) => {
    const flexContainerRow = document.createElement("div");
    flexContainerRow.classList.add("rowContainer");
    /* Row */
    const row = createSavingsRows(rows);
    flexContainerRow.appendChild(row);

    /* Button */
    const buttons = createSavingsActionButtons(rows, page);

    flexContainerRow.appendChild(buttons);

    rowContainer.appendChild(flexContainerRow);
  });
}
function createSavingsRows(data) {
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
function createSavingsActionButtons(rows, page) {
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
    await window.electronAPI.deleteElectricity(Number(buttonId));
    loadElectricityData(page);
  });

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
  const x1 = entries[1].amount;
  const x2 = entries[0].amount;
  const rate = ((x1 - x2) / x1) * 100;
  const difference = x2 - x1;
  changeRateColor(difference);

  return Math.abs(rate).toFixed(0) + "%";
}
function pageValuesSavings(entries, page) {
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
  elecPaginationInfo.innerText = "Showing page " + page + " of " + totalPages;
}
function changeRateColor(rate) {
  const changeRate = document.querySelector(".change-rate");
  const trendIcon = document.querySelector(".percentage-svg");
  const electricityPercentage = document.querySelector(
    ".electricity-percentage",
  );
  const changeTitle = document.querySelector(".elec-change");

  // reset everything first
  changeRate.classList.remove("positive", "negative");
  electricityPercentage.classList.remove("positive-text", "negative-text");
  changeTitle.classList.remove("positive-text", "negative-text");
  trendIcon.classList.remove("downtrend");
  trendIcon.style.color = "";
  electricityPercentage.style.color = "";
  changeTitle.style.color = "";

  if (rate > 0) {
    // increase = bad (spending went up) = red
    changeRate.classList.add("negative");
    electricityPercentage.classList.add("negative-text");
    changeTitle.classList.add("negative-text");
    trendIcon.classList.add("downtrend");
    trendIcon.style.color = "#FF4545";
  } else if (rate < 0) {
    // decrease = good (spending went down) = green
    changeRate.classList.add("positive");
    electricityPercentage.classList.add("positive-text");
    changeTitle.classList.add("positive-text");
    trendIcon.style.color = "#16a34a";
  }
  // rate === 0: everything already reset above, nothing more to do
}

const elecPrev = document.getElementById("elec-prev");
const elecNext = document.getElementById("elec-next");
let electricityPage = 1;

elecPrev.addEventListener("click", () => {
  electricityPage--;
  loadElectricityData(electricityPage);
});
elecNext.addEventListener("click", () => {
  electricityPage++;
  loadElectricityData(electricityPage);
});
