const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { Error } = require("mongoose");

const hasCorrectPassword = (password) => {
  const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
  return passwordRegex.test(password);
};

const isMongooseValidationError = (error) =>
  error instanceof Error.ValidationError;

const isMongoError = ({ code: errorCode }) => errorCode === 11000;

exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    const { username, password, email } = req.body;
    const hasMissingCredentials = !password || !email || !username;

    if (hasMissingCredentials) {
      return res.status(400).json({ message: "missing credentials" });
    }

    if (!hasCorrectPassword(password)) {
      return res.status(400).json({ message: "wrong format password" });
    }
    const user = await User.findOne({ username });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: "user alredy exists" });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHashed = await bcrypt.hash(password, salt);
    console.log(passwordHashed);

    const avatarArray = [
      "https://res.cloudinary.com/df2kqbhix/image/upload/v1616751761/Avatar1_zrakdm.png",
      "https://res.cloudinary.com/df2kqbhix/image/upload/v1616751761/Avatar2_sowcia.png",
      "https://res.cloudinary.com/df2kqbhix/image/upload/v1616751761/Avatar3_hzhbxx.png",
      "https://res.cloudinary.com/df2kqbhix/image/upload/v1616751761/Avatar4_atc53o.png",
      "https://res.cloudinary.com/df2kqbhix/image/upload/v1616751761/Avatar5_b876ad.png",
    ];

    const avatarImg = avatarArray[Math.floor(Math.random() * 6)] ; 

    const {
      _doc: { hashedPassword, ...usuario },
    } = await User.create({
      username,
      email,
      hashedPassword: passwordHashed,
      imgUser: avatarImg,
    });
    //req.session.currentUser = usuario;
    console.log(req.session);
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(400).json({ message: "wrong request" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const hasMissingCredentials = !password || !username;
    if (hasMissingCredentials) {
      return res.status(400).json({ message: "missing credentials" });
    }
    const {
      _doc: { hashedPassword, ...user },
    } = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    const hasCorrectPassword = await bcrypt.compare(password, hashedPassword);
    if (!hasCorrectPassword) {
      return res.status(401).json({ message: "unauthorize" });
    }

    console.log(req.session);
    req.session.currentUser = user;
    return res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ message: "wrong request" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  return res.status(200).json({ message: "logout!" });
};
