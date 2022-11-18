const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/auth");
const AuthController = require("../controllers/auth");

router.post("/register", AuthController.register);
router.post("/login", AuthMiddleWare.isValidLoginRequest,AuthController.login)
router.post("/refresh_token",  AuthController.RefreshToken)

module.exports = router;