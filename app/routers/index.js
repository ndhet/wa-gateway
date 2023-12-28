const { Router } = require("express");
const MessageRouter = require("./message_router");
const SessionRouter = require("./session_router");
const ApiRouter = require("./api_router");

const MainRouter = Router();

MainRouter.use(SessionRouter);
MainRouter.use(MessageRouter);
MainRouter.use(ApiRouter);
module.exports = MainRouter;
