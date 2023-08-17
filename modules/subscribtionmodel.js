const mongoose = require('mongoose')
const User = require('./usermodel')
const Channel = require('./channelmodel')

const Schema = mongoose.Schema

const subscribtionSchema = new Schema ({ 
    channel_id : {
         type : mongoose.Types.ObjectId , 
         ref: Channel 
        },
    user_id : { 
        type : mongoose.Types.ObjectId , 
        ref : User
    }
},{timestamps:true})

module.exports = mongoose.model('subscribtion' , subscribtionSchema) 