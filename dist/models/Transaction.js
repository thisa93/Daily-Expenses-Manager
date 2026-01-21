import mongoose, { Schema } from 'mongoose';
const TransactionSchema = new Schema({
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
export default mongoose.model('Transaction', TransactionSchema);
