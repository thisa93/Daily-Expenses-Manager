import { Request, Response } from 'express';
import Source from '../models/Source.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        let { source, nature, startDate, endDate } = req.query;

        // Default to current month if no dates are provided
        if (!startDate && !endDate) {
            const now = new Date();
            // Format: YYYY-MM-DD
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            // Adjust to local date string part only to avoid timezone shifts when creating new Date from string later logic
            // Actually, toISOString() uses UTC. "YYYY-MM-DD" construction is safer manually or using helper.
            const formatDate = (d: Date) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            startDate = formatDate(start);
            endDate = formatDate(end);

            req.query.startDate = startDate as string;
            req.query.endDate = endDate as string;
        }

        // Ensure user is ObjectId for aggregation matching
        let query: any = { user: new mongoose.Types.ObjectId(userId as string) };

        if (source) {
            query.source = new mongoose.Types.ObjectId(source as string);
        }
        if (nature) query.nature = nature;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) {
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        const sources = await Source.find({ user: userId });
        const transactions = await Transaction.find(query).sort({ date: -1 }).limit(5).populate('source destination');

        // Aggregation for totals

        // Debt Aggregations (All Time)
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

        // Filtered Totals (Income and Expense - Defaulted to Current Month)
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

        // Use filtered totals for the main display (defaults to current month)
        let totalIncome = filteredIncomeAgg.length > 0 ? filteredIncomeAgg[0].total : 0;
        let totalExpense = filteredExpenseAgg.length > 0 ? filteredExpenseAgg[0].total : 0;

        const totalBorrow = borrowAgg.length > 0 ? borrowAgg[0].total : 0;
        const totalRepayment = repaymentAgg.length > 0 ? repaymentAgg[0].total : 0;

        // Given Loans Aggregations (All Time)
        const lendAgg = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), type: 'lend' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const loanRepaymentAgg = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), type: 'loan_repayment' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalLend = lendAgg.length > 0 ? lendAgg[0].total : 0;
        const totalLoanRepayment = loanRepaymentAgg.length > 0 ? loanRepaymentAgg[0].total : 0;
        const totalGivenLoans = totalLend - totalLoanRepayment;

        const filteredIncome = filteredIncomeAgg.length > 0 ? filteredIncomeAgg[0].total : 0;
        const filteredExpense = filteredExpenseAgg.length > 0 ? filteredExpenseAgg[0].total : 0;

        const totalDebt = totalBorrow - totalRepayment;

        const balance = totalIncome - totalExpense; // This is overall net flow, but user wants 'remaining balances (bank, cash)' which comes from Sources.

        // Sources already have 'balance' field which we maintain.
        const totalSourceBalance = sources.reduce((acc, src) => acc + src.balance, 0);

        // Determine label for the period
        let periodLabel = '';
        if (req.query.startDate) {
            const d = new Date(req.query.startDate as string);
            periodLabel = `(${d.toLocaleString('default', { month: 'long', year: 'numeric' })})`;
        }

        res.render('dashboard', {
            sources,
            transactions,
            totalIncome,
            totalExpense,
            totalSourceBalance,
            totalDebt,
            totalGivenLoans,
            query: req.query, // Pass query params to view
            filteredIncome,
            filteredExpense,
            incomeByCategory,
            expenseByCategory,
            periodLabel
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
