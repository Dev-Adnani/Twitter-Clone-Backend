const express = require("express");
const Tweet = require("../models/tweetModel");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const sharp = require("sharp");

const tweetRouter = new express.Router();

//Helper
const upload = multer({
  limits: {
    fileSize: 10000000,
  },
});

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

//Get All Tweets
tweetRouter.get("/tweet/all", async (req, res) => {
  try {
    const tweet = await Tweet.find({});
    res.send(tweet);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Tweet Image Upload
tweetRouter.post("/tweet/uploadTweetImg/:id", auth,upload.single('upload'),async (req, res) => {

    const tweet = await Tweet.findOne({ _id: req.params.id });

    if (!tweet) {
      throw new Error("Cannot Find The Tweet");
    }

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 350, height: 350 })
      .png()
      .toBuffer();

    tweet.image = buffer;
    await tweet.save()
    res.send();
    
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });

  }
);

//Get Image 
tweetRouter.get("/tweet/:id/img", async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet || !tweet.image) {
        throw new Error("Tweet Does'nt Exists");
      }
      
      res.set('Content-Type','image/jpg')
      res.send(tweet.image);
    } catch (error) {
      res.status(500).send(error);
    }
  });


//Like Tweet 
tweetRouter.put("/tweet/:id/like" , auth ,async (req, res) => {
    const tweet = await Tweet.findById(req.params.id);

    try {
        if(!tweet.likes.includes(req.user.id))
        {
          await tweet.updateOne({$push:{likes:req.user.id}});
          res.status(200).json("Tweet Has Been Liked");
        }
        else
        {
          res.status(403).json("Your have already tweet Has Been Likedr");
        }

    } catch (error) {
        res.status(500).json(error)
    }

  });

  //Unlike Tweet 
tweetRouter.put("/tweet/:id/unlike" , auth ,async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
 
  try {
      
      if(tweet.likes.includes(req.user.id))
      {
        await tweet.updateOne({$pull:{likes:req.user.id}});
        res.status(200).json("Tweet Has Been unLiked");
      }
      else
      {
        res.status(403).json("Your have already unLiked tweet");
      }

  } catch (error) {
      res.status(500).json(error)
  }

});


module.exports = tweetRouter;
