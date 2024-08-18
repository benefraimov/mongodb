// web framework for Node.js
const express = require('express');
const cors = require('cors');
// mongo connection
const mongoConnect = require('./authDB');
const PORT = process.env.PORT;

// requring express-rate-limit to limit
// ip access to our backend
// must be installed: npm install express-rate-limit 
const rateLimit = require('express-rate-limit');

// Define a rate limit rule
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// routes importing
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

const app = express();

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Alternatively, apply it to specific routes
// app.use('/users', limiter);

// For getting jsons into our server - JSON Payload
app.use(express.json());

// connect to mongoDB using mongoose
mongoConnect.connectToMongo();

// Configure CORS options 
const corsOptions = {
    origin: '*', //Allows requests from any origin -> we can change to one or more: 'http://localhost:5173, http://localhost:5174' 
    methods: 'GET, POST, PUT, DELETE',// Allows this methods -> we can modify to one only 
    allowedHeaders: 'Content-Type, Authorization',// Allows these headers -> we can add or remove allowed 
}

app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
//     if (fullUrl == "http://localhost:5173/users") {
//         console.log("OK")
//     }
//     const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];

//     if (!allowedMethods.includes(req.method)) {
//         return res.status(405).send({ message: 'Method Not Allowed' });
//     }

//     next();
// });

app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong.';
    res.status(status).json({ message: message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});