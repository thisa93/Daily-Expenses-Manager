import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).send('Not authorized as an admin');
        }
    } else {
        res.redirect('/auth/login');
    }
};
