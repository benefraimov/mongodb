const mongoose = require('mongoose')

const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD
const databaseName = 'ICSR401';

const connectionString = `mongodb+srv://${username}:${password}@cluster0.hthcm.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;

const connectToMongo = () => {
    mongoose.connect(connectionString)
        .then(() => console.log(`Connected to MongoDB database table ${databaseName}`))
        .catch((err) => {
            console.error('Error connecting to MongoDB', err)
        })
}

module.exports = {
    connectToMongo
};