import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import TokenModel from '../schemas/token.schema';
import { config } from '../../config';

class TokenService {
    public async create(user: any) {
        const userData = {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin,
            access: 'auth'
        };

        const value = jwt.sign(userData, config.JwtSecret, { expiresIn: '3h' });

        const tokenDoc = new TokenModel({
            userId: new mongoose.Types.ObjectId(user._id),
            type: 'authorization',
            value,
            createDate: Date.now()
        });

        return await tokenDoc.save();
    }

    public getToken(token: any) {
        return { token: token.value };
    }


    public async remove(userId: string) {
        try {
            const objectId = new mongoose.Types.ObjectId(userId);
            return await TokenModel.deleteOne({ userId: objectId });
        } catch (error) {
            console.error('Błąd usuwania tokenu:', error.message);
            throw new Error('Nieprawidłowy userId');
        }
    }

    public async removeExpiredTokens() {
        const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
        return await TokenModel.deleteMany({ createDate: { $lt: threeHoursAgo } });
    }
}

export default TokenService;
