const express = require("express");

const expenseController = require("../controler/expenseController");
const router = express();
// Route to create a new expense
router.post("/expenses/:userid", expenseController.createOrUpdateExpense);

// Route to get all expenses
router.get("/expenses/:userid", expenseController.getAllExpenses);

router.delete("/expenses/:userid/:id", expenseController.deleteExpense); // DE
// Route to get expenses by category
// router.get(
//   "/expenses/category/:category",
//   expenseController.getExpensesByCategory
// );
module.exports = router;
