const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//register function
async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user !== null) {
      return res.status(409).send({ message: "user already register!" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: passwordHash,
    });
    res.status(201).send({
      user: {
        email: email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

//login function
async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (user === null) {
      return res.status(401).send({ message: "email is incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "password is incorrect" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    return res.send({ token });
  } catch (error) {
    next(error);
  }
  res.send("OK");
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }).exec();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout };
