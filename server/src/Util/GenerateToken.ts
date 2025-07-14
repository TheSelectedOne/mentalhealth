import jwt from "jsonwebtoken";

export const GenerateToken = (id: string, username: string) => {
    //jwt.sign second parameter should be a secret token/password stored in .env file
    const token = jwt.sign({ id, username }, "string");
    return token;
};