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
  linkedTo: {
    type: String,
  },
});

const serviceSchema = new schema({
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
  clientName: {
    type: String,
    required: true,
  },
  clientPhoneNo: {
    type: String,
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
module.exports.Service = mongooes.model("Service", serviceSchema);
