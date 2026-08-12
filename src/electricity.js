const elecPaginationInfo = document.getElementById("elec-pagination-info");
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
    const buttons = createElectricalActionButtons(rows, page);

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
function createElectricalActionButtons(rows, page) {
  const col1 = document.createElement("button");
  const col2 = document.createElement("button");

  col1.classList.add("button", "edit");
  col2.classList.add("button", "del", "elec-del");
  col2.dataset.id = rows.id;
  col1.innerText = "Edit";
  col2.innerText = "Delete";
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
function pageValues(entries, page) {
  const pageSize = 3;
  const totalPages = Math.ceil(entries.length / pageSize);

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
  const electricityPercentage = document.querySelector(".electricity-percentage");
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

async function singleDeletions(id) {
  await window.electronAPI.deleteElectricity(id);
  console.log("delete successfull");
}
