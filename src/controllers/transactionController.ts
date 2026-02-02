import { Request, Response } from 'express';
import Transaction from '../models/Transaction.js';
import Source from '../models/Source.js';
import Category from '../models/Category.js';

// Add Transaction (Income, Expense, Transfer)
export const addTransaction = async (req: Request, res: Response) => {
    const { type, amount, category, description, sourceId, destinationId, nature, date } = req.body;
    const userId = req.session.userId;
    const numAmount = parseFloat(amount);
    const transferFee = req.body.transferFee ? parseFloat(req.body.transferFee) : 0;

    try {
        // Dynamic Category Saving
        if (category && (type === 'income' || type === 'expense')) {
            await Category.findOneAndUpdate(
                { user: userId, name: category, type: type },
                { user: userId, name: category, type: type },
                { upsert: true, new: true }
            );
        }

        // Create Transaction
        await Transaction.create({
            user: userId,
            type,
            amount: numAmount,
            date: date ? new Date(date) : undefined,
            category,
            description,
            source: sourceId,
            destination: destinationId,
            nature,
            lender: req.body.lender,
            borrower: req.body.borrower,
            dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
            transferFee
        });

        // Update Balances
        if (type === 'income' || type === 'borrow' || type === 'loan_repayment') {
            const source = await Source.findById(sourceId);
            if (source) {
                source.balance += numAmount;
                await source.save();
            }
        } else if (type === 'expense' || type === 'repayment' || type === 'lend') {
            const source = await Source.findById(sourceId);
            if (source) {
                source.balance -= numAmount;
                await source.save();
            }
        } else if (type === 'transfer') {
            const src = await Source.findById(sourceId);
            const dest = await Source.findById(destinationId);
            if (src && dest) {
                // Deduct amount + fee from source
                src.balance -= (numAmount + transferFee);
                // Add amount to destination
                dest.balance += numAmount;
                await src.save();
                await dest.save();
            }
        } else if (type === 'lend') {
            const source = await Source.findById(sourceId);
            if (source) {
                source.balance -= numAmount; // Lending money decreases balance
                await source.save();
            }
        } else if (type === 'loan_repayment') {
            const source = await Source.findById(sourceId);
            if (source) {
                source.balance += numAmount; // Receiving loan repayment increases balance
                await source.save();
            }
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render Add Transaction Page
export const renderAddTransaction = async (req: Request, res: Response) => {
    try {
        const sources = await Source.find({ user: req.session.userId });
        const categories = await Category.find({ user: req.session.userId }).sort({ name: 1 });
        const borrowers = await Transaction.distinct('borrower', { user: req.session.userId, borrower: { $nin: [null, ''] } });
        res.render('transactions/add', { sources, categories, borrowers });
    } catch (error) {
        console.error(error);
        res.send('Server Error');
    }
};

// Delete Transaction
export const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }

        // Revert Balance
        const numAmount = transaction.amount;
        if (transaction.type === 'income' || transaction.type === 'borrow') {
            const source = await Source.findById(transaction.source);
            if (source) {
                source.balance -= numAmount;
                await source.save();
            }
        } else if (transaction.type === 'expense' || transaction.type === 'repayment') {
            const source = await Source.findById(transaction.source);
            if (source) {
                source.balance += numAmount;
                await source.save();
            }
        } else if (transaction.type === 'transfer') {
            const src = await Source.findById(transaction.source);
            const dest = await Source.findById(transaction.destination);
            if (src && dest) {
                src.balance += numAmount;
                dest.balance -= numAmount;
                await src.save();
                await dest.save();
            }
        } else if (transaction.type === 'lend') {
            const source = await Source.findById(transaction.source);
            if (source) {
                source.balance += numAmount; // Deleting lend -> Money back
                await source.save();
            }
        } else if (transaction.type === 'loan_repayment') {
            const source = await Source.findById(transaction.source);
            if (source) {
                source.balance -= numAmount; // Deleting repayment -> Money gone
                await source.save();
            }
        }

        await transaction.deleteOne();
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render Edit Transaction Page
export const renderEditTransaction = async (req: Request, res: Response) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        const sources = await Source.find({ user: req.session.userId });
        if (!transaction) {
            return res.redirect('/dashboard');
        }
        res.render('transactions/edit', { transaction, sources });
    } catch (error) {
        console.error(error);
        res.send('Server Error');
    }
};

// Update Transaction
export const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    // Note: We expect all fields to be sent, even if unchanged, or at least handle partials. 
    // For simplicity, we assume form re-sends everything.
    const { type, amount, category, description, sourceId, destinationId, nature, date } = req.body;
    const numAmount = parseFloat(amount);

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }

        // 1. Revert Old Balance
        const oldAmount = transaction.amount;
        if (transaction.type === 'income' || transaction.type === 'borrow') {
            const oldSource = await Source.findById(transaction.source);
            if (oldSource) {
                oldSource.balance -= oldAmount;
                await oldSource.save();
            }
            if (oldSource) {
                oldSource.balance += oldAmount;
                await oldSource.save();
            }
        } else if (transaction.type === 'lend') {
            const oldSource = await Source.findById(transaction.source);
            if (oldSource) {
                oldSource.balance += oldAmount; // Revert: Add back lent amount
                await oldSource.save();
            }
        } else if (transaction.type === 'loan_repayment') {
            const oldSource = await Source.findById(transaction.source);
            if (oldSource) {
                oldSource.balance -= oldAmount; // Revert: Deduct repayment
                await oldSource.save();
            }
        } else if (transaction.type === 'transfer') {
            const oldSrc = await Source.findById(transaction.source);
            const oldDest = await Source.findById(transaction.destination);
            if (oldSrc && oldDest) {
                oldSrc.balance += oldAmount;
                oldDest.balance -= oldAmount;
                await oldSrc.save();
                await oldDest.save();
            }
        }

        // 2. Apply New Balance (Logic similar to Add)
        if (type === 'income' || type === 'borrow') {
            const source = await Source.findById(sourceId);
            if (source) {
                source.balance += numAmount;
                await source.save();
            }
        } else if (type === 'expense' || type === 'repayment') {
            const source = await Source.findById(sourceId);
            if (source) {
                source.balance -= numAmount;
                await source.save();
            }
        } else if (type === 'transfer') {
            const src = await Source.findById(sourceId);
            const dest = await Source.findById(destinationId);
            if (src && dest) {
                src.balance -= numAmount;
                dest.balance += numAmount;
                await src.save();
                await dest.save();
            }
        }

        // 3. Update Transaction Document
        transaction.type = type;
        transaction.amount = numAmount;
        transaction.date = new Date(date);
        transaction.category = category;
        transaction.description = description;
        transaction.source = sourceId;
        transaction.destination = destinationId;
        transaction.nature = nature;
        transaction.lender = req.body.lender;
        transaction.borrower = req.body.borrower;
        transaction.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : undefined;

        await transaction.save();

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Get Full Transaction History (with Search)
export const getTransactionHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const { source, nature, startDate, endDate, search, type } = req.query;

        let query: any = { user: userId };

        if (source) query.source = source;
        if (nature) query.nature = nature;
        if (type) query.type = type;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) {
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            query.$or = [
                { description: searchRegex },
                { category: searchRegex },
                { lender: searchRegex },
                { borrower: searchRegex }
            ];
        }

        const transactions = await Transaction.find(query).sort({ date: -1 }).populate('source destination');

        const sources = await Source.find({ user: userId });

        res.render('transactions/history', {
            transactions,
            sources,
            query: req.query
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render Month End Report
export const renderMonthEndReport = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const { month, year } = req.query;

        // Default to current month/year if not provided
        const now = new Date();
        const selectedMonth = month ? parseInt(month as string) - 1 : now.getMonth();
        const selectedYear = year ? parseInt(year as string) : now.getFullYear();

        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        // Aggregate Data
        let totalIncome = 0;
        let totalExpense = 0;
        let totalLent = 0;
        let totalRecovered = 0;
        const categoryBreakdown: { [key: string]: number } = {};

        transactions.forEach(t => {
            if (t.type === 'income') {
                totalIncome += t.amount;
                // Category breakdown for income? Usually expense is more relevant, but can track both
            } else if (t.type === 'expense') {
                totalExpense += t.amount;
                categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
            } else if (t.type === 'lend') {
                totalLent += t.amount;
            } else if (t.type === 'loan_repayment') {
                totalRecovered += t.amount;
            }
        });

        const netSavings = totalIncome - totalExpense;

        // Navigation Logic
        const prevDate = new Date(selectedYear, selectedMonth - 1, 1);
        const nextDate = new Date(selectedYear, selectedMonth + 1, 1);

        const navigation = {
            prevMonth: prevDate.getMonth() + 1,
            prevYear: prevDate.getFullYear(),
            nextMonth: nextDate.getMonth() + 1,
            nextYear: nextDate.getFullYear()
        };

        res.render('transactions/month_end_report', {
            transactions,
            totalIncome,
            totalExpense,
            totalLent,
            totalRecovered,
            netSavings,
            categoryBreakdown,
            selectedMonth: selectedMonth + 1,
            selectedYear,
            navigation
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
