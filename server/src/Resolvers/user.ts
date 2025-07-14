import { User } from "../Entities/User";
import { nanoid } from "nanoid";
import { Response } from "express";
import { GenerateToken } from "../Util/GenerateToken";

interface RegisterInterface {
    username: string;
    userWallet: string;
}

export const createUser = async (data: RegisterInterface, res: Response) => {
    const id = nanoid();
    const user = User.create({
        id,
        username: data.username,
        userWallet: data.userWallet,
    })
    await user.save().catch((err) => {
        console.error("Error creating user:", err);
        return res.send({ Error: "Something went wrong" }).status(500).end()
    })
    const token = GenerateToken(user.id, user.username);
    res.cookie("token", token, { httpOnly: true })
    return res.send(user).status(200).end();
}