const mongoose=require('mongoose')
require('dotenv').config()
//connection to the database

mongoose.connect(`mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.jm0zx.mongodb.net/database?retryWrites=true&w=majority`,{
    
    useNewUrlParser:true,
})

console.log('connected');

