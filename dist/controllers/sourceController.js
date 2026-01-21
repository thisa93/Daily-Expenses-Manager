import Source from '../models/Source.js';
// Get all sources for a user
export const getSources = async (req, res) => {
    try {
        const sources = await Source.find({ user: req.session.userId });
        res.render('sources/index', { sources }); // Assuming a view exists
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
// Add a new source (bank, cash, etc.)
export const addSource = async (req, res) => {
    const { name, type, balance, creditLimit } = req.body;
    try {
        await Source.create({
            user: req.session.userId,
            name,
            type,
            balance,
            creditLimit: creditLimit || 0
        });
        res.redirect('/sources');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
// Render Add Source Page
export const renderAddSource = (req, res) => {
    res.render('sources/add');
};
// Render Edit Source Page
export const renderEditSource = async (req, res) => {
    try {
        const source = await Source.findById(req.params.id);
        if (!source || source.user.toString() !== req.session.userId) {
            return res.redirect('/sources');
        }
        res.render('sources/edit', { source });
    }
    catch (error) {
        console.error(error);
        res.redirect('/sources');
    }
};
// Update Source
export const editSource = async (req, res) => {
    const { name, type, balance, creditLimit } = req.body;
    try {
        const source = await Source.findById(req.params.id);
        if (!source || source.user.toString() !== req.session.userId) {
            return res.redirect('/sources');
        }
        source.name = name;
        source.type = type;
        source.balance = balance;
        if (type === 'credit_card') {
            source.creditLimit = creditLimit || 0;
        }
        await source.save();
        res.redirect('/sources');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
