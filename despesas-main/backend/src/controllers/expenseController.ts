import { Request, Response } from 'express';
import Expense from '../models/Expense';

export const createExpense = async (req: Request, res: Response) => {
  try {
    console.log("Recebendo dados:", req.body); // Adicionando log
    const { description, amount, expenseDate } = req.body;

    if (!expenseDate) {
      return res.status(400).json({ error: "A data da despesa é obrigatória." });
    }

    const dateParts = expenseDate.split("-");
    const formattedDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );

    const newExpense = new Expense({
      description,
      amount,
      expenseDate: formattedDate,
    });

    await newExpense.save();
    console.log("Despesa cadastrada com sucesso:", newExpense); // Log de sucesso
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Erro ao cadastrar despesa:", error);
    res.status(500).json({ error: "Erro ao cadastrar despesa." });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().sort({ expenseDate: -1 });

    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    res.json({ expenses, total });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, amount, expenseDate } = req.body;

  // Validação da data
  if (!expenseDate) {
    return res.status(400).json({ error: "A data da despesa é obrigatória." });
  }

  // Conversão da data para o formato Date do JavaScript
  const dateParts = expenseDate.split("-");
  const formattedDate = new Date(
    parseInt(dateParts[0]), // Ano
    parseInt(dateParts[1]) - 1, // Mês (0-indexado)
    parseInt(dateParts[2]) // Dia
  );

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(id, {
      description,
      amount,
      expenseDate: formattedDate,
    }, { new: true });

    if (!updatedExpense) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }

    res.json(updatedExpense);
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error);
    res.status(500).json({ error: "Erro ao atualizar despesa." });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Expense.findByIdAndDelete(id);
  res.json({ message: 'Despesa removida' });
};
