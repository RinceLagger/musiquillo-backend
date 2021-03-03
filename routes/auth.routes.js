const { Router } = require("express");
const route = Router();
const { login, signup } = require("../controllers/auth.controllers");

route.post("/signup", signup).post("/login", login);

module.exports = route;
