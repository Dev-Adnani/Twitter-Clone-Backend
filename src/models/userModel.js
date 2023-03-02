const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        username:{
            type:String,
            unique:true,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            validate(value)
            {
                if(!validator.isEmail(value))
                throw new Error('Invalid Email') 
            }
        },
        password:{
            type:String,
            required:true,
            minLength:7,
            trim:true,
            validate(value)
            {
                if(value.toLowerCase().includes('password'))
                throw new Error('Invalid Password') 
            }
        },
        avatar:{
            type:Buffer,
        },
        avatarExists : 
        {
            type:Boolean,
        },
        bio:
        {
            type:String,
        },
        website:
        {
            type:String,
        },
        location:
        {
            type:String,
        },
        followers:
        {
            type:Array,
            default:[],
        },
        followings:
        {
            type:Array,
            default:[],
        }
    }
)

//tweet x user
userSchema.virtual('tweets',{
    ref:'Tweet',
    localField:'_id',
    foreignField:'user'
})


//Deleting Password Before Sending
userSchema.methods.toJSON = function()
{
    const user = this
    const userObject = user.toObject();

    delete userObject.password;
    return userObject;
}


//Hashing Password !xD
userSchema.pre('save',async function(next) {
    const user = this

    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,10)
    }
    
    next()
})


const User = mongoose.model('User',userSchema)
module.exports = User