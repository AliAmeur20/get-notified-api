const express = require('express')

const requireAuth = require ('../middlewares/requireAuth')    

const {
    getReports,
    createReport,
    deleteReport
} = require('../controllers/reportcont')

const router = express.Router() 

//require auth for all channels routes
router.use(requireAuth)

router.get('/', getReports)

router.post('/:title', createReport)

router.delete('/:id', deleteReport)

module.exports = router