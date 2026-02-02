import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import sourceRoutes from './routes/sourceRoutes.js';
// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load env vars
dotenv.config();
import User from './models/User.js';
// Connect to database
connectDB().then(async () => {
    // Seed Default Admin
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
        await User.create({
            username: 'Admin',
            email: 'admin@admin.com',
            password: 'admin@123',
            role: 'admin',
            status: 'active'
        });
        console.log('Default Admin created');
    }
});
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Session Config
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));
// Set user local
app.use(async (req, res, next) => {
    res.locals.user = req.session.userId ? true : false;
    res.locals.isAdmin = false;
    if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        if (user && user.role === 'admin') {
            res.locals.isAdmin = true;
        }
    }
    next();
});
// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/transactions', transactionRoutes);
app.use('/sources', sourceRoutes);
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
