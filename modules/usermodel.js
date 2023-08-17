  const mongoose = require('mongoose')
  const bcrypt = require('bcrypt')
  const Channel = require('./channelmodel')
  //const validator = require ('validator')

  const Schema = mongoose.Schema

  const userschema = new Schema ({
    firstName : {
      type : String,
      required : true,
    },
    lastName : {
    type : String,
    required : true,
     },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
      type : String,
    },
    img : {
      type : String,
      default:"https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
    },
    channels :[{
      type : Schema.Types.ObjectId ,
      ref : Channel ,
      default : []
    }] ,
    isBlocked : {
      type : Boolean,
      default : false
    }     

  },{timestamps : true })



//register  
  userschema.statics.register = async function(firstName ,lastName ,email, password , role) {

    //validation
    if(!email || !password){
      throw Error ('all fields must be filled')
    }

    const exists = await this.findOne({ email })
    if(exists){
      throw Error ('e-mail already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ firstName , lastName ,email, password: hash , role })
    return user
  }

 //signin
 userschema.statics.signin = async function(email , password){

  if(!email || !password){
    throw Error ('all fields must be filled')
  }

  const user = await this.findOne({ email })
    if(!user){
      throw Error ('Incorrect e-mail')
    }

    if(user.isBlocked==true){
      throw Error ('blocked account, try later !')
    }

  const match = await bcrypt.compare(password , user.password)
  if(!match){
    throw Error ('Incorrect password')
  }
  
  return user

 }

 //update
userschema.statics.update = async function(id,body){
 
  let update = {}
  if(body.fname){
    update.firstName = body.fname
  }
  if(body.lname){
    update.lastName = body.lname
  }
  if(body.uemail){
    update.email = body.uemail
  }
  if(body.password){
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(body.password, salt) 
    update.password = hash
  }
  if(body.image){
    update.img = body.image
  }
  update.isBlocked=body.isB
   
    const profile = await this.findOneAndUpdate({_id : id}, {...update} , {new: true} ) 
    return profile

} 



  module.exports = mongoose.model('User', userschema)