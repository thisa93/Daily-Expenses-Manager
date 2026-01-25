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
// Delete Transaction
export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        // Revert Balance
        const numAmount = transaction.amount;
        if (transaction.type === 'income') {
            const source = await Source.findById(transaction.source);
            if (source) {
                source.balance -= numAmount;
                await source.save();
            }
        }
        else if (transaction.type === 'expense') {
            const source = await Source.findById(transaction.source);
            if (source) {
                source.balance += numAmount;
                await source.save();
            }
        }
        else if (transaction.type === 'transfer') {
            const src = await Source.findById(transaction.source);
            const dest = await Source.findById(transaction.destination);
            if (src && dest) {
                src.balance += numAmount;
                dest.balance -= numAmount;
                await src.save();
                await dest.save();
            }
        }
        await transaction.deleteOne();
        res.redirect('/dashboard');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
// Render Edit Transaction Page
export const renderEditTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        const sources = await Source.find({ user: req.session.userId });
        if (!transaction) {
            return res.redirect('/dashboard');
        }
        res.render('transactions/edit', { transaction, sources });
    }
    catch (error) {
        console.error(error);
        res.send('Server Error');
    }
};
// Update Transaction
export const updateTransaction = async (req, res) => {
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
        if (transaction.type === 'income') {
            const oldSource = await Source.findById(transaction.source);
            if (oldSource) {
                oldSource.balance -= oldAmount;
                await oldSource.save();
            }
        }
        else if (transaction.type === 'expense') {
            const oldSource = await Source.findById(transaction.source);
            if (oldSource) {
                oldSource.balance += oldAmount;
                await oldSource.save();
            }
        }
        else if (transaction.type === 'transfer') {
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
        // 3. Update Transaction Document
        transaction.type = type;
        transaction.amount = numAmount;
        transaction.date = new Date(date);
        transaction.category = category;
        transaction.description = description;
        transaction.source = sourceId;
        transaction.destination = destinationId;
        transaction.nature = nature;
        await transaction.save();
        res.redirect('/dashboard');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
