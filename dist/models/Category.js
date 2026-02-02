import mongoose, { Schema } from 'mongoose';
const CategorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true }
}, { timestamps: true });
// Compound index to ensure unique categories per user
CategorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });
export default mongoose.model('Category', CategorySchema);
