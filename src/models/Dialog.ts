import { Schema, model, Document } from "mongoose";

export interface IDialog extends Document {
    partner: [{
        type: Schema.Types.ObjectId;
        ref: string;
        require: true;
    }];
    // partner: {
    //     type: Schema.Types.ObjectId;
    //     ref: string;
    //     require: true;
    // };
    author: any;
    messages: [
        {
            type: Schema.Types.ObjectId;
            ref: string;
        }
    ];
}

const DialogSchema = new Schema(
    {
        partner: [{ type: Schema.Types.ObjectId, ref: "User" }],
        // partner: { type: Schema.Types.ObjectId, ref: "User" },
        author: { type: Schema.Types.ObjectId, ref: "User" },
        groupName: { type: String},
        lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    },
    {
        timestamps: true,
    }
);

export const DialogModel = model<IDialog>("Dialog", DialogSchema);
