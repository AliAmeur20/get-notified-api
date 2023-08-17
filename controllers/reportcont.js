const mongoose = require('mongoose')
const Report = require('../modules/reportmodel')

//get reports
const getReports = async (req,res) => {
    try{
        const reports = await Report.find({})
        const total = await Report.countDocuments()
      const response = {reports,total}
      res.status(200).json(response)
    }catch(err){
        res.status(400).json({ err: err.message })
    }

}

//create report
const createReport = async (req,res) => {
    const {rprtmsg} = req.body
    const userr = req.user.firstName.concat(' ',req.user.lastName)
    const channel = req.params.title
    if(!rprtmsg){
        return res.status(400).json({err : 'you have not mentionned the cause! '})
    }
    try{
      const report = await Report.create({channel,userr,rprtmsg})  
      res.status(200).json(report)
    }catch(err){
        res.status(400).json({ err : err.message })
    }

}

//delete report
const deleteReport = async (req,res) => {
    const {id} = req.params
    try{
        const report = await Report.findByIdAndDelete(id)
        res.status(200).json(report)
    }catch(err){
        res.status(400).json({ err : err.message })
    }

}

module.exports = {
    getReports,
    createReport,
    deleteReport
}