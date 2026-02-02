import Category from '../models/Category.js';
import mongoose from 'mongoose';
const DEFAULT_CATEGORIES = {
    income: [
        'Salary', 'Freelance', 'Investment Returns', 'Gifts', 'Refunds'
    ],
    expense: [
        'Food & Dining', 'Transportation', 'Utilities', 'Rent/Mortgage',
        'Healthcare', 'Entertainment', 'Shopping', 'Education',
        'Insurance', 'Baby Needs'
    ]
};
export const seedDefaultCategories = async (userId) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        for (const [type, names] of Object.entries(DEFAULT_CATEGORIES)) {
            for (const name of names) {
                // Check if exists
                const existing = await Category.findOne({
                    user: userObjectId,
                    name: name,
                    type: type
                });
                if (!existing) {
                    await Category.create({
                        user: userObjectId,
                        name: name,
                        type: type
                    });
                    console.log(`Seeded category: ${name} (${type})`);
                }
            }
        }
    }
    catch (error) {
        console.error('Error seeding categories:', error);
    }
};
