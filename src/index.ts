const express = require("express");
const mongoose = require("mongoose");
const app = express();
const config = require("config");

import { UserCtrl } from "./controllers/UserController";
import { DialogCtrl } from './controllers/DialogController';

import bodyParser from "body-parser";

const PORT = config.get('serverPort');

app.use(bodyParser.json());

mongoose.connect(config.get("dbUrl"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});

app.get("/user/:id", UserCtrl.show);
app.post("/user/registration", UserCtrl.create);
app.delete("/user/:id", UserCtrl.delete);

app.get("/dialogs", DialogCtrl.index);
app.post("/dialogs", DialogCtrl.create);

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
