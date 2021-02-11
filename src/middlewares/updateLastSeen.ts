import express from "express";
import { UserModel } from "../models";

export const lastSeenMiddleware = (_: express.Request, __: express.Response, next: express.NextFunction) => {
    UserModel.findOneAndUpdate(
        { _id: "6022870eb8b6ee05597b9f1e" },
        {
            fullname: "Georgy Petrenko",
            last_seen: new Date(),
        },
        { new: true },
        () => {}
    );
    next();
};

