import User from "../schema/userSchema"
import bcrypt from "bcrypt"

const UserModel = {
    async createUser(username: string, password: string) {
        try {
            const exists = await User.findOne({ username });
            if (exists) return { status: 409, message: "User already exists" };

            const saltRounds = Number(process.env.HASH_SALT) || 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new User({ username, password: hashedPassword });
            await newUser.save()
            return { status: 201, message: 'User created successfully' };
        } catch (err) {
            console.error("createUser error:", err);
            throw new Error(`Failed to create user: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async checkCredentials(username: string, password: string) {
        try {
            const exists = await User.findOne({ username }).lean();
            if (!exists) return { status: 404, message: "User does not exist" };

            const passwordCheck = await bcrypt.compare(password, exists.password);
            if (!passwordCheck) return { status: 401, message: 'Password not correct' };

            return { status: 200, userId: exists._id };
        } catch (err) {
            console.error("checkCredentials error:", err);
            throw new Error(`Failed to check credentials: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async storeUserToken(userId: string, token: string) {
        try {
            const updated = await User.findByIdAndUpdate(
                userId,
                { token },
                { new: true }
            ).lean();

            if (!updated) return { status: 404, message: "User not found" };
            return { status: 200, message: "Token stored successfully" };
        } catch (err) {
            console.error("storeUserToken error:", err);
            throw new Error(`Failed to store user token: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async removeToken(userId: string) {
        try {
            const updated = await User.findByIdAndUpdate(
                userId,
                { token: null },
                { new: true }
            ).lean();

            if (!updated) return { status: 404, message: "User not found" };
            return { status: 200, message: "Token removed successfully" };
        } catch (err) {
            console.error("removeToken error:", err);
            throw new Error(`Failed to remove user token: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async findById(userId: string) {
        try {
            const user = await User.findById(userId).lean();
            if (!user) return { status: 404, message: "User not found" };
            return { status: 200, data: user };
        } catch (err) {
            console.error("findById error:", err);
            throw new Error(`Failed to find user by ID: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
}

export default UserModel;