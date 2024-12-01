import mongoose, { Schema, Document } from "mongoose";

interface IExpense extends Document {
  description: string;
  amount: number;
  expenseDate: Date;
}

const ExpenseSchema: Schema<IExpense> = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  expenseDate: { type: Date, required: true },
});

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
