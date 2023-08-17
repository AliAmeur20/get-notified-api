const User = require ('../modules/usermodel')
const Channel = require ('../modules/channelmodel')
const Sub = require ('../modules/subscribtionmodel')
const Rating = require('../modules/ratingmodel')
const Reports = require('../modules/reportmodel')
const Feedback = require('../modules/feedbackmodel')
const mongoose = require('mongoose')
const amqplib = require('amqplib')

//get all Accounts
const getAccounts = async (req,res)=>{

    try{
        const search = req.query.search || "" ;
        const page = parseInt(req.query.page)-1 || 0 ;
        const type = req.query.type || "" ;
        const email = req.query.email || "" ;
        const accounts = await User.find({ $or : [{firstName : {$regex : search , $options : "i"}},{lastName : {$regex : search , $options : "i"}}] , email : {$regex : email , $options:"i"} , role : {$regex : type , $options:"i"} })
        .sort({createdAt: -1})
        .skip(page * 8)
        .limit(8)
        const total = await User.countDocuments({
            $or : [{firstName : {$regex : search , $options : "i"}},{lastName : {$regex : search , $options : "i"}}],
            email : {$regex : email , $options:"i"},
            role : {$regex : type , $options:"i"}
        });
        const response = {
            total,
            page:page+1,
            accounts
        }
        res.status(200).json(response)
    }catch(err){
        res.status(400).json({ err: err.message })
    }
  
}

//get account detailes
const getAccount =async (req,res)=>{
    const { id } = req.params
 
 if(!mongoose.Types.ObjectId.isValid(id)){
     return res.status(400).json(" a non valid id !!")
 }
 
    try{
     const account = await User.findById(id)
 
     if(!account){
         return res.status(404).json("that account doesn't exist !!")
     }
 
     res.status(200).json(account)
 
    }catch(err){
     res.status(400).json({ err: err.message })
    }
 }
 
 //my profile
 const getmyprofile =async (req,res)=>{
    const id = req.user._id
    try{
     const profile = await User.findById(id).populate('channels')
     res.status(200).json(profile)
    }catch(err){
     res.status(400).json({ err: err.message })
    }
 }

 //delete account
const deleteAccount = async (req,res)=>{
    const { id } = req.params
    

   try{
    const account = await User.findOneAndDelete({_id : id })
    if(account.role === 'user'){
        const connection = await amqplib.connect('amqp://localhost')
        const channel = await connection.createChannel()
        await channel.assertQueue(id)
        await channel.deleteQueue(id)
        await Sub.deleteMany({user_id : id})
        await Rating.deleteMany({user_id : id})
    }else{
        const channels = await Channel.find({ch_email : account.email})
        channels.map(async (channel)=>{
           await Sub.findOneAndDelete({channel_id : channel._id })
        })
        await Channel.deleteMany({ch_email : account.email})
    }
    
    res.status(200).json(account)

   }catch(err){
    res.status(400).json({ err: err.message })
   }
}

// bloc/unbloc
const update = async (req,res)=>{
    const {id} = req.params
    try{
       const account = await User.findOneAndUpdate({_id : id} , {isBlocked : req.body.isB} , {new : true} )
       res.status(200).json(account)
    }catch(err){
        res.status(400).json({ err: err.message })
    }
}

// admin info
const AdminInfo = async (req,res)=>{
    try{
        const channels = await Channel.countDocuments({isValide:true})
        const users = await User.countDocuments({role:"user"})
        const streamers = await User.countDocuments({role:"streamer"})
        const nvchannels = await Channel.countDocuments({isValide : false})
        const reports = await Reports.countDocuments()
        const feedback = await Feedback.countDocuments()


        const response={channels,users,streamers,nvchannels,reports,feedback}
        
        res.status(200).json(response)
     }catch(err){
         res.status(400).json({ err: err.message })
     }
}



module.exports = {
    getAccounts,
    getmyprofile,
    getAccount,
    deleteAccount,
    update,
    AdminInfo  
}