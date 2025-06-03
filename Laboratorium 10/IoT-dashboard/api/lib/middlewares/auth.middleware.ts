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
            (req as any).user = decoded; // jeśli nie masz rozszerzenia typów
            next();
        } catch (err) {
            res.status(400).send('Nieprawidłowy token.');
        }
    } else {
        res.status(401).send('Brak tokenu. Dostęp zabroniony.');
    }
};
