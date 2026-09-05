const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    // Check if budget already exists for this category, month, and year
    const existingBudget = await Budget.findOne({
      userId: req.user.id,
      category,
      month,
      year
    });

    if (existingBudget) {
      return res.status(400).json({ 
        message: 'Budget already exists for this category in the selected month' 
      });
    }

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount,
      month,
      year
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error creating budget' });
  }
};

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.user.id };

    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const budgets = await Budget.find(query).sort({ category: 1 });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0);

        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: req.user.id,
              type: 'expense',
              category: budget.category,
              date: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        return {
          ...budget.toObject(),
          spent: spent[0]?.total || 0
        };
      })
    );

    res.status(200).json({ budgets: budgetsWithSpent });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching budgets' });
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Calculate spent amount
    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0);

    const spent = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.id,
          type: 'expense',
          category: budget.category,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      ...budget.toObject(),
      spent: spent[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching budget' });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating budget' });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error deleting budget' });
  }
};
