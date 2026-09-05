const Transaction = require('../models/Transaction');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate total balance, income, and expenses
    const transactions = await Transaction.find({ userId });
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalBalance = totalIncome - totalExpenses;

    // Calculate this month's expenses
    const monthlyExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' &&
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      totalBalance,
      totalIncome,
      totalExpenses,
      monthlyExpenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching summary' });
  }
};

// @desc    Get monthly data
// @route   GET /api/dashboard/monthly
// @access  Private
exports.getMonthlyData = async (req, res) => {
  try {
    const userId = req.user.id;
    const months = parseInt(req.query.months) || 6;
    const mongoose = require('mongoose');

    const monthlyIncome = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'income' } },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: months }
    ]);

    const monthlyExpenses = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense' } },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: months }
    ]);

    res.status(200).json({
      monthlyIncome,
      monthlyExpenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching monthly data' });
  }
};

// @desc    Get category breakdown
// @route   GET /api/dashboard/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching categories for userId:', userId);

    // Check transaction types
    const allTransactions = await Transaction.find({ userId });
    const expenseCount = allTransactions.filter(t => t.type === 'expense').length;
    const incomeCount = allTransactions.filter(t => t.type === 'income').length;
    console.log('Total transactions:', allTransactions.length);
    console.log('Expense transactions:', expenseCount);
    console.log('Income transactions:', incomeCount);

    // Convert userId to ObjectId for aggregation
    const mongoose = require('mongoose');
    const categories = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    console.log('Categories result:', categories);
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: error.message || 'Server error fetching categories' });
  }
};

// @desc    Get analytics data
// @route   GET /api/dashboard/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'thisMonth' } = req.query;
    const mongoose = require('mongoose');

    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'last3Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'last6Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const monthlyIncome = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'income',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const spendingTrends = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      monthlyIncome,
      monthlyExpenses,
      categoryBreakdown,
      spendingTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching analytics' });
  }
};
