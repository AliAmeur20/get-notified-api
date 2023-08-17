const Channel = require ('../modules/channelmodel')
const Sub = require ('../modules/subscribtionmodel')
const User = require ('../modules/usermodel')
const mongoose = require('mongoose')
const Rating = require('../modules/ratingmodel')


//create channel
const createChannel = async (req,res) => {

    const {title, ch_email, bio, location, category} = req.body

    if(!title || !bio || !location || !category){
        return res.status(400).json({err: 'all fields must be filled'})
      }
  
    try{
   const channel = await Channel.create({title, ch_email, bio, location, category})
   const user = await User.findById(req.user._id)
   await user.channels.push(channel._id);
   await user.save()

   res.status(200).json(channel)
    }catch(err){
    res.status(400).json({ err: err.message })
    }
} 

//get all channels
const getChannels = async (req,res)=>{
    
    const valide = req.query.valide
    
    try{
         const page = parseInt(req.query.page)-1 || 0 ;
         //const limit = parseInt(req.query.limit) || 5 ;
         const search = req.query.search || "" ;
         const location = req.query.location
         //let sort = req.query.sort || "rating"
         let category = req.query.category || "all" 
         const categs = [
            "category-one",
            "category-two",
            "category-three"
        ];

        category === "all" ? (category = [...categs]) : (category = [req.query.category]);
        {/*req.query.sort ? (sort = req.query.sort.split(",")) : (sort=[sort]);
        let sortBy = {}
        if(sort[1]){
            sortBy[sort[0]]=sort[1];
        } else {
            sortBy[sort[0]="asc"]
        }*/}
        const channels = await Channel.find({title : {$regex : search , $options : "i"}, isValide : valide , location : {$regex : location , $options : "i"}} )
        .where("category").in([...category])
        .sort({createdAt: -1})
        .skip(page * 8)
        .limit(8)
        const total = await Channel.countDocuments({
            category:{$in:[...category]},
            title:{$regex:search,$options:"i"},
            isValide : valide,
            location : {$regex : location , $options : "i"}

        });
        const response = {
            total,
            page:page+1,
            //limit,
            //categorys:categs,
            channels
        }
        res.status(200).json(response)
    }catch(err){
        res.status(400).json({ err: err.message })
    }
  
}

//get channel detailes
const getChannel =async (req,res)=>{
   const { id } = req.params

if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json(" a non valid id !!")
}

   try{
    const channel = await Channel.findById(id)

    if(!channel){
        return res.status(404).json("that channel doesn't exist !!")
    }

    const folNum = await Sub.countDocuments({channel_id:id})

    const response = {channel , folNum}

    res.status(200).json(response)

   }catch(err){
    res.status(400).json({ err: err.message })
   }
}

//update channel
const updateChannel = async (req,res)=>{
   const { id } = req.params
   let body = {}
   if(req.body.chtitle){
    body.title=req.body.chtitle
   }
   if(req.body.chbio){
    body.bio=req.body.chbio
   }
   if(req.body.image){
    body.ch_img=req.body.image
   } 
   if(req.body.isV){
    body.isValide=req.body.isV
   }
   if(req.body.location){
    body.location=req.body.location
   }
   if(req.body.category){
    body.category=req.body.category
   }

   body.isBlocked=req.body.isB


   try{
    const channel = await Channel.findOneAndUpdate( {_id : id} , {...body} , {new: true} )

    res.status(200).json(channel)

   }catch(err){
    res.status(400).json({ err: err.message })
   }

}

//delete channel
const deleteChannel = async (req,res)=>{
    const { id } = req.params
    

   try{
    const channel = await Channel.findOneAndDelete({_id : id })
    const email = channel.ch_email
    await Sub.deleteMany({channel_id : id})
    await Rating.deleteMany({channel_id : id})
    const user = await User.find({email : email })
    await user[0].channels.pull(id)

    res.status(200).json(channel)

   }catch(err){
    res.status(400).json({ err: err.message })
   }
   
}



module.exports = {
    createChannel,
    getChannels,
    getChannel,
    updateChannel,
    deleteChannel
}