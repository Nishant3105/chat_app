const Group=require('../model/group')
const userGroup=require('../model/usergroup')
const User=require('../model/user')
// const Chat=require('../model/chat')
const sequelize=require('../util/database')
const {Op}=require('sequelize')

exports.createGroup=async (req,res,next)=>{
    try{
       const {name}=req.body
       const result=await Group.create({
        name:name,
        userid:req.user.id
       })
       await userGroup.create({
        userId:req.user.id,
        groupId:result.dataValues.id,
        username:req.user.name,
       })
       res.status(200).json(result.dataValues)
    }
    catch(err){
       console.log(err)
    }
}

exports.getGroup=async (req,res,next)=>{
    try{
        const groups=await Group.findAll({
            where: {
                userid:req.user.id
            }
        })
        res.status(200).json(groups)
    }
    catch(err){
      console.log(err)
    }
}

exports.addusertogroup=async (req,res,next)=>{
    try{
       const {ipt,gid}=req.body
       const user=await User.findAll({attributes:['id','name'],where: {email:ipt}})
       const uid=user[0].dataValues.id
       const found=await userGroup.findAll({where:{userId:uid,groupId:gid}})
       if(found.length>0)
       res.status(400).json('user already exists in the group!!')
       else{
           userGroup.create({
            userId:uid,
            groupId:gid,
            username:user[0].dataValues.name
           })
           res.status(200).json({success:true})
        }
       
    }
    catch(err){
        console.log(err)
    }
}

exports.deleteGroup=async (req,res,next)=>{
    try{
      const gid=req.params.id
      await Group.destroy({where: {id:gid}})
      await userGroup.destroy({where: {groupId:gid}})
    //   await Chat.destroy({where: {groupId:gid}})
      res.status(200).json('deleted')
    }
    catch(err){
        console.log(err)
    }
}

exports.getGrpUsers=async (req,res,next)=>{
    try{
        const {gid}=req.params
        console.log(gid)
        const grpusers=await userGroup.findAll({attributes:['userId','username'],where:{groupId:gid}})
        const users=[]
        for(let i=0;i<grpusers.length;i++){
            users.push(grpusers[i].dataValues)
        }
        console.log(users)
        res.status(200).json(users)
    }
    catch(err){
        console.log(err)
    }
}

exports.removeUserFromGroup=async (req,res,next)=>{
    try{
      const {groupid,userid}=req.query
      await userGroup.destroy({where: {groupId:groupid,userId:userid}})
      res.status(200).json({success:true})
    }
    catch(err){
      console.log(err)
    }
}

