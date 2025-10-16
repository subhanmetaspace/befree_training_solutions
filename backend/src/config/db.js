const Sequelize = require("sequelize")
const Dotenv = require("dotenv")
Dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS,{
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: true
})

const connectDB = async ()=>{
    try{
        await sequelize.authenticate();
        console.log("database connected")
    }catch(err){
        console.error(err)
    }
}

module.exports = {sequelize,connectDB}