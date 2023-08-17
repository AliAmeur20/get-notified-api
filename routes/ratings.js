const express = require('express')

const requireAuth = require ('../middlewares/requireAuth') 

const {
    getRatings,
    createRating
} = require('../controllers/ratingcont')

const router = express.Router()

//require auth for all channels routes
router.use(requireAuth)

router.get('/:id', getRatings)

router.post('/:id', createRating)

module.exports = router