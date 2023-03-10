const express = require("express");
const User = require("../models/userModel");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/authMiddleware");

const userRouter = new express.Router();

//Helper
const imgUpload = multer({
  limits: {
    fileSize: 10000000,
  },
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

//Get Specific User
userRouter.get("/users/specific/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User Does'nt Exists");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});


//Get Specific Avatar User
userRouter.get("/user/specificAvatar/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("User Does'nt Exists");
    }
    
    res.set('Content-Type','image/jpg')
    res.send(user.avatar);
  } catch (error) {
    res.status(500).send(error);
  }
});


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

//Image
userRouter.post("/users/me/avatar" ,auth ,imgUpload.single("avatar"), async (req, res) => {
  
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

      
    if (req.user.avatar != null) {
      req.user.avatar = null;
      req.user.avatarExists = false;
    }
    req.user.avatar = buffer;
    req.user.avatarExists = true;
    await req.user.save();

    res.send(buffer);

  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);


//Follow Users
userRouter.put("/users/:id/follow" , auth ,async (req, res) => {
  
  if(req.user.id != req.params.id)
  {
    try {
      const user = await User.findById(req.params.id); 
      if(!user.followers.includes(req.user.id))
      {
        await user.updateOne({$push:{followers:req.user.id}});
        await req.user.updateOne({$push:{followings:req.params.id}});
        res.status(200).json("User Has Been Followed");
      }
      else
      {
        res.status(403).json("Your Are Already Following The User");
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
  else
  {
    res.status(403).json("You Cannot Follow Yourself ")
  }
});

//unFollow Users
userRouter.put("/users/:id/unfollow" , auth ,async (req, res) => {
  
  if(req.user.id != req.params.id)
  {
    try {
      const user = await User.findById(req.params.id); 
      if(user.followers.includes(req.user.id))
      {
        await user.updateOne({$pull:{followers:req.user.id}});
        await req.user.updateOne({$pull:{followings:req.params.id}});
        res.status(200).json("User Has Been Unfollowed");
      }
      else
      {
        res.status(403).json("Your Are Not Following The User!");
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
  else
  {
    res.status(403).json("You Cannot UnFollow Yourself ")
  }
});

//Delete User
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

//Update User
userRouter.patch('/users/me',auth,async (req,res) =>
{
  const updates = Object.keys(req.body);
  const allowUpdates = ['name','email','password','website','bio','location']

  const isValidOp = updates.every((update) => allowUpdates.includes(update));
 
  if(!isValidOp) 
  {
    return res.status(400).send({error : "Invalid Request"})
  }
  else
  {
    try {

      const user = req.user;
      updates.forEach((update) => {user[update] =req.body[update]})
      await user.save();
      res.send(user)

    } catch (error) {
          return res.status(400).send(error)
    }
  }
})


module.exports = userRouter;
