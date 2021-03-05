const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();
const { ORIGIN } = process.env;
// const corsConfig = { origin: [ORIGIN], credentials: true };

const AuthRouter = require('../routes/auth.routes')

module.exports = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use("/",AuthRouter)
};
