import { Schema, Document, model } from "mongoose";

export interface IMessage extends Document {
    text: {
        type: string;
        require: boolean;
    };
    // dialog: {
    //     type: Schema.Types.ObjectId | string;
    //     ref: string;
    //     require: true;
    // };
    dialog: any;
    readed: {
        type: boolean;
        default: false;
    };
}

// TODO: Сделать аттач файлов
// attachemets:
const MessageSchema = new Schema(
    {
        text: { type: String, require: Boolean },
        dialog: { type: Schema.Types.ObjectId, ref: "Dialog", require: true },
        user: { type: Schema.Types.ObjectId, ref: "User", require: true },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const MessageModel = model<IMessage>("Message", MessageSchema);

export default MessageModel;
