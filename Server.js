require('dotenv').config()
const express = require ('express')
const mongoose = require('mongoose')  

const ChannelsRoutes = require('./routes/channels')
const AccountsRoutes = require('./routes/accounts')
const AuthRoutes = require('./routes/auth')
const subscribeRoutes = require('./routes/subscribtion')
const contentRoutes = require('./routes/content')
const reportRoutes = require('./routes/reports')
const feedbackRoutes = require('./routes/feedback')
const ratingRoutes = require('./routes/ratings')

const app = express()
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true , limit: '10mb' }));

// routes
app.use('/api/channels', ChannelsRoutes)
app.use('/api/accounts', AccountsRoutes)
app.use('/api/auth', AuthRoutes)
app.use('/api/subscribtions',subscribeRoutes)
app.use('/api/content',contentRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/ratings', ratingRoutes)

mongoose.connect(process.env.MONG_URI,{
   useNewUrlParser: true,
   useUnifiedTopology: true
})
 .then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log("connected to db & listening on port :", process.env.PORT)
    })
 })
 .catch((err)=>{
    console.log(err)
 })

