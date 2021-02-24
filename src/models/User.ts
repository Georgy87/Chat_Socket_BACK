import { Schema, model, Document } from "mongoose";
// import {isEmail} from "validator";

import { differenceInMinutes, parseISO } from "date-fns";

export interface IUser extends Document {
    email: string;
    fullname: string;
    password: string;
    confirmed: boolean;
    avatar?: string;
    confirm_hash?: string;
    last_seen?: Date;
}

const UserSchema = new Schema(
    {
        email: {
            type: String,
            require: "Email address is required",
            // validate: [isEmail, "Invalid email"],
            unique: true,
        },
        fullname: {
            type: String,
            required: "Fullname is required",
        },
        password: {
            type: String,
            required: "Password is required",
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
        avatar: String,
        confirm_hash: String,
        last_seen: {
            type: Date,
            default: new Date(),
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.virtual("isOnline").get(function (this: any) {
    console.log(parseISO(new Date().toISOString()));
    console.log(this.last_seen);

    return differenceInMinutes(parseISO(new Date().toISOString()), this.last_seen) < 5;
});

UserSchema.set("toJSON", {
    virtuals: true
  });

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
