import User from "@/schema/userSchema"
import bcrypt from "bcrypt"

export async function createUser(username: string, password: string){
    try {
        const exists = await User.findOne({username});
        if(exists) return "User already exists";

        const saltRounds = Number(process.env.HASH_SALT) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({username, password: hashedPassword});
        await newUser.save()
        return 'User created successfylly';
    } catch (err) {
        console.error("createUser error:", err);
        throw new Error(`Failed to create user: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function checkCredentials(username: string, password: string){
    try {
        const exists = await User.findOne({username}).lean();
        if(!exists) return "User does not exists";

        const passwordCheck = await bcrypt.compare(password, exists.password);
        if(!passwordCheck) return 'Password not correct';

        return exists._id;
    } catch (err) {
        console.error("checkCredentials error:", err);
        throw new Error(`Failed to check credentials: ${err instanceof Error ? err.message : String(err)}`);
    }
}