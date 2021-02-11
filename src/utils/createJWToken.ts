import jwt from "jsonwebtoken";

export const createJWToken = (user: any) => {
    let token = jwt.sign(
        {
            password: user.password,
        },
        process.env.JWT_SECRET || "",
        {
            expiresIn: process.env.JWT_MAX_AGE,
            algorithm: "HS256",
        }
    );
    return token;
};
