const bcrypt=require('bcrypt')

const User=require('../model/user')

exports.addUser=async (req,res,next)=>{
    try{
    console.log(req.body)
       const {name, email, phone, password} =req.body
       if(name=="" || email=="" || phone=="" || password==""){
           res.status(500).json({message: 'please fill all the details'})
       }
       
       let result=await User.findOne({where: {email:email}})
       if(result){
           res.status(200).json({message: 'User already exists! Please login.'})
        }    
       else{
           bcrypt.hash(password,10,(err,hash)=>{
               User.create({
                   name,
                   email,
                   phone,
                   password:hash
               })
               res.status(201).json({message:'User created successfully!'})
            })
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Something went wrong!'})
    }
}

