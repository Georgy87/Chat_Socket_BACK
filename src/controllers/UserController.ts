import express from "express";
import { UserModel } from "../models";
import { IUser } from "../models/User";
import { validationResult } from "express-validator";
import { default as createJWToken } from "../utils/createJWToken";
import bcrypt from "bcrypt";
import socket from "socket.io";
class UserController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    show(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        UserModel.findById(id, (err: any, user: any) => {
            if (err) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            res.json(user);
        });
    }

    getMe(req: any, res: any) {
        const id: string = req.user._id;
        UserModel.findById(id, (err: any, user: any) => {
            if (err) {
                return res.status(404).json({
                    message: "User is not authorization",
                });
            }
            res.json(user);
        });
    }

    async create(req: express.Request, res: express.Response) {
        const hashPassword = await bcrypt.hash(req.body.password, 8);

        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: hashPassword,
        };
        const user = new UserModel(postData);
        user.save()
            .then((obj: any) => {
                res.json(obj);
            })
            .catch((reason) => {
                res.json(reason);
            });
    }

    login(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password,
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        UserModel.findOne({ email: postData.email }).exec(function(
            err: any,
            user: any
        ) {
            if (err) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            if (bcrypt.compareSync(postData.password, user.password)) {
                const token = createJWToken(user);
                res.json({
                    status: "success",
                    token,
                });
            } else {
                res.json({
                    status: "error",
                    message: "Incorrect password or email",
                });
            }
        });
    }

    delete(req: express.Request, res: express.Response) {
        const id = req.params.id;
        UserModel.findOneAndRemove({ _id: id })
            .then((user: IUser | null) => {
                if (user) {
                    res.json({
                        message: `User ${user.fullname} deleted`,
                    });
                } else {
                    res.status(404).json({
                        status: "error",
                    });
                }
            })
            .catch((err: any) => {
                res.json({
                    message: err,
                });
            });
    }
}

export default UserController;
