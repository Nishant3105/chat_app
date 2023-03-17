const express=require('express')

const routes=express.Router()

const userController=require('../controller/userController')
const userauth=require('../middleware/auth')

routes.post('/signup', userController.addUser)

routes.post('/login', userController.login)

routes.get('/getusers', userauth.authentication, userController.getUsers)

module.exports=routes