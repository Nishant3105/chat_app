const express=require('express')

const routes=express.Router()

const userController=require('../controller/userController')

routes.post('/signup', userController.addUser)

routes.post('/login', userController.login)

module.exports=routes