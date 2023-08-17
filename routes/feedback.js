const express = require('express')

const requireAuth = require ('../middlewares/requireAuth')  

const {
    getFeedback,
    createFeedback,
    deleteFeedback
} = require('../controllers/feedbackcont')

const router = express.Router()

//require auth for all channels routes
router.use(requireAuth)

router.get('/', getFeedback)

router.post('/',createFeedback)

router.delete('/:id', deleteFeedback)

module.exports = router