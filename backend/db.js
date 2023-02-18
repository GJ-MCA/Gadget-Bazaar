const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/gadgetbazaar"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, (err)=>{
        if(err) console.log(err) 
        else console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;