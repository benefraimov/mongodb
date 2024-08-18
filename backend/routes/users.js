const express = require('express');
const User = require('../models/userModel');
const { createJSONToken, isValidPassword, checkAuth } = require('../utils/auth');
const { isValidEmail, isValidText, isValidAge } = require('../utils/validation');
const { sendEmail } = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

// Increase salt rounds for stronger hashing
const SALT_ROUNDS = 10;  // default is usually 10, but you can increase this

const router = express.Router();

// Public routes (No authentication required)
router.post('/signup', async (req, res, next) => {
    // get data Object from body 
    const data = req.body;
    let errors = {};

    // if false value(email isn't valid) get to the condition
    if (!isValidEmail(data.email)) {
        // add new property to errors object with the error message 
        errors.email = 'Invalid email.';
    } else {
        try {
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                errors.email = 'Email exists already.';
            }
        } catch (error) {
            return next(error);
        }
    }
    // if there is no user exist the first user
    // will get an admin permission
    const users = await User.find();
    if (!(users.length > 0)) {
        data.role = "admin";
    }
    console.log(data)

    // regex test -> 
    if (!isValidText(data.password, 8) ||
        !/[A-Z]/.test(data.password) ||
        !/[a-z]/.test(data.password) ||
        !/[0-9]/.test(data.password) ||
        !/[!@#$%^&*]/.test(data.password)) {
        errors.password = 'Invalid password. Must be at least 8 characters long.';
    }

    // convert the object errors to an array to check it's length 
    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: 'User signup failed due to validation errors.',
            errors,
        });
    }

    try {
        // Hash the password before saving
        // must install bcrypt: npm install bcrypt 2^10 1024
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        const createdUser = new User({ ...data, password: hashedPassword });
        await createdUser.save();
        // Send a welcome email to the user
        // ...
        const authToken = createJSONToken(createdUser.email);
        res
            .status(201)
            .json({ message: 'User created.', user: createdUser, token: authToken });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed.' });
    }

    const pwIsValid = await isValidPassword(password, user.password);
    if (!pwIsValid) {
        return res.status(422).json({
            message: 'Invalid credentials.',
            errors: { credentials: 'Invalid email or password entered.' },
        });
    }

    const token = createJSONToken(email);
    res.json({ token });
});

// Protected routes (Authentication required)
router.use(checkAuth);

router.get('/', async (req, res, next) => {
    // Admins can access this route
    // console.log(req.user.role, req.isAdmin)
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const users = await User.find();
        res.status(200).json({ response: true, data: users, message: 'Found users' });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const foundUser = await User.findById(id);
        if (!foundUser) {
            return res.status(404).json({ response: false, message: 'User not found' });
        }
        res.status(200).json({ response: true, data: foundUser, message: 'User has been found' });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    // Admins can access this route
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    const { name, age, email, password } = req.body;
    let errors = {};

    if (!isValidText(name)) {
        errors.name = 'Invalid name.';
    }

    if (!isValidAge(age)) {
        errors.age = 'Invalid age.';
    }

    if (!isValidEmail(email)) {
        errors.email = 'Invalid email.';
    } else {
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                errors.email = 'Email exists already.';
            }
        } catch (error) {
            return next(error);
        }
    }

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: 'Adding the user failed due to validation errors.',
            errors,
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({ name, age, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ response: true, data: newUser, message: 'User created successfully' });

        // Send email to welcome user
        const mailObject = {
            reciepent: email,
            name: name,
            subject: 'Welcome to our store',
            text: 'Enjoy buying perfect products for daily use',
        };
        const response = await sendEmail(mailObject);
        console.log(response);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const { name, age, email } = req.body;
    let errors = {};

    if (!isValidText(name)) {
        errors.name = 'Invalid name.';
    }

    if (!isValidAge(age)) {
        errors.age = 'Invalid age.';
    }

    if (!isValidEmail(email)) {
        errors.email = 'Invalid email.';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: 'Updating the user failed due to validation errors.',
            errors,
        });
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(id, { name, age, email }, { new: true });
        if (!userUpdated) {
            return res.status(404).json({ response: false, message: 'User not found' });
        }
        res.status(200).json({ response: true, data: userUpdated, message: 'User updated successfully' });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    // Admins can access this route
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    const id = req.params.id;
    try {
        const userDeleted = await User.findByIdAndDelete(id);
        if (!userDeleted) {
            return res.status(404).json({ response: false, message: 'User not found' });
        }
        res.status(200).json({ response: true, data: userDeleted, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
