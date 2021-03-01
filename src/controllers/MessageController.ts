import express from "express";
import { DialogModel } from "../models/Dialog";
import MessageModel from "../models/Message";
import socket from "socket.io";
class MessageController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    show = (req: express.Request, res: express.Response) => {
        const dialogId = req.query.dialog;
        MessageModel.find({ dialog: dialogId })
            .populate(["dialog", "user"])
            .exec((err, messages) => {
                if (err) {
                    res.status(404).json({
                        message: "Messages not found",
                    });
                }
                return res.json(messages);
            });
    }

    create = (req: any, res: express.Response) => {
        const userId = req.user._id;

        const postData = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            user: userId,
        };

        const message = new MessageModel(postData);

        message
            .save()
            .then((obj: any) => {
                obj.populate(["dialog", "user"], (err: any, message: any) => {
                    if (err) {
                        res.status(500).json({
                            message: err
                        });
                    }
                    DialogModel.findOneAndUpdate(
                        { _id: postData.dialog },
                        { lastMessage: message._id },
                        { upsert: true },
                        function (err) {
                            if (err) {
                                return res.status(500).json({
                                    status: "error",
                                    message: err
                                });
                            }
                        }
                    );
                    res.json(message);
                    this.io.emit("SERVER:NEW_MESSAGE", message);
                });
            })
            .catch((reason) => {
                res.json(reason);
            });
    }

    delete = (req: any, res: express.Response): void => {
        const id: string = req.query.id;
        const userId: string = req.user._id;

        MessageModel.findById(id, (err: any, message: any) => {
            if (err || !message) {
                return res.status(404).json({
                    status: "error",
                    message: "Message not found",
                });
            }

            if (message.user.toString() === userId) {
                const dialogId = message.dialog;
                message.remove();

                MessageModel.findOne({ dialog: dialogId }).sort({ createdAt: -1 })
                    .exec((err: any, lastMessage: any) => {
                        if (err) {
                            res.status(500).json({
                                status: "error",
                                message: err,
                            });
                        }

                        DialogModel.findById(dialogId, (err: any, dialog: any) => {
                            if (err) {
                                res.status(500).json({
                                    status: "error",
                                    message: err,
                                });
                            }

                            if (!dialog) {
                                return res.status(404).json({
                                    status: "not found",
                                    message: err,
                                });
                            }

                            dialog.lastMessage = lastMessage._id.toString();
                            dialog.save();
                            this.io.emit("SERVER:DIALOG_CREATED");
                        });
                    });
                    return res.json({
                        status: "success",
                        message: "Message deleted",
                      });
            } else {
                return res.status(403).json({
                    status: "error",
                    message: "Not have permission",
                });
            }
        });
    }
}
export default MessageController;
