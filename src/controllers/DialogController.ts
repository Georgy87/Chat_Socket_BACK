import express from "express";
import { DialogModel } from "../models/Dialog";

class DialogController {
    index(req: express.Request, res: express.Response) {
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
        dialog.save()
            .then((obj: any) => {
                res.json(obj);
            })
            .catch((reason) => {
                res.json(reason);
            });
    }
}

export const DialogCtrl = new DialogController();
