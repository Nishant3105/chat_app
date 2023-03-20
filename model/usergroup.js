const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const UserGroup=sequelize.define('usergroup',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull:false
    },
    groupname: {
        type: Sequelize.STRING,
        allowNull:false
    }
})

module.exports = UserGroup