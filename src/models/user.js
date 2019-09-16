const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true,
    },
    email: {
        unique:true,
        type: String,
        required: true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please enter valid email address')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim:true,
        validate(value){
            if(!validator.isLength(value,{min:6}) || validator.equals(value,'password')){
                throw new Error('Password not strong enough')
            }
        }
    }, 
    age:{
        type: Number,
        default:0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a possitive number')
            }
        }
    },
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks', {     
    ref: 'Task',
    localField: '_id',     
    foreignField: 'owner' 
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id: user._id.toString()},'danFronklin')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    console.log(userObject)
    return userObject
}


userSchema.statics.findByCredentials = async(email,password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}

//Delete user task if user is removed
userSchema.pre('remove',async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

//Hash Plain text password before saving
userSchema.pre('save',async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User