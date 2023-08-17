const mongoose = require('mongoose')

const Schema = mongoose.Schema

const feedbackSchema = new Schema ({ 
    userr : { 
        type:String,
        required:true
    },
    fbmsg : {
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('feedback' , feedbackSchema)