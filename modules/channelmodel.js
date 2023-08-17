const mongoose = require('mongoose')

const Schema = mongoose.Schema

const channelschema = new Schema ({ 
    title :{
        type:String,
        required:true
    },
    ch_email :{
        type:String,
        required:true
    },
    bio :{
        type:String,
        required:true
    },
    ch_img :{
        type:String,
        default:"https://assemblee-nationale.ga/ministere/img/default-image.png"
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    isValide : {
        type : Boolean ,
        default: false
    },
    rating : {
        type : Number,
        default: 0
    },
    location :{
        type:String,
        required:true
    },
    category :{
        type:String,
        required:true
    },
}, {timestamps : true })

module.exports = mongoose.model('Channel', channelschema)
