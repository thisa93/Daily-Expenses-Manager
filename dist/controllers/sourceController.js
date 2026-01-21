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
