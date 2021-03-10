import express from "express";
import { DialogModel, IDialog } from "../models/Dialog";
import MessageModel from "../models/Message";
import socket from "socket.io";

class DialogController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }
    show(req: any, res: express.Response) {
        const userId = req.user._id;

        DialogModel.find()
            .or([{ author: userId }, { partner: userId }])
            .populate(['author', 'partner'])
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'user',
                },
            })
            .exec((err, dialogs) => {

                if (err) {
                    res.status(404).json({
                        message: "Dialogs not found",
                    });
                }
                return res.json(dialogs);
            });
    }

    create = (req: any, res: express.Response) => {
        // const arr = ["6043b8c2ba55502c6739d8fb", "6040f4bc1f99a7b5992d882c", "602ad55a9725bfd6334b398a"]
        const textForCreateGroup = "Группа созданна";

        if (req.body.groupName) {
            const groupData = {
                author: req.user._id,
                partner: ["6043b8c2ba55502c6739d8fb", "6040f4bc1f99a7b5992d882c", "602ad55a9725bfd6334b398a", "6037c1464206fc81bbce8161"],
                groupName: req.body.groupName
            };

            const dialogGroup = new DialogModel(groupData);

            dialogGroup
                .save()
                .then((dialogObj: any) => {
                    const message = new MessageModel({
                        text: textForCreateGroup,
                        user: req.user._id,
                        dialog: dialogObj._id
                    });

                    message
                        .save()
                        .then(() => {
                            dialogObj.lastMessage = message._id;
                            dialogObj.save().then(() => {
                                res.json(dialogObj);
                                this.io.emit("SERVER:DIALOG_CREATED", {
                                    ...groupData,
                                    dialog: dialogObj
                                });
                            });
                        })
                        .catch(reason => {
                            res.json(reason);
                        });
                })
        } else {
            const postData = {
                author: req.user._id,
                partner: req.body.partner,
            };

            const dialog = new DialogModel(postData);

            dialog
                .save()
                .then((dialogObj: any) => {
                    const message = new MessageModel({
                        text: req.body.text,
                        user: req.user._id,
                        dialog: dialogObj._id
                    });

                    message
                        .save()
                        .then(() => {
                            dialogObj.lastMessage = message._id;
                            dialogObj.save().then(() => {
                                res.json(dialogObj);
                                this.io.emit("SERVER:DIALOG_CREATED", {
                                    ...postData,
                                    dialog: dialogObj
                                });
                            });
                        })
                        .catch(reason => {
                            res.json(reason);
                        });
                });

        }
    }

    delete(req: express.Request, res: express.Response) {
        const id = req.params.id;

        DialogModel.findOneAndRemove({ _id: id })
            .then((dialog: IDialog | null) => {
                if (dialog) {
                    res.json({
                        message: `Dialog deleted`,
                    });
                } else {
                    res.status(404).json({
                        status: "Dialog not found",
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

export default DialogController;
