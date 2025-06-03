import UserModel from '../schemas/user.schema';
import { IUser } from '../models/user.model';

class UserService {
    public async createNewOrUpdate(user: IUser) {
        try {
            if (user.role === 'admin') {
                user.isAdmin = true;
            }

            if (!user._id) {
                const dataModel = new UserModel(user);
                return await dataModel.save();
            } else {
                return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
            }
        } catch (error) {
            console.error('Błąd podczas tworzenia użytkownika:', error);
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
