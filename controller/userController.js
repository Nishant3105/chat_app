const bcrypt=require('bcrypt')

const jwt=require('jsonwebtoken')

const User=require('../model/user')

function generateAccessToken(id){
    return jwt.sign({userID:id},'thisisasecretkeyforyologin')
}

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

exports.login=async (req,res,next)=>{
    try{
       const {email, password}=req.body
       if(email=='' || password==''){
        res.status(400).json({message:'Please enter full details'})
       }
       const user=await User.findOne({where: {email:email}})
       if(user){
        bcrypt.compare(password, user.dataValues.password, (err, response) => {
            if (err) {
                throw new Error('Something went wrong!')
            }
            if (response === true) {
                res.status(200).json({ 
                    success: true, 
                    message: "User logged in successfully",
                    token: generateAccessToken(user.dataValues.id) 
                })
            }
            else {
                res.status(401).json({ success: true, message: "Password is incorrect,User not Authorized" })
            }
        })
       }
       else{
        res.status(404).json({message: 'User not found. New User? Please Signup!'})
       }

    }
    catch(err){
        res.status(500).json({succes:false, err:err})
    }
}

