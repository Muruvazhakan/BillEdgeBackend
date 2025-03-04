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

router.post("/services/:userid", expenseController.createOrUpdateService);

// Route to get all expenses
router.get("/services/:userid", expenseController.getAllServices);

router.delete("/services/:userid/:id", expenseController.deleteServices); // DE
// Route to get expenses by category
module.exports = router;
