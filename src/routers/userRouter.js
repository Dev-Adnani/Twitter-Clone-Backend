const express = require("express");
const User = require("../models/userModel");
const userRouter = new express.Router();

//Create User
userRouter.post("/users/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Fetch User
userRouter.get("/users/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

//login
userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete
userRouter.delete("/users/del/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const msg = "User Doesnt Exists";
      res.status(400).send(msg);
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get Specific User
userRouter.get("/users/specific/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const msg = "User Doesnt Exists";
      res.status(404).send(msg);
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = userRouter;
