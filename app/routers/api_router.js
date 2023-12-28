const { Router } = require("express");

const {
	Chatgpt
       } = require("../controllers/api_controller.js");

const ApiRouter = Router();


ApiRouter.all("/chatgpt", Chatgpt);

module.exports = ApiRouter;
