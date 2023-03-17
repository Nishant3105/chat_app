const express=require('express')

const userauth=require('../middleware/auth')

const chatController=require('../controller/chatController')

const routes=express.Router()

routes.post('/sendmsg', userauth.authentication, chatController.postMessage)

routes.get('/getmsg/:id', userauth.authentication, chatController.getMessage)

routes.get('/getgrpmsg/:gid', userauth.authentication, chatController.getGrpMessage)

module.exports=routes