import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    date: Date;
    category: string;
    description?: string;
    source?: mongoose.Types.ObjectId; // From Account
    destination?: mongoose.Types.ObjectId; // To Account (for transfer)
    nature?: 'Fixed' | 'Variable' | 'Unwanted' | 'Others'; // For Expense
}

const TransactionSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    description: { type: String },
    source: { type: Schema.Types.ObjectId, ref: 'Source' },
    destination: { type: Schema.Types.ObjectId, ref: 'Source' },
    nature: { type: String, enum: ['Fixed', 'Variable', 'Unwanted', 'Others'] }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
