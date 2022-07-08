require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        //useCreateIndex: true,
        //useFindAndModify: false,
        useUnifiedTopology: true
    });
    
   /*  connection.once('open', () => {
        console.log('MongoDB is connected');
    }).catch('error', (error) => {
        console.log('Error connecting to MongoDB: ', error);
    }) */
    
    console.log(`MongoDB Connected: ${connection.connection.host}`);
}

module.exports = connectDB;