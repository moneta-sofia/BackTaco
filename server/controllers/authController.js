import { User } from "../db/models/user.js";
import { Role } from "../db/models/role.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


export async function signup(req, res) {
    const { email, user, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 15);
        const role = await Role.findOne({ name: "noRole" });
        const createUser = new User({ email, user, password: hashPassword, role });
        await createUser.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send("Error creating user" + error.message);
    }
}

export async function signin(req, res) {
    const { user, password } = req.body;
    try {
        const userFound = await User.findOne({ user });
        if (userFound && await bcrypt.compare( password,userFound.password)) {
            const token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET)
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send("Error logging in"+ error.message);
    }
}
