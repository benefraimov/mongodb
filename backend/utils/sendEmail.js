const nodeMailer = require('nodemailer')

const sendEmail = async ({ reciepent, name, subject, text }) => {
    // transporter creator with your gmail(service) user  
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: "testsendemailsnodejs@gmail.com",
            pass: process.env.NODEMAILER_PASSWORD
        }
    })

    // Email to yourself
    const notificationMailOptions = {
        from: 'testsendemailsnodejs@gmail.com',
        to: 'spacodewebapp@gmail.com',      // Your email address
        subject: `New Message: ${subject}`,
        text: `You have received a new message from ${name}:\n\n${text}`,
        html: `<h3>Email address: ${reciepent}</h3>`
    };

    // Thank you email to the user
    const thankYouMailOptions = {
        from: 'testsendemailsnodejs@gmail.com',
        to: reciepent,
        subject: 'Thank you for your message!',
        text: `Dear ${name},\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\nBest regards,\nYour Team`
    };


    try {
        await transporter.sendMail(notificationMailOptions);
        await transporter.sendMail(thankYouMailOptions);

        // res.status(200).json({ sent: true, data: "", message: "Email sent successfully!" })
        return { response: true, error: "", message: "email successfully sent" }
    } catch (err) {
        // res.status(500).json({ sent: false, data: { responseCode: err.responseCode }, message: "Email sending failed!" })
        console.error("Failed sending email", err)
        return { response: false, error: err, message: "failed sending email" }
    }
}

exports.sendEmail = sendEmail;