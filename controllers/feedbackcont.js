const mongoose = require('mongoose')
const Feedback = require('../modules/feedbackmodel')

//get feedback
const getFeedback = async (req,res) => {
    try{
      const feedback = await Feedback.find({})
      const total = await Feedback.countDocuments()
      const response = {feedback,total}
      res.status(200).json(response)
    }catch(err){
        res.status(400).json({ err: err.message })
    }

}

//create feedback
const createFeedback = async (req,res) => {
    const {fbmsg} = req.body
    const userr = req.user.firstName.concat(' ',req.user.lastName)
    if (!fbmsg){
        return res.status(400).json({err : 'there is no feedback! '})
    }
    try{
     const feedback = await Feedback.create({userr,fbmsg})   
     res.status(200).json(feedback)
    }catch(err){
        res.status(400).json({err : err.message})
    }

}

//delete feedback
const deleteFeedback = async (req,res) => {
    const {id} = req.params
    try{
        const feedback = await Feedback.findByIdAndDelete(id)
        res.status(200).json(feedback)
    }catch(err){
        res.status(400).json({ err : err.message })
    }
}

module.exports = {
    getFeedback,
    createFeedback,
    deleteFeedback
}