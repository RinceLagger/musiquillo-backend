const { Router } = require("express");
const route = Router();
const { login, signup, logout } = require("../controllers/auth.controllers");

route.post("/signup", signup).post("/login", login).post("/logout", logout);

module.exports = route;
