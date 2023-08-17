const express = require('express')

const {  createChannel,
    getChannels,
    getChannel,
    updateChannel,
    deleteChannel  }= require('../controllers/channelcont')

const requireAuth = require ('../middlewares/requireAuth')    

const router = express.Router()

//require auth for all channels routes
router.use(requireAuth)

router.get("/",getChannels)

router.get("/:id",getChannel)

router.post("/" ,createChannel)

router.delete("/:id",deleteChannel)

router.patch("/:id",updateChannel)


module.exports = router