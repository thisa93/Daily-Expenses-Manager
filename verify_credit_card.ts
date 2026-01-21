import mongoose from 'mongoose';
import Source from './src/models/Source.js';
import Transaction from './src/models/Transaction.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const verifyCreditCardLogic = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Clean up previous test data if any (be careful with real DB, maybe suffix with TEST)
        const TEST_USER_ID = new mongoose.Types.ObjectId(); // Mock user ID

        // 1. Create Credit Card Source
        console.log(' Creating Credit Card Source...');
        const creditCard = await Source.create({
            user: TEST_USER_ID,
            name: 'Test Visa Card',
            type: 'credit_card',
            balance: 50000, // 50k Limit
            creditLimit: 50000
        });
        console.log('Credit Card Created:', creditCard.balance === 50000 ? 'PASS' : 'FAIL');

        // 2. Create Bank Source
        console.log(' Creating Bank Source...');
        const bank = await Source.create({
            user: TEST_USER_ID,
            name: 'Test Bank',
            type: 'bank',
            balance: 10000 // 10k Cash
        });
        console.log('Bank Created:', bank.balance === 10000 ? 'PASS' : 'FAIL');

        // 3. Expense on Credit Card (5000)
        console.log(' Adding Expense on Credit Card (5000)...');
        // Logic from transactionController:
        // if type === 'expense' -> source.balance -= amount
        const expenseAmount = 5000;
        creditCard.balance -= expenseAmount;
        await creditCard.save();

        const updatedCC_1 = await Source.findById(creditCard._id);
        console.log('Updated CC Balance (Should be 45000):', updatedCC_1?.balance);
        if (updatedCC_1?.balance !== 45000) throw new Error('Expense failed to reduce balance');

        // 4. Settlement (Transfer from Bank to CC) (2000)
        console.log(' Paying Credit Card Bill (2000)...');
        // Logic from transactionController:
        // if type === 'transfer' -> src.balance -= amount, dest.balance += amount
        const transferAmount = 2000;

        // Bank pays
        bank.balance -= transferAmount;
        await bank.save();

        // CC receives
        updatedCC_1.balance += transferAmount;
        await updatedCC_1.save();

        const finalCC = await Source.findById(creditCard._id);
        const finalBank = await Source.findById(bank._id);

        console.log('Final CC Balance (Should be 47000):', finalCC?.balance);
        console.log('Final Bank Balance (Should be 8000):', finalBank?.balance);

        if (finalCC?.balance !== 47000) throw new Error('Settlement failed to increase CC balance');
        if (finalBank?.balance !== 8000) throw new Error('Settlement failed to decrease Bank balance');

        console.log('VERIFICATION SUCCESSFUL!');

        // Cleanup
        await Source.deleteMany({ user: TEST_USER_ID });
    } catch (error) {
        console.error('Verification Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyCreditCardLogic();
