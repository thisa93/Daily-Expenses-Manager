import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    type: 'income' | 'expense';
}

const CategorySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true }
}, { timestamps: true });

// Compound index to ensure unique categories per user
CategorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);
