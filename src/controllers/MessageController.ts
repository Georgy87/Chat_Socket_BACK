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
            .populate(["dialog"])
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
                        function(err) {
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
    delete = (req: express.Request, res: express.Response) => {
        const id = req.query.id;
        MessageModel.findOneAndDelete({ _id: id })
            .then((message) => {
                if (message) {
                    res.json({
                        message: `Message deleted`,
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: `Message not found`,
                });
            });
    }
}

export default MessageController;
