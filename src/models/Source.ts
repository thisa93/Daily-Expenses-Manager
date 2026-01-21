import mongoose, { Schema, Document } from 'mongoose';

export interface ISource extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    type: 'bank' | 'cash' | 'credit_card';
    balance: number;
    creditLimit?: number;
}

const SourceSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['bank', 'cash', 'credit_card'], required: true },
    balance: { type: Number, required: true, default: 0 },
    creditLimit: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ISource>('Source', SourceSchema);
