const Group=require('../model/group')
const userGroup=require('../model/usergroup')
const User=require('../model/user')
const Chat=require('../model/chat')
const sequelize=require('../util/database')
// const Sequelize=require('sequelize')


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
        groupname:name
       })
       res.status(200).json(result.dataValues)
    }
    catch(err){
       console.log(err)
    }
}

exports.getGroup=async (req,res,next)=>{
    try{
        const groups=await userGroup.findAll({
            where: {
                userId:req.user.id
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
       const {ipt,gid,gname}=req.body
       const user=await User.findAll({attributes:['id','name'],where: {email:ipt}})
       if(user.length==0){
        res.status(201).json('User doesnot exist!')
       }
       else if(user.length==1){
           const uid=user[0].dataValues.id
           console.log(uid)
           const found=await userGroup.findAll({where:{userId:uid,groupId:gid}})
           if(found.length>0)
           res.status(201).json('user already exists in the group!!')
           else{
               userGroup.create({
                userId:uid,
                groupId:gid,
                username:user[0].dataValues.name,
                groupname:gname
               })
               res.status(200).json({success:true})
            }

       }
       
    }
    catch(err){
        console.log(err)
    }
}

exports.deleteGroup=async (req,res,next)=>{
    const t=await sequelize.transaction()  
    try{
      const uid=req.user.id
      const gid=req.params.id
      const found=await Group.findOne({where: {id:gid,userid:uid}})
      if(found){
          await Group.destroy({where: {id:gid}},{ transaction: t })
          await userGroup.destroy({where: {groupId:gid}},{ transaction: t })
          await Chat.destroy({where: {groupId:gid}},{ transaction: t })
          await t.commit()
          res.status(200).json('deleted')
        }
        else{
            await t.commit()
            res.status(400).json('You are NOT the admin!')
        }
    }
    catch(err){
        await t.rollback()
        console.log(err)
        res.status(500).json('Something went wrong!')
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
        res.status(200).json(users)
    }
    catch(err){
        console.log(err)
    }
}

exports.removeUserFromGroup=async (req,res,next)=>{
    try{
      console.log('reached!!')
        const ownuid=req.user.id
        console.log(ownuid)
      const {groupid,userid}=req.query
      console.log(userid)
      const found=await Group.findOne({where: {id:groupid,userid:userid}})
      console.log(found)
      if(found){
            await userGroup.destroy({where: {groupId:groupid,userId:userid}})
            res.status(200).json('User removed succefully!')
      }
      else{
            res.status(400).json('You are NOT the admin!')
        }
    }
    catch(err){
      console.log(err)
      res.status(500).json('Something went wrong!')
    }
}

