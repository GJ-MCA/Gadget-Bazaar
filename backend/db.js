const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/gadgetbazaar"

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo Successfully");
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
        throw err;
    }
}

module.exports = connectToMongo;