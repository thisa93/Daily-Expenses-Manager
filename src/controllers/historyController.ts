import { Request, Response } from 'express';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';
import Source from '../models/Source.js'; // Ensure Source is imported if populated

export const getTransactionHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        // Reuse basic filter logic if we want filters on history page too, 
        // but for now let's just show all or basic filters.
        // Let's copy basic query logic to allow reusing filters if passed
        const { source, nature, startDate, endDate } = req.query;

        let query: any = { user: new mongoose.Types.ObjectId(userId as string) };

        if (source) {
            query.source = new mongoose.Types.ObjectId(source as string);
        }
        if (nature) query.nature = nature;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) {
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        const transactions = await Transaction.find(query).sort({ date: -1 }).populate('source destination');

        res.render('transactions/history', {
            transactions,
            query: req.query
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
