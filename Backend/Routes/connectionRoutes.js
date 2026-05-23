import express from "express"

import isAuth from "../middlewares/isAuth.js"

import {
    sendConnectionRequest,
    acceptConnectionRequest
} from "../controllers/connectionController.js"

const router = express.Router()

router.put(
    "/send/:id",
    isAuth,
    sendConnectionRequest
)

router.put(
    "/accept/:id",
    isAuth,
    acceptConnectionRequest
)

export default router