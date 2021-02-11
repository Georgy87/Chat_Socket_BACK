import jwt from "jsonwebtoken";

export const verifyJWTToken = (token: string) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || "", (err, decodedData) => {
            if (err || !decodedData) {
                return reject(err);
            }
            resolve(decodedData);
        });
    });
