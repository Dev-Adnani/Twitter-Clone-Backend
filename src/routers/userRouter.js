const express = require('express')
const User = require('../models/userModel')
const userRouter = new express.Router()


//Create User
userRouter.post('/users',async(req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Fetch User
userRouter.get('/users',async(req,res) => 
{
    try {
        const users = await User.find({})
        res.send(users);
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = userRouter
