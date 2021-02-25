import express from "express";
import { UserModel } from "../models";
import { IUser } from "../models/User";
import { validationResult } from "express-validator";
import { default as createJWToken } from "../utils/createJWToken";
import bcrypt from "bcrypt";
import socket from "socket.io";
import { mailer } from "../core/mailer";
import { SentMessageInfo } from "nodemailer/lib/smtp-connection";
class UserController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    show(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        UserModel.findById(id, (err: any, user: any) => {
            if (err || !user) {
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

        const user = new UserModel({
            email: req.body.email,
            fullname: req.body.fullname,
            password: hashPassword,
        });

        user.confirm_hash = await bcrypt.hash(new Date().toString(), 8);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        user.save()
            .then((obj: any) => {
                res.json(obj);
                mailer.sendMail(
                    {
                        from: "admin@test.com",
                        to: req.body.email,
                        subject: "Подтверждение почты React Chat Tutorial",
                        html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:3000/signup/verify?hash=${obj.confirm_hash}">по этой ссылке</a>`,
                    },
                    function (err: Error | null, info: SentMessageInfo) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(info);
                        }
                    }
                );
            })
            .catch((reason) => {
                res.json(reason);
            });
    }

    verify = (req: express.Request, res: express.Response): void => {
        const hash: any = req.query.hash;

        if (!hash) {
            res.status(422).json({ errors: "Invalid hash" });
        } else {
            UserModel.findOne({ confirm_hash: hash }, (err: any, user: IUser) => {
                if (err || !user) {
                    return res.status(404).json({
                        status: "error",
                        message: "Hash not found",
                    });
                }

                user.confirmed = true;
                user.save((err: any) => {
                    if (err) {
                        return res.status(404).json({
                            status: "error",
                            message: err,
                        });
                    }

                    res.json({
                        status: "success",
                        message: "Аккаунт успешно подтвержден!",
                    });
                });
            });
        }
    };

    login(req: any, res: express.Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password,
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        UserModel.findOne({ email: postData.email }).exec(function (
            err: any,
            user: any
        ) {
            if (err) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            console.log(user);
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
