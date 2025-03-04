const { Expense } = require("../Module/Expense");

// Create a new expense
const createOrUpdateExpense = async (req, res) => {
  const { id, description, amount, category, date } = req.body.expense;
  let inputeuserid = req.params.userid;
  console.log("req");
  console.log(req.body);
  console.log(inputeuserid);
  console.log(id, description, amount, category, date);
  try {
    // Use findOneAndUpdate to either update or create a new expense
    const expense = await Expense.findOneAndUpdate(
      { id: id, userid: inputeuserid }, // Query to find the expense by ID (or you could use another unique field)
      {
        $set: {
          // Use $set to define the fields to be updated
          description,
          amount,
          category,
          date,
        },
      },
      {
        new: true, // Returns the updated document
        upsert: true, // If no document is found, create a new one
      }
    );
    console.log("expense");
    console.log(expense);

    return res.status(200).json({
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.log("error");
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

// Get all expenses
const getAllExpenses = async (req, res) => {
  let inputeuserid = req.params.userid;
  try {
    const expenses = await Expense.find({ userid: inputeuserid });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get expenses by category
const getExpensesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const expenses = await Expense.find({ category });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  console.log("req.params");
  console.log(req.params);
  let userid = req.params.userid;
  let id = req.params.id; // Get the expense ID from the URL

  try {
    // If 'id' is a string or number, no need to cast it to ObjectId
    const expense = await Expense.findOneAndDelete({
      id: id, // Custom field 'id' in the query
      userid: userid, // Custom field 'userid' in the query
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res
      .status(200)
      .json({ message: "Expense deleted successfully", expense });
  } catch (error) {
    console.error(error); // For debugging purposes
    return res.status(400).json({ message: error.message });
  }
};

exports.createOrUpdateExpense = createOrUpdateExpense;
exports.getAllExpenses = getAllExpenses;
exports.getExpensesByCategory = getExpensesByCategory;
exports.deleteExpense = deleteExpense;
