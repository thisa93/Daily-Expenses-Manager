import { Request, Response, NextFunction } from 'express';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};
