// import express from "express";
import { default as verifyJWTToken } from "../utils/verifyJWTToken";

export default (req: any, res: any, next: any) => {
    if (req.path === "/user/signin" || req.path === "/user/signup" || req.path === "/user/verify") {
        console.log(req.path);
        return next();
    }

    const token = req.headers.token;
    verifyJWTToken(token)
        .then((user: any) => {
            req.user = user.data._doc;
            next();
        })
        .catch(() => {
            res.status(403).json({ message: "Invalid auth token provided." });
        });
};
