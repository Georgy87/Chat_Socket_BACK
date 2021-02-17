import bodyParser from "body-parser";
import express from "express";
import socket from "socket.io";
import { default as checkAuth } from "../middlewares/checkAuth";
import { lastSeenMiddleware } from "../middlewares/updateLastSeen";

import { default as loginValidation } from "../utils/validations/login";
import { default as registerValidation } from "../utils/validations/registration";

import MessageController from "../controllers/MessageController";
import DialogController from "../controllers/DialogController";
import UserController from "../controllers/UserController";

const createRoutes = (app: express.Express, io: socket.Server) => {
    const UserCtrl = new UserController(io);
    const DialogCtrl = new DialogController(io);
    const MessageCtrl = new MessageController(io);

    app.use(bodyParser.json());
    app.use(lastSeenMiddleware);
    app.use(checkAuth);

    app.get("/user/me", UserCtrl.getMe);
    // app.get("/user/:id", UserCtrl.show);
    app.delete("/user/:id", UserCtrl.delete);
    app.post("/user/signup", registerValidation, UserCtrl.create);
    app.get("/user/verify", UserCtrl.verify);
    app.post("/user/signin", loginValidation, UserCtrl.login);

    app.get("/dialogs", DialogCtrl.show);
    app.delete("/dialogs/:id",  DialogCtrl.delete);
    app.post("/dialogs",  DialogCtrl.create);

    app.get("/messages", MessageCtrl.show);
    app.post("/messages", MessageCtrl.create);
    app.delete("/messages/:id", MessageCtrl.delete);
};

export default createRoutes;
