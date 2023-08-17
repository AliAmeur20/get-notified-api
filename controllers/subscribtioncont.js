const Subscribtion = require('../modules/subscribtionmodel')
const mongoose = require('mongoose')
const amqplib = require('amqplib')
 
const exchangeName = 'getNotified'



//subscribe
const Subscribe =async (req,res) => {
    const channel_id = req.params.id
    const user_id = req.user.id
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchangeName , 'direct' , {durable : true})
    await channel.assertQueue(user_id)
    
    try{
        const subscription = await Subscribtion.create({channel_id,user_id})
        channel.bindQueue(user_id,exchangeName,channel_id)
        let si = subscription._id
        let ru = req.user
        res.status(200).json({si , ru})
    } catch (err){
        res.status(400).json({err : err.message})
    }
    
}

//unsbscribe
const Unsbscribe = async (req,res) => {
    const ch_id = req.params.id
    const us_id = req.user.id
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchangeName , 'direct' , {durable : true})
    await channel.assertQueue(us_id)
    try{
        const unsbscribtion = await Subscribtion.findOneAndDelete({channel_id:ch_id , user_id:us_id})
        channel.unbindQueue(us_id,exchangeName,ch_id)
        res.status(200).json(unsbscribtion)
    }catch(err){
        res.status(400).json({err : err.message})
    }

}

//sub test
const SubTest = async (req,res) => {
    const ch_id = req.params.id
    const us_id = req.user.id
    try {
      const sub = await Subscribtion.findOne({channel_id:ch_id , user_id:us_id}) 
      res.status(200).json(sub)
    }catch(err){
        res.status(404).json({err : err.message})
    }

}

//get my channels
const MyChannels = async (req,res) => {
    const {_id} = req.user
    try{
        const page = parseInt(req.query.page)-1 || 0 ;
        const mychannels = await Subscribtion.find({user_id:_id})
        .populate('channel_id')
        .skip(page * 8)
        .limit(8)

        const total = await Subscribtion.countDocuments({user_id:_id})

        const response = {mychannels,total}
        res.status(200).json(response)
    }catch(err){
        res.status(404).json({err : err.message})
    }
}
//my followers
const MyFollowers = async (req,res) => {
    const {id} = req.params
    try{
        const myfollowers = await Subscribtion.find({channel_id:id}).populate('user_id', 'firstName lastName img').select("user_id")
        
        res.status(200).json(myfollowers)
    }catch(err){
        res.status(404).json({err : err.message})
    }
}

//streamer followers number
const MyFollNumb = async (req,res) => {
    const {id} = req.params
    try{
        const numb = await Subscribtion.countDocuments({channel_id:id})
        res.status(200).json(numb)
    }catch(err){
        res.status(404).json({err : err.message})
    }
}

module.exports = {
    Subscribe,
    Unsbscribe,
    SubTest,
    MyChannels,
    MyFollowers,
    MyFollNumb
}