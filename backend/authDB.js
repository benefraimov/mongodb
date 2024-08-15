const mongoose = require('mongoose')

const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

const connectionString = `mongodb+srv://${username}:${password}@cluster0.hthcm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectToMongo = () => {
    mongoose.connect(connectionString)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => {
            console.error('Error connecting to MongoDB', err)
        })
}

module.exports = {
    connectToMongo
};

// mongodb credentials
//testsendemailsnodejs - user
//emZcTiohBh6Y6z0h - password
// connection string:
// mongodb+srv://testsendemailsnodejs:emZcTiohBh6Y6z0h@cluster0.hthcm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
