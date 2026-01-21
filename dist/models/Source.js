import mongoose, { Schema } from 'mongoose';
const SourceSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['bank', 'cash', 'credit_card'], required: true },
    balance: { type: Number, required: true, default: 0 },
    creditLimit: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model('Source', SourceSchema);
