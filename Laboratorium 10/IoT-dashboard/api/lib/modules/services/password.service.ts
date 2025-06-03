import PasswordModel from '../schemas/password.schema';
import bcrypt from 'bcrypt';

class PasswordService {
    public async createOrUpdate(data: any) {
        const result = await PasswordModel.findOneAndUpdate(
            { userId: data.userId },
            { $set: { password: data.password } },
            { new: true }
        );

        if (!result) {
            const newEntry = new PasswordModel(data);
            return await newEntry.save();
        }

        return result;
    }

    public async authorize(userId: string, password: string): Promise<boolean> {
        try {
            const found = await PasswordModel.findOne({ userId });
            if (!found) return false;

            const isMatch = await bcrypt.compare(password, found.password);
            return isMatch;
        } catch (err) {
            console.error('Błąd podczas autoryzacji:', err);
            throw new Error('Błąd autoryzacji');
        }
    }

    public async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashed = await bcrypt.hash(password, saltRounds);
        return hashed;
    }
}

export default PasswordService;
