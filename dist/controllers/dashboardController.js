import Source from '../models/Source.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';
export const getDashboard = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { source, nature } = req.query;
        let query = { user: userId };
        if (source)
            query.source = source;
        if (nature)
            query.nature = nature;
        const sources = await Source.find({ user: userId });
        const transactions = await Transaction.find(query).sort({ date: -1 }).limit(10).populate('source destination');
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
        totalIncome = incomeAgg.length > 0 ? incomeAgg[0].total : 0;
        totalExpense = expenseAgg.length > 0 ? expenseAgg[0].total : 0;
        const balance = totalIncome - totalExpense; // This is overall net flow, but user wants 'remaining balances (bank, cash)' which comes from Sources.
        // Sources already have 'balance' field which we maintain.
        const totalSourceBalance = sources.reduce((acc, src) => acc + src.balance, 0);
        res.render('dashboard', {
            sources,
            transactions,
            totalIncome,
            totalExpense,
            totalSourceBalance
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
