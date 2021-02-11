import dotenv from 'dotenv';
dotenv.config();
import { UserCtrl } from "./controllers/UserController";
import { DialogCtrl } from "./controllers/DialogController";

import bodyParser from "body-parser";
import { MessageCtrl } from "./controllers/MessageController";
import { lastSeenMiddleware } from "./middlewares/updateLastSeen";
import { default as loginValidation } from "./utils/validations/login";

const express = require("express");

const mongoose = require("mongoose");
const app = express();
const config = require("config");

const PORT = config.get("serverPort");

app.use(bodyParser.json());

mongoose.connect(config.get("dbUrl"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});

app.get("/user/:id", lastSeenMiddleware, UserCtrl.show);
app.post("/user/registration", UserCtrl.create);
app.post("/user/login", loginValidation, UserCtrl.login);
app.delete("/user/:id", UserCtrl.delete);

app.get("/dialogs", DialogCtrl.show);
app.post("/dialogs", DialogCtrl.create);
app.delete("/dialogs", DialogCtrl.delete);

app.get("/messages", MessageCtrl.show);
app.post("/messages", MessageCtrl.create);
app.delete("/messages", MessageCtrl.delete);

app.use(lastSeenMiddleware);

// app.get("/", function(req: any, res: any) {
//     res.json({
//         data: "User created",
//     });
//     const user = new User({
//         email: "goshana87@mail.ru",
//         fullname: "Test user",
//         password: "1987toyuiui",
//     });
//     user.save().then((data) => console.log("Create user"));
// });
