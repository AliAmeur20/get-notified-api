const express = require('express')

const {signinUser , registerUser} = require('../controllers/usercont')

const router = express.Router()

router.post("/signin",signinUser)

router.post("/register",registerUser)

module.exports = router