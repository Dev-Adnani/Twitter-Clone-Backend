const express = require("express");
const Tweet = require("../models/tweetModel");
const auth = require("../middleware/authMiddleware");

const tweetRouter = new express.Router();

//Post A  Tweet
tweetRouter.post("/tweet/post", auth, async (req, res) => {
  const tweet = new Tweet({
    ...req.body,
    user: req.user._id,
  });

  try {
    await tweet.save();
    res.status(201).send(tweet);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = tweetRouter;

