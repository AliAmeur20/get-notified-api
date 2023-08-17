const mongoose = require('mongoose')
const User = require('./usermodel')
const Channel = require('./channelmodel')

const Schema = mongoose.Schema

const ratingschema = new Schema ({ 
    channel_id : {
        type : mongoose.Types.ObjectId , 
        ref: Channel 
       },
    user_id : { 
       type : mongoose.Types.ObjectId , 
       ref : User
   },
    note :{
        type:Number,
        required:true
    },
    comment :{
        type:String,
    }
}, {timestamps : true })

module.exports = mongoose.model('Rating', ratingschema)
