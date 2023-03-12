const express=require('express')

const bodyParser=require('body-parser')
const cors=require('cors')

const dotenv = require("dotenv")
dotenv.config();

const sequelize=require('./util/database')
const userRoutes=require('./routes/user')
const app=express()

app.use(cors())
app.use(bodyParser.json())

app.use('/user',userRoutes)

sequelize
 .sync()
 .then(()=>app.listen(3000))
 .catch(err=>console.log(err))