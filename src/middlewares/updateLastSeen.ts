import express from "express";
import { UserModel } from "../models";

export const lastSeenMiddleware = (req: any, res: any, next: express.NextFunction) => {
    res
    if (req.user) {

        UserModel.findOneAndUpdate(
          { _id: req.user._id },
          {
            last_seen: new Date()
          },
          { new: true },
          () => {}
        );
      }
      next();
};

