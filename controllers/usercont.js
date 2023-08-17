 const User = require('../modules/usermodel')
 const jwt = require('jsonwebtoken')

const createToken = (_id) => {
   return jwt.sign({_id},process.env.SECRET,{ expiresIn:'3d' })
}

 //signin
 const signinUser = async (req,res) =>{ 

   const {email , password} = req.body

   try{
      const user = await User.signin(email , password) 

     //create token
     const token = createToken(user._id) 

      res.status(200).json({user , token })
   }catch(err){
      res.status(400).json({ err : err.message })
   }
 }

 //register
 const registerUser = async (req,res) => {

   const {fname , lname ,email, password , role } = req.body 

   try{
      const user = await User.register(fname , lname ,email, password,role)

     //create token
     const token = createToken(user._id)

      res.status(200).json({user , token })
   }catch(err){
      res.status(400).json({ err : err.message })
   }
    
 } 

 //update profile
const updateProfile = async (req,res)=>{
   const id = req.user._id
   const body = req.body

   try{
    const profile = await User.update(id , body)
    res.status(200).json(profile)
   }catch(err){
    res.status(400).json({ err: err.message })
    console.log(err.message)
   }

}

 module.exports = {
    signinUser,
    registerUser,
    updateProfile
 }