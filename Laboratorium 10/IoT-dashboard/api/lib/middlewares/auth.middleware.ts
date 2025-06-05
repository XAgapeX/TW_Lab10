import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../modules/models/user.model';

export const auth = (req: Request, res: Response, next: NextFunction): void => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token && typeof token === 'string') {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        try {
            const decoded = jwt.verify(token, config.JwtSecret) as IUser;

            console.log('Token OK:', decoded);

            if (!decoded.role) {
                console.warn('❗ Brak roli w tokenie');
            }

            (req as any).user = decoded;
            next();
        } catch (err) {
            console.error('JWT error:', err.message);
            res.status(400).send('Nieprawidłowy token.');
        }
    } else {
        res.status(401).send('Brak tokenu. Dostęp zabroniony.');
    }
};
