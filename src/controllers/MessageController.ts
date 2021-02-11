import express from "express";
import { DialogModel } from "../models/Dialog";
import MessageModel from "../models/Message";

class MessageController {
    show(req: express.Request, res: express.Response) {
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
    create(req: express.Request, res: express.Response) {
        const userId = "6022a0e1b8b6ee05597b9f1f";

        const postData = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            user: userId,
        };

        const message = new MessageModel(postData);

        message
            .save()
            .then((obj: any) => {
                res.json(obj);
            })
            .catch((reason) => {
                res.json(reason);
            });
    }
    delete(req: express.Request, res: express.Response) {
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

export const MessageCtrl = new MessageController();
