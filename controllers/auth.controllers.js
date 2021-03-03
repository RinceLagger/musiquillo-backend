const User = require("../model/user.model");
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
    const { username, password, email } = req.body;
    const hasMissingCredentials = !password || !email || !username;

    if (hasMissingCredentials) {
      return res.send(400).json({ message: "missing credentials" });
    }

    if (!hasCorrectPassword(password)) {
      return res.send(400).json({ message: "wrong format password" });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.send(400).json({ message: "user alredy exists" });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, email, hashedPassword });
    return res.send(200).json({ user: username });
  } catch (e) {
    return res.send(400).json({ message: "wrong request" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, email } = req.body;
    const hasMissingCredentials = !username || !email;
    if (hasMissingCredentials) {
      return res.send(400).json({ message: "missing credentials" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.send(400).json({ message: "user does not exist" });
    }
    const hasCorrectPassword = await bcrypt.compare(
      password,
      user.hashedPassword
    );
    if (!hasCorrectPassword) {
      return res.send(401).json({ message: "unauthorize" });
    }
    return res.send(200).json({ user: user.username });
  } catch (e) {
    return res.send(400).json({ message: "wrong request" });
  }
};
