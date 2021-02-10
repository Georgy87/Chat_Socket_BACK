import express from "express";
import { DialogModel, IDialog } from "../models/Dialog";
import MessageModel from "../models/Message";

class DialogController {
    show(req: express.Request, res: express.Response) {
        const authorId = "6022a0e1b8b6ee05597b9f1f";
        DialogModel.find({ author: authorId })
            .populate(["author", "partner"])
            .exec((err, dialogs) => {
                if (err) {
                    res.status(404).json({
                        message: "Dialogs not found",
                    });
                }
                return res.json(dialogs);
            });
    }
    create(req: express.Request, res: express.Response) {
        const postData = {
            author: req.body.author,
            partner: req.body.partner,
        };
        const dialog = new DialogModel(postData);

        dialog
            .save()
            .then((dialogObj: any) => {
                const message = new MessageModel({
                    text: req.body.text,
                    user: req.body.author,
                    dialog: dialogObj._id,
                });

                message
                    .save()
                    .then(() => {
                        res.json(dialogObj);
                    })
                    .catch((reason) => {
                        res.json(reason);
                    });
            })
            .catch((reason) => {
                res.json(reason);
            });
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

export const DialogCtrl = new DialogController();
