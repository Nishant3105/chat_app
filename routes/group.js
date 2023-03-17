const express=require('express')

const userauth=require('../middleware/auth')

const groupController=require('../controller/groupController')

const routes=express.Router()

routes.post('/createGroup', userauth.authentication , groupController.createGroup)

routes.get('/getgrp', userauth.authentication , groupController.getGroup)

routes.post('/addusertogroup', groupController.addusertogroup)

routes.get('/getuser/:gid', groupController.getGrpUsers)

routes.delete('/removeuser', groupController.removeUserFromGroup)

routes.delete('/deletegroup/:id', groupController.deleteGroup)


module.exports=routes