import e, { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import UserService from '../modules/services/user.service';
import PasswordService from '../modules/services/password.service';
import TokenService from '../modules/services/token.service';
import { auth } from '../middlewares/auth.middleware';

class UserController implements Controller {
    public path = '/api/user';
    public router = Router();

    private userService: UserService;
    private passwordService: PasswordService;
    private tokenService: TokenService;

    constructor() {
        this.userService = new UserService();
        this.passwordService = new PasswordService();
        this.tokenService = new TokenService();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);
    }

    private createNewOrUpdate = async (req: Request, res: Response): Promise<void> => {
        const userData = req.body;

        try {
            const user = await this.userService.createNewOrUpdate(userData);

            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password);
                await this.passwordService.createOrUpdate({
                    userId: user._id,  // <-- poprawka tutaj
                    password: hashedPassword,
                });
            }

            res.status(200).json(user);
        } catch (error: any) {
            console.error('Validation Error:', error.message);
            res.status(400).json({ error: 'Bad request', value: error.message });
        }
    };


    private authenticate = async (req: Request, res: Response): Promise<Response> => {
        const { login, password } = req.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const isAuthorized = await this.passwordService.authorize(user.id, password);
            if (!isAuthorized) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = await this.tokenService.create(user);
            return res.status(200).json(this.tokenService.getToken(token));
        } catch (error: any) {
            console.error('Validation Error:', error.message);
            return res.status(401).json({ error: 'Unauthorized' });
        }
    };

    private removeHashSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { userId } = req.params;

        try {
            const result = await this.tokenService.remove(userId);
            res.status(200).send(result);
        } catch (error: any) {
            console.error('Validation Error:', error.message);
            res.status(401).json({ error: 'Unauthorized' });
        }
    };
}

export default UserController;
