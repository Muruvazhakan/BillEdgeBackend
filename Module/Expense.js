const mongooes = require("mongoose");

const schema = mongooes.Schema;

const expenseSchema = new schema({
  description: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports.Expense = mongooes.model("Expense", expenseSchema);
