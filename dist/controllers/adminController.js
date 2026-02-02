import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';
export const getAdminDashboard = async (req, res) => {
    try {
        const users = await User.find({ role: 'member' });
        // Calculate totals for each user
        const userStats = await Promise.all(users.map(async (user) => {
            const income = await Transaction.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(user._id.toString()), type: 'income' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            const expense = await Transaction.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(user._id.toString()), type: 'expense' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            return {
                ...user.toObject(),
                totalIncome: income.length > 0 ? income[0].total : 0,
                totalExpense: expense.length > 0 ? expense[0].total : 0
            };
        }));
        res.render('admin/dashboard', { users: userStats });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (user) {
            user.status = user.status === 'active' ? 'suspended' : 'active';
            await user.save();
        }
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
export const renderAddAdmin = (req, res) => {
    res.render('auth/add_admin', { error: null });
};
export const addAdmin = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.render('auth/add_admin', { error: 'User already exists' });
        }
        await User.create({ username, email, password, role: 'admin', status: 'active' });
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        console.error(error);
        res.render('auth/add_admin', { error: 'Server Error' });
    }
};
