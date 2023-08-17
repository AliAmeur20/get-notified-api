const express = require('express')

const { 
    getAccounts,
    getAccount,
    deleteAccount,
     getmyprofile,
     update,
     AdminInfo
  }= require('../controllers/accountcont')
const {updateProfile} = require('../controllers/usercont')  

const requireAuth = require ('../middlewares/requireAuth')   

//const {chekAdmin,chekUser} = require ('../middlewares/reqAuthAdm')

const router = express.Router()

//require auth for all Accounts routes
router.use(requireAuth)

router.delete("/:id",deleteAccount)

router.get("/myprofile", getmyprofile) 
router.get("/admininfo",AdminInfo)

router.get("/",getAccounts)

router.get("/:id", getAccount)

router.patch("/",updateProfile)
router.patch("/:id",update)







module.exports = router