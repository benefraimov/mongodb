const express = require('express');
const mongoConnect = require('./authDB');

// routes importing
const usersRouter = require('./routes/users');

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

// connect to mongoDB using mongoose
mongoConnect.connectToMongo();

app.use('/users', usersRouter);

app.use('/', (req, res) => {
    res.send('404 - Page not found!')
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});