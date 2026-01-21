import Transaction from '../models/Transaction.js';
import Source from '../models/Source.js';
// Add Transaction (Income, Expense, Transfer)
export const addTransaction = async (req, res) => {
    const { type, amount, category, description, sourceId, destinationId, nature, date } = req.body;
    const userId = req.session.userId;
    const numAmount = parseFloat(amount);
    try {
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
            nature
        });
        // Update Balances
        if (type === 'income') {
            const source = await Source.findById(sourceId);
            if (source) {
                source.balance += numAmount;
                await source.save();
            }
        }
        else if (type === 'expense') {
            const source = await Source.findById(sourceId);
            if (source) {
                source.balance -= numAmount;
                await source.save();
            }
        }
        else if (type === 'transfer') {
            const src = await Source.findById(sourceId);
            const dest = await Source.findById(destinationId);
            if (src && dest) {
                src.balance -= numAmount;
                dest.balance += numAmount;
                await src.save();
                await dest.save();
            }
        }
        res.redirect('/dashboard');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
// Render Add Transaction Page
export const renderAddTransaction = async (req, res) => {
    try {
        const sources = await Source.find({ user: req.session.userId });
        res.render('transactions/add', { sources });
    }
    catch (error) {
        console.error(error);
        res.send('Server Error');
    }
};
