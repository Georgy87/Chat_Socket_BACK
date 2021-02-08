import { Schema, model } from "mongoose";
// import {isEmail} from "validator";

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

const UserModel = model("User", UserSchema);

export default UserModel;
