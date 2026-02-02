import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    type: 'income' | 'expense' | 'transfer' | 'borrow' | 'repayment' | 'lend' | 'loan_repayment';
    amount: number;
    date: Date;
    category: string;
    description?: string;
    source?: mongoose.Types.ObjectId; // From Account
    destination?: mongoose.Types.ObjectId; // To Account (for transfer)
    nature?: 'Fixed' | 'Variable' | 'Unwanted' | 'Others' | 'Baby Needs'; // For Expense
    lender?: string; // For Borrow/Repayment
    borrower?: string; // For Lend/Loan Repayment
    dueDate?: Date; // For Borrow
    transferFee?: number; // For Transfer
}

const TransactionSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense', 'transfer', 'borrow', 'repayment', 'lend', 'loan_repayment'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    description: { type: String },
    source: { type: Schema.Types.ObjectId, ref: 'Source' },
    destination: { type: Schema.Types.ObjectId, ref: 'Source' },
    nature: { type: String, enum: ['Fixed', 'Variable', 'Unwanted', 'Others', 'Baby Needs'] },
    lender: { type: String },
    borrower: { type: String }, // For Lend/Loan Repayment
    dueDate: { type: Date },
    transferFee: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
