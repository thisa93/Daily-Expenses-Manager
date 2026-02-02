import Source from '../models/Source.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';
export const getDashboard = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { source, nature, startDate, endDate } = req.query;
        // Ensure user is ObjectId for aggregation matching
        let query = { user: new mongoose.Types.ObjectId(userId) };
        if (source) {
            query.source = new mongoose.Types.ObjectId(source);
        }
        if (nature)
            query.nature = nature;
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }
        const sources = await Source.find({ user: userId });
        const transactions = await Transaction.find(query).sort({ date: -1 }).limit(5).populate('source destination');
        // Aggregation for totals (mock for now or simple calc)
        // Let's use simple JS for now to verify.
        let totalIncome = 0;
        let totalExpense = 0;
        // Note: For real total, we should aggregate on DB.
        const incomeAgg = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), type: 'income' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const expenseAgg = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const borrowAgg = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), type: 'borrow' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const repaymentAgg = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), type: 'repayment' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const transferFeeAgg = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), type: 'transfer' } },
            { $group: { _id: null, total: { $sum: '$transferFee' } } }
        ]);
        // Filtered Totals
        const filteredIncomeAgg = await Transaction.aggregate([
            { $match: { ...query, type: 'income' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const filteredExpenseAgg = await Transaction.aggregate([
            { $match: { ...query, type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const filteredTransferFeeAgg = await Transaction.aggregate([
            { $match: { ...query, type: 'transfer' } },
            { $group: { _id: null, total: { $sum: '$transferFee' } } }
        ]);
        // Category-wise Aggregation for Charts
        const incomeByCategory = await Transaction.aggregate([
            { $match: { ...query, type: 'income' } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);
        const expenseByCategory = await Transaction.aggregate([
            { $match: { ...query, type: 'expense' } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);
        totalIncome = incomeAgg.length > 0 ? incomeAgg[0].total : 0;
        totalExpense = expenseAgg.length > 0 ? expenseAgg[0].total : 0;
        const totalBorrow = borrowAgg.length > 0 ? borrowAgg[0].total : 0;
        const totalRepayment = repaymentAgg.length > 0 ? repaymentAgg[0].total : 0;
        const filteredIncome = filteredIncomeAgg.length > 0 ? filteredIncomeAgg[0].total : 0;
        const filteredExpense = filteredExpenseAgg.length > 0 ? filteredExpenseAgg[0].total : 0;
        const totalDebt = totalBorrow - totalRepayment;
        const balance = totalIncome - totalExpense; // This is overall net flow, but user wants 'remaining balances (bank, cash)' which comes from Sources.
        // Sources already have 'balance' field which we maintain.
        const totalSourceBalance = sources.reduce((acc, src) => acc + src.balance, 0);
        res.render('dashboard', {
            sources,
            transactions,
            totalIncome,
            totalExpense,
            totalSourceBalance,
            totalDebt,
            query: req.query, // Pass query params to view
            filteredIncome,
            filteredExpense,
            incomeByCategory,
            expenseByCategory
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
