const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "twitter");

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("User Does'nt Exists");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(404).send({error:'Authentication Issue'});
  }
};


module.exports = auth;
