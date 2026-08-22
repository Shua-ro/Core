import { totalExpense } from "./renderer";
import { renderAll } from "./renderer";
export let savingsPage = 1;

const newCategoryForm = document.getElementById("new-category-inputs-id");

newCategoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const categoryName = document.getElementById("savings-category-name");
  await window.electronAPI.addCategory(categoryName.value);
  renderAll();
  newCategoryForm.reset();
});

const categoryContainer = document.querySelector(".category-container");

export async function loadCategories() {
  const categories = await window.electronAPI.getCategory();
  const entries = await window.electronAPI.getSavings();
  categoryContainer.innerHTML = "";
  addCategorySelection("");
  console.log("loadCategories Run");

  categories.forEach((category) => {
    createCardCategory(entries, category.category, category);
    addCategorySelection(category.category);
  });

  if (categories.length <= 0) {
    categoryContainer.classList.add("hidden");
  } else {
    categoryContainer.classList.remove("hidden");
  }
}
function createCardCategory(entries, categoryName, category) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  cardContainer.classList.add("minicard");
  cardContainer.classList.add("category-minicard");

  const categoryTitle = document.createElement("p");
  categoryTitle.classList.add("subp");
  categoryTitle.innerText = categoryName;

  const totalOfCategory = document.createElement("h2");
  totalOfCategory.classList.add("totalOfCategory");
  totalOfCategory.innerText = categoryTotalsCalculator(
    entries,
    categoryName,
  ); /* Replace with a calculation function */
  cardContainer.appendChild(categoryTitle);
  cardContainer.appendChild(totalOfCategory);
  categoryContainer.appendChild(cardContainer);

  const col1 = document.createElement("button");
  const col2 = document.createElement("button");

  col1.classList.add("button", "edit", "category-buttons");
  col2.classList.add("button", "del", "elec-del", "category-buttons");
  col2.dataset.id = category.id;

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
  row.classList.add("action-buttons-category");
  row.classList.add("action-buttons");

  const buttonId = col2.dataset.id;
  col2.addEventListener("click", async () => {
    await window.electronAPI.deleteCategory(Number(buttonId));
    await window.electronAPI.deleteCategoryWSavings(categoryName);

    addCategorySelection("");
    console.log(buttonId);

    await renderAll();
    console.log("deleted");

    /* loadSavingsData(page); */
  });

  row.appendChild(col1);
  row.appendChild(col2);
  cardContainer.appendChild(row);
  const realCategoryContainer = document.getElementById("savings-categories");
  realCategoryContainer.appendChild(cardContainer);
}
function categoryTotalsCalculator(entries, categoryName) {
  return (
    "₱" +
    entries.reduce((accumulator, row) => {
      if (row.category === categoryName) {
        return accumulator + Number(row.amount);
      } else {
        return accumulator;
      }
    }, 0)
  );
}
const SavingsForm = document.getElementById("savings-form");
SavingsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const result = {
    category: document.getElementById("savings-category-select").value.trim(),
    amount: document.getElementById("savings-amount").value.trim(),
    date: document.getElementById("savings-date").value.trim(),
    note: document.getElementById("savings-note").value.trim(),
  };
  await window.electronAPI.addSavings(result);
  loadSavingsData(savingsPage);
  renderAll();
  totalExpense();
  SavingsForm.reset();
});
const totalValueSavingsMain = document.querySelector(".savings-value");
const totalValueSavings = document.querySelector(".savings-total-value");
/* MAIN FUNCTION */
export async function loadSavingsData(page) {
  const entries = await window.electronAPI.getSavings();
  const total = await SavingsTotal();
  totalValueSavings.innerText = "₱" + total;
  totalValueSavingsMain.innerText = "₱" + total;

  /* console.log(entries);
  console.log(pageValuesElectricity(entries, page)); */

  entryAppendingSavings(entries, page);
  paginationControls(page, entries);
}
function addCategorySelection(categoryNames) {
  const select = document.getElementById("savings-category-select");
  if (categoryNames === "") {
    select.innerHTML =
      "<option value disabled selected>Choose category</option>";
    return;
  }
  const newOption = new Option(categoryNames, categoryNames);
  select.add(newOption);
}
async function SavingsTotal() {
  const entries = await window.electronAPI.getSavings();

  const total = entries.reduce((sum, row) => {
    return sum + Number(row.amount);
  }, 0);
  return total;
}

function entryAppendingSavings(entries, page) {
  const rowContainer = document.getElementById("savings-row");

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

    const category = document.createElement("p");

    category.classList.add("valuecategory");
    if (rows.category) {
      category.innerText = rows.category;
    } else if (rows.note === "") {
      category.innerText = "----";
    } else {
      category.innerText = "----";
    }
    rowContainer.appendChild(flexContainerRow);
    flexContainerRow.appendChild(category);
    flexContainerRow.appendChild(buttons);
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
    await window.electronAPI.deleteSavings(Number(buttonId));
    await totalExpense();
    renderAll();
    loadSavingsData(page);
  });

  row.appendChild(col1);
  row.appendChild(col2);
  return row;
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
  const savingsPaginationInfo = document.getElementById(
    "savings-pagination-info",
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
  savingsPaginationInfo.innerText =
    "Showing page " + page + " of " + totalPages;
}

const elecPrev = document.getElementById("savings-prev");
const elecNext = document.getElementById("savings-next");

elecPrev.addEventListener("click", () => {
  savingsPage--;
  loadSavingsData(savingsPage);
});
elecNext.addEventListener("click", () => {
  savingsPage++;
  loadSavingsData(savingsPage);
});
