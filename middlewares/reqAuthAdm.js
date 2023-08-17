const jwt = require ('jsonwebtoken')
const User = require ('../modules/usermodel')

const requireAuth = async (req,res,next) => {
    const {authorization} = req.headers

    if (!authorization){
        return res.status(401).json({err:'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token , process.env.SECRET_ADM)
        req.user = await User.findOne({_id}).select('_id')

        next()

    }catch(err){
        console.log(err)
        res.status(401).json({err:'request is not authorised'})
    }

}

const chekUser = (req,res,next) => {
    if (req.user._id == req.params.id || req.user.isAdmin ){
        next()
    }else{
        throw Error ("you're not authorized for this")
    }
  }

  const chekAdmin = (req,res,next) => {
    if (req.user.isAdmin ){
        next()
    }else{
        throw Error ("you're not authorized for this")
    }
  }
module.exports = {chekAdmin,chekUser}