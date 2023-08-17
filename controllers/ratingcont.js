const mongoose = require('mongoose')
const Rating = require('../modules/ratingmodel')
const Channel = require ('../modules/channelmodel')

// get channel ratings
const getRatings = async (req,res) => {
    const {id} = req.params
    try{
        const ratings = await Rating.find({channel_id:id}).populate('user_id')
        res.status(200).json(ratings)
    }catch(err){
        res.status(400).json({err:err.message})
    }
   

}

//create rating for a channel
const createRating = async (req,res) => {
    const user_id = req.user._id
    const channel_id = req.params.id
    const {note,comment} = req.body

    try{
        const isRated = await Rating.findOne({channel_id:channel_id , user_id:user_id})
        if(isRated){
            return res.status(400).json('you already rated this channel!')
        }
        const ratings = (await Rating.find({channel_id:channel_id})).length
        const chnnl = await Channel.find({_id:channel_id})
        const currentRating = chnnl[0].rating
        const newRating = (currentRating * ratings + note )/(1+ratings)
        const channel = await Channel.findOneAndUpdate({_id:channel_id} , { rating:newRating } , { new : true })
        
        const rating = await Rating.create({channel_id,user_id,note,comment})
        
        res.status(200).json({rating,channel})
    }catch(err){
        res.status(400).json({err:err.message})
    }
}

module.exports = {
    getRatings,
    createRating
}