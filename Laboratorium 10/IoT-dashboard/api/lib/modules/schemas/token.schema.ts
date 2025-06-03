import { Schema, model } from 'mongoose';
import { IToken } from '../models/token.model';

const TokenSchema = new Schema<IToken>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createDate: { type: Number, required: true },
    type: { type: String, enum: ['authorization'], required: true },
    value: { type: String, required: true }
});

export default model<IToken>('Token', TokenSchema);
