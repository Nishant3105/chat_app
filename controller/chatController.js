const Chat=require('../model/chat')
const sequelize=require('../util/database')
const {Op}=require('sequelize')

exports.postMessage=async (req,res,next)=>{
    try{
        const message=req.body.message
        const gid=parseInt(req.body.gid)
       
        if(gid===0){
            await Chat.create({
                name: req.user.name,
                message: message,
                userId: req.user.id
            })
        }
        else{
            await Chat.create({
                name: req.user.name,
                message: message,
                userId: req.user.id,
                groupId: gid
            })
        }

        res.status(200).json({success:true, name:req.user.name, message:message})
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false})
    }

}

exports.getMessage=async (req,res,next)=>{
    try{
        const Lastid=req.params.id
        const msg=await Chat.findAll({
        attributes: ['id','name','message'],
        where: {
            id:{  [Op.gt]: Lastid },
            groupId: null
        }
       })
       res.status(200).json(msg)
    }
    catch(err){
       console.log(err)
       res.status(500).json({success: false})
    }
}

exports.getGrpMessage=async (req,res,next)=>{
    try{
        const gid=req.params.gid
        const msg=await Chat.findAll({
        attributes: ['id','name','message'],
        where: {
            groupId: gid
        }
       })
       res.status(200).json(msg)
    }
    catch(err){
        console.log(err)
        res.status(500).json({success: false})
    }
}