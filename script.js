const entryList = document.getElementById("entryList");
const totalIncomeElement = document.getElementById("totalIncome");
const totalExpensesElement = document.getElementById("totalExpenses");
const netBalanceElement = document.getElementById("netBalance");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addEntryButton = document.getElementById("addEntry");
const resetFieldsButton = document.getElementById("resetFields");
const filterInputs = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem("entries")) || [];

// Function to render entries
function renderEntries() {
  entryList.innerHTML = "";
  let totalIncome = 0;
  let totalExpenses = 0;

  const filterValue = document.querySelector(
    'input[name="filter"]:checked'
  ).value;

  entries.forEach((entry, index) => {
    if (filterValue === "all" || entry.type === filterValue) {
      const li = document.createElement("li");
      li.innerHTML = `
                <span>${entry.description} - $${entry.amount} (${entry.type})</span>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            `;
      entryList.appendChild(li);

      if (entry.type === "income") {
        totalIncome += entry.amount;
      } else {
        totalExpenses += entry.amount;
      }
    }
  });

  totalIncomeElement.textContent = totalIncome;
  totalExpensesElement.textContent = totalExpenses;
  netBalanceElement.textContent = totalIncome - totalExpenses;
}

// Function to add a new entry
addEntryButton.addEventListener("click", () => {
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (description && !isNaN(amount)) {
    entries.push({ description, amount, type });
    localStorage.setItem("entries", JSON.stringify(entries));
    renderEntries();
    resetFields();
  } else {
    alert("Please enter valid description and amount.");
  }
});

// Function to edit an entry
function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;

  addEntryButton.onclick = () => {
    const updatedDescription = descriptionInput.value;
    const updatedAmount = parseFloat(amountInput.value);
    const updatedType = typeInput.value;

    if (updatedDescription && !isNaN(updatedAmount)) {
      entries[index] = {
        description: updatedDescription,
        amount: updatedAmount,
        type: updatedType,
      };
      localStorage.setItem("entries", JSON.stringify(entries));
      renderEntries();
      resetFields();
      addEntryButton.onclick = addEntry; // Reset to original add function
    } else {
      alert("Please enter valid description and amount.");
    }
  };
}

// Function to delete an entry
function deleteEntry(index) {
  entries.splice(index, 1);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries();
}

// Function to reset input fields
function resetFields() {
  descriptionInput.value = "";
  amountInput.value = "";
  typeInput.value = "income";
}

// Event listener for reset button
resetFieldsButton.addEventListener("click", resetFields);

// Event listener for filter changes
filterInputs.forEach((input) => {
  input.addEventListener("change", renderEntries);
});

// Initial render
renderEntries();
