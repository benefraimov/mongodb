const express = require('express')
const User = require('../models/userModel');
const { sendEmail } = require('../utils/sendEmail');
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({ response: true, data: users, message: "found users" })
    } catch (err) {
        res.status(500).json({ response: false, data: "", message: "cannot get users" })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const foundUser = await User.findById(id)

        res.status(200).json({ response: true, data: foundUser, message: "user has found" })
    } catch (error) {
        res.status(500).json({ response: false, data: "", message: "cannot get user" })
    }
})

router.post('/', async (req, res) => {
    const { name, age, email } = req.body

    const newUser = new User({
        name,
        age,
        email
    })

    try {
        await newUser.save()
        res.status(201).json({ response: true, data: newUser, message: "User created successfully" })
        // send Email to welcome user 
        // call email sender function - use nodemailer!    
        // { reciepent, name, subject, text }
        const mailObject = {
            reciepent: email,
            name: name,
            subject: "Welcome to our store",
            text: "Enjoy buying perfect products for daily use"
        }
        const response = await sendEmail(mailObject)
        console.log(response)
    } catch (error) {
        const errorCode = error.errorResponse.code;
        if (errorCode == 11000) {
            res.status(500).json({ response: false, data: newUser, message: "Email Already Exist!" })
        } else {
            res.status(500).json({ response: false, data: newUser, message: "User creation failed" })
        }
        console.error(`User creation failed ${error}`)
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const { name, age, email } = req.body
    try {
        const userUpdated = await User.findByIdAndUpdate(id, { name, age, email });
        res.status(200).json({ response: true, data: userUpdated, message: "User updated successfully" })
    } catch (error) {
        res.status(500).json({ response: false, data: "", message: "User updated failed" })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const userDeleted = await User.findByIdAndDelete(id);
        // console.log(userDeleted)
        res.status(200).json({ response: true, data: userDeleted, message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ response: false, data: "", message: "User deleted failed" })
    }
})


module.exports = router

// for next lesson authentication via login
// connecting models to each other(mongoDB)
// password hash with jwt
// React - contextApi/redux(prevent props drilling)
// React - contextApi/redux -> one of the 2 will be recorded
// Angular - record by ben for angular setup + typescript
// Sql - record by ben for nodeJS
// spacode - מפתחים אתרי אפליקציה
