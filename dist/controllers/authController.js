import User from '../models/User.js';
import { seedDefaultCategories } from '../utils/seedCategories.js';
// Register User
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const role = 'member'; // Force role to member for public registration
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).render('auth/register', { error: 'User already exists' });
        }
        const user = await User.create({ username, email, password, role });
        req.session.userId = user._id;
        await seedDefaultCategories(user._id);
        res.redirect('/dashboard');
    }
    catch (error) {
        console.error(error);
        res.status(500).render('auth/register', { error: 'Server Error' });
    }
};
// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            if (user.status === 'suspended') {
                return res.status(403).render('auth/login', { error: 'Your account has been suspended. Contact Admin.' });
            }
            req.session.userId = user._id;
            await seedDefaultCategories(user._id);
            res.redirect('/dashboard');
        }
        else {
            res.status(401).render('auth/login', { error: 'Invalid email or password' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).render('auth/login', { error: 'Server Error' });
    }
};
// Logout User
export const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};
// Render Register Page
export const renderRegister = (req, res) => {
    res.render('auth/register', { error: null });
};
// Render Login Page
export const renderLogin = (req, res) => {
    res.render('auth/login', { error: null });
};
