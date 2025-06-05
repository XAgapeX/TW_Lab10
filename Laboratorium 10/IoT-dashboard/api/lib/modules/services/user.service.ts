import UserModel from '../schemas/user.schema';
import { IUser } from '../models/user.model';

class UserService {
    public async createNewOrUpdate(user: IUser) {
        try {
            if (user.role === 'admin') {
                user.isAdmin = true;
            }

            if (!user._id) {
                const existingUser = await UserModel.findOne({ email: user.email });
                if (existingUser) {
                    throw new Error('Użytkownik z tym adresem e-mail już istnieje.');
                }

                const dataModel = new UserModel(user);
                return await dataModel.save();
            } else {
                return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
            }
        } catch (error: any) {
            console.error('Błąd podczas tworzenia użytkownika:', error.message);
            throw new Error('Błąd przy tworzeniu użytkownika');
        }
    }

    public async getByEmailOrName(name: string) {
        return await UserModel.findOne({
            $or: [{ email: name }, { name: name }]
        });
    }
}

export default UserService;
