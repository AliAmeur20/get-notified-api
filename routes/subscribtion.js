const express = require('express')
const router = express.Router()

const {Subscribe , Unsbscribe ,SubTest,MyChannels,MyFollowers,MyFollNumb} = require ('../controllers/subscribtioncont')

const requireAuth = require ('../middlewares/requireAuth')   

//require auth for all subscribtions routes
router.use(requireAuth)

//subscribe
router.post("/:id",Subscribe) 

//unscscribe
router.delete("/:id",Unsbscribe)

//get my subscribers
router.get("/myfollowers/:id",MyFollowers) 

//get channels that im sucscribed at
router.get("/mychannels",MyChannels)

//subscribtion test
router.get("/:id",SubTest)

//streamer followers numb
router.get("/followersNum/:id" , MyFollNumb)



module.exports = router

 