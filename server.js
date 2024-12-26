const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files
app.use(express.static('public'));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'insurehospitality@gmail.com', // Your email
        pass: 'dlin hxuq xcly vxcd', // Your app-specific password
    },
});

// Endpoint to handle subscriptions
app.post('/subscribe', (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    // Save the email to a file (you can replace this with a database or email marketing service)
    const filePath = path.join(__dirname, 'subscribers.txt');
    fs.appendFile(filePath, `${email}\n`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while saving your email.');
        }

        // Send welcome email
        const mailOptions = {
            from: '"Ascari Token" <insurehospitality@gmail.com>',
            to: email,
            subject: 'Welcome to Ascari Token',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto;">
                    <h1 style="background-color: #f7f7f7; padding: 20px; text-align: center; color: #000;">Welcome to Ascari Token</h1>
                    <p>Dear Subscriber,</p>
                    <p>Thank you for joining <strong>Ascari Token</strong>. We are thrilled to have you onboard! You will receive updates and the latest news about Ascari Token right here.</p>
                    <p>Stay tuned for exciting developments and opportunities in the world of cryptocurrency.</p>
                    <p>Warm regards,</p>
                    <p>The Ascari Token Team</p>
                    <hr style="border: none; border-top: 1px solid #ddd;" />
                    <p style="text-align: center; font-size: 0.8em; color: #777;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send('An error occurred while sending the email.');
            }
            console.log(`Email sent: ${info.response}`);
            res.send('Thank you for subscribing! A welcome email has been sent.');
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
