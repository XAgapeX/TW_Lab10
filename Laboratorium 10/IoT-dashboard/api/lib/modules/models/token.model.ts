import { Schema } from 'mongoose';

export interface IToken {
    userId: Schema.Types.ObjectId;
    createDate: number;
    type: string;
    value: string;
}
