import express from "express";

import isAuth from "../Middlewares/isAuth.js";

import {
  getNotifications,
  readNotifications,
} from "../Controller/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get",
  isAuth,
  getNotifications
);

notificationRouter.put(
  "/read",
  isAuth,
  readNotifications
);

export default notificationRouter;