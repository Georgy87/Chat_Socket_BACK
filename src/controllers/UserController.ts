import express from "express";
import { UserModel } from "../models";
import { IUser } from "../models/User";
class UserController {
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
    create(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password,
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
    // delete = (req: express.Request, res: express.Response): void => {
    //     const id: string = req.params.id;
    //     UserModel.findOneAndRemove({ _id: id })
    //         .then((user: IUser | null) => {
    //             if (user) {
    //                 res.json({
    //                     message: `User ${user.fullname} deleted`,
    //                 });
    //             } else {
    //                 res.status(404).json({
    //                     status: "error",
    //                 });
    //             }
    //         })
    //         .catch((err: any) => {
    //             res.json({
    //                 message: err,
    //             });
    //         });
    // };
    
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

export const UserCtrl = new UserController();
