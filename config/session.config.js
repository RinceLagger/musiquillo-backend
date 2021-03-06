require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
//const { SESSION_SECRET, MONGODB_URI } = process.env;
module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 24,
      }),
    })
  );
};