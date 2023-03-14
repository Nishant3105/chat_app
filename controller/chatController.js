const Chat=require('../model/chat')
const sequelize=require('../util/database')

exports.postMessage=async (req,res,next)=>{
    try{
        const message=req.body.message
        await Chat.create({
            name: req.user.name,
            message: message,
            userId: req.user.id
        })
        res.status(200).json({success:true, name:req.user.name, message:message})
    }
    catch(err){
        res.status(500).json({success:false})
    }

}

exports.getMessage=async (req,res,next)=>{
    try{
       const msg=await Chat.findAll({
        attributes: ['name','message'],
       })
       res.status(200).json(msg)
    }
    catch(err){
       console.log(err)
       res.status(500).json({success: false})
    }
}