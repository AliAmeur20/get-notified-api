const amqplib = require('amqplib')
const nodemailer = require('nodemailer')

const exchangeName = 'getNotified'
var channel = null
var cT = null

 

    
               



const send = async (req,res) => {
    const channel_id = req.params.id
    const {title,subject,content} = req.body
    if(subject===''){return res.status(400).json('you must add a subject')}
    if(content===''){return res.status(400).json('there is no content!')}
    const message = title.concat('µ*µ',subject,'µ*µ',content)
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchangeName , 'direct' , {durable : true})
    try{
       channel.publish(exchangeName , channel_id , Buffer.from(message),{persistent : true})

        setTimeout(()=>{
            connection.close();
        },500) 
        res.status(200).json('ok')
      
       
    }catch(err){
        res.status(400).json({ err: err.message })
    }
    

    

}

const recieve = async (req,res) => {
    const user_id = (req.user._id).toString()
    const connection = await amqplib.connect('amqp://localhost')
    channel = await connection.createChannel()
    await channel.assertExchange(exchangeName , 'direct' , {durable : true})
    await channel.assertQueue(user_id)

    const mailTransport = nodemailer.createTransport({

        host: "smtp.gmail.com",
        port: 465,
        secure: true,
    
       auth: {
               user: process.env.MAIL,
               pass: process.env.PASS,
             }
    
    })

    async function sendEmail (msg) {
        let message = msg.content.toString().split('µ*µ')
        try{
            const result = await mailTransport.sendMail({
                from: ` "${message[0]}" ${process.env.MAIL}`,
                to: `${req.user.email}`,
                subject: `${message[1]}`,
                text: `${message[2]}`,
                })
                console.log('mail sent successfully: ', result)
        }catch(err){console.log(err)}
                    
                }
    
    try{
          cT = await channel.consume(user_id , msg=>{
              if(msg){
                sendEmail(msg)
                channel.ack(msg)
            }
            
        },{noAck : false})          
    }catch(err){
        res.status(400).json({ err: err.message })
    }


}

  const signOut = async (req,res) => {
    
    try{
        if(cT){
            await channel.cancel(cT.consumerTag)
        }
        
        res.status(200).json('ok')
    }catch(err){
        res.status(400).json({ err: err.message })
    }
    
  }

module.exports = {
    send,
    recieve,
    signOut
}