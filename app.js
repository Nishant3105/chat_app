const express=require('express')
const path=require('path')

const bodyParser=require('body-parser')
const cors=require('cors')

const dotenv = require("dotenv")
dotenv.config();

const sequelize=require('./util/database')
const userRoutes=require('./routes/user')
const chatRoutes=require('./routes/chat')
const groupRoutes=require('./routes/group')
const mediaRoutes=require('./routes/media')

const User=require('./model/user')
const Chat=require('./model/chat')
const Group=require('./model/group')
const userGroup=require('./model/usergroup')

const app=express()

app.use(cors(
    {
        origin: "http://127.0.0.1:5500"
    }
))

app.use(bodyParser.json())


app.use('/user',userRoutes)

app.use('/chat',chatRoutes)

app.use('/group',groupRoutes)

app.use('/media',mediaRoutes)

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})

User.hasMany(Chat)
Chat.belongsTo(User)

User.belongsToMany(Group, {through: userGroup})
Group.belongsToMany(User, {through: userGroup})

Group.hasMany(Chat)
Chat.belongsTo(Group)

sequelize
 .sync()
 .then(()=>app.listen(process.env.PORT || 3000))
 .catch(err=>console.log(err))