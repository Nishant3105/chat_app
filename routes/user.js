const express=require('express')

const routes=express.Router()

const userController=require('../controller/userController')

routes.post('/signup', userController.addUser)

module.exports=routes