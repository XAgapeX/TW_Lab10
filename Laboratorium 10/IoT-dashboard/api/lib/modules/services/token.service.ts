import jwt from 'jsonwebtoken';
import TokenModel from '../schemas/token.schema';
import { config } from '../../config';

class TokenService {
    public async create(user: any) {
        const access = 'auth';
        const userData = {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin,
            access: 'auth'
        };

        const value = jwt.sign(userData, config.JwtSecret, { expiresIn: '3h' });

        const tokenDoc = new TokenModel({
            userId: user.id,
            type: 'authorization',
            value,
            createDate: new Date().getTime()
        });

        return await tokenDoc.save();
    }

    public getToken(token: any) {
        return { token: token.value };
    }

    public async remove(userId: string) {
        return await TokenModel.deleteOne({ userId });
    }
}

export default TokenService;
