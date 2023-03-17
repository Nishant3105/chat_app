const express=require('express')

const bodyParser=require('body-parser')
const cors=require('cors')

const dotenv = require("dotenv")
dotenv.config();

const sequelize=require('./util/database')
const userRoutes=require('./routes/user')
const chatRoutes=require('./routes/chat')
const groupRoutes=require('./routes/group')

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

User.hasMany(Chat)
Chat.belongsTo(User)

User.belongsToMany(Group, {through: userGroup})
Group.belongsToMany(User, {through: userGroup})

Group.hasMany(Chat)
Chat.belongsTo(Group)

sequelize
 .sync()
 .then(()=>app.listen(3000))
 .catch(err=>console.log(err))