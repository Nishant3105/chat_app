const jwt=require('jsonwebtoken')

const User=require('../model/user')

exports.authentication=(req,res,next)=>{
    try{
        const token=req.header('Authorization')
        //console.log(token)
        const user=jwt.verify(token,process.env.TOKEN_SECRET)
        // console.log(user.userID)
        User.findByPk(user.userID).then(user=>{
          req.user=user
          next()
        })
        .catch(err=>console.log(err))
      }
      catch(err){
         return res.status(401).json({success: false})
      }
}