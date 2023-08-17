const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reportSchema = new Schema ({ 
    channel : {
        type:String,
        required:true
        },
    userr : { 
        type:String,
        required:true
    },
    rprtmsg : {
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('report' , reportSchema)