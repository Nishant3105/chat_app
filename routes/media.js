const router=require('express').Router()
const auth=require("../middleware/auth")

const mediaController=require('../controller/mediaController')

router.post('/sendmedia', auth.authentication ,mediaController.postmedia)


module.exports=router
