const Chat=require('../model/chat')
const sequelize=require('../util/database')
const {Op}=require('sequelize')

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
        const Lastid=req.params.id
        const msg=await Chat.findAll({
        attributes: ['id','name','message'],
        where: {
            id:{  [Op.gt]: Lastid }
        }
       })
       res.status(200).json(msg)
    }
    catch(err){
       console.log(err)
       res.status(500).json({success: false})
    }
}