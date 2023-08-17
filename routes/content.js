const express = require('express')

const {send , recieve , signOut} = require('../controllers/content')
const requireAuth = require ('../middlewares/requireAuth')    

const router = express.Router()

router.use(requireAuth)

router.get("/",recieve)

router.get("/signout" , signOut)

router.post("/:id" ,send)

module.exports = router