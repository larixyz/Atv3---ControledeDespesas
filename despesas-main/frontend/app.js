const apiUrl = 'http://localhost:3030/expenses';

let editingExpenseId = null;  // Variável para armazenar o ID da despesa em edição

// Função para carregar as despesas e o total
async function loadExpenses() {
  const response = await fetch(apiUrl);
  const data = await response.json();

  const expenses = data.expenses;
  const total = data.total;

  const expenseList = document.getElementById("expense-list");
  expenseList.innerHTML = "";

  expenses.forEach((expense) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${expense.description} - R$ ${expense.amount.toFixed(2)} - Data: ${new Date(expense.expenseDate).toLocaleDateString()}`;
    
    // Criando botão para editar a despesa
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => {
      // Preenche os campos de edição com os dados da despesa
      document.getElementById("description").value = expense.description;
      document.getElementById("amount").value = expense.amount;
      document.getElementById("expenseDate").value = new Date(expense.expenseDate).toISOString().split('T')[0];

      // Salva o ID da despesa para saber qual editar
      editingExpenseId = expense._id;

      // Altera o texto do botão para "Salvar alterações"
      const submitButton = document.querySelector("button[type='submit']");
      submitButton.textContent = "Salvar Alterações";
    });

    listItem.appendChild(editButton);

    // Criando botão para excluir a despesa
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", async () => {
      await deleteExpense(expense._id);
      loadExpenses();  // Recarregar a lista após excluir
    });
    listItem.appendChild(deleteButton);
    
    expenseList.appendChild(listItem);
  });

  // Atualizando o total
  document.getElementById("total").textContent = total.toFixed(2);
}

// Função para excluir uma despesa
async function deleteExpense(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Despesa excluída com sucesso!");
    } else {
      const error = await response.json();
      alert(error.error);
    }
  } catch (error) {
    alert("Erro ao excluir despesa: " + error.message);
  }
}

// Função para editar uma despesa
document.getElementById("expenseForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const expenseDate = document.getElementById("expenseDate").value;

  if (!description || !amount || !expenseDate) {
    alert("Todos os campos são obrigatórios.");
    return;
  }

  const expense = {
    description,
    amount,
    expenseDate,
  };

  if (editingExpenseId) {
    // Editando a despesa
    try {
      const response = await fetch(`${apiUrl}/${editingExpenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        alert("Despesa atualizada com sucesso!");
        loadExpenses();  // Recarregar as despesas após a edição
        resetForm();     // Resetando o formulário
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert("Erro ao editar despesa: " + error.message);
    }
  } else {
    // Caso o usuário não esteja editando, será uma criação normal
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        alert("Despesa cadastrada com sucesso!");
        loadExpenses();  // Recarregar as despesas após o cadastro
        resetForm();     // Resetando o formulário
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert("Erro ao cadastrar despesa: " + error.message);
    }
  }
});

// Função para resetar o formulário e o botão
function resetForm() {
  document.getElementById("expenseForm").reset();
  editingExpenseId = null;
  const submitButton = document.querySelector("button[type='submit']");
  submitButton.textContent = "Cadastrar Despesa"; // Resetando para "Cadastrar Despesa"
}

loadExpenses();  // Carregar as despesas ao carregar a página
