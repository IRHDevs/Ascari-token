const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASSWORD, // Use environment variables
    },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            // Save the email to a file (can be replaced with a database)
            const filePath = path.resolve('/tmp', 'subscribers.txt');
            fs.appendFileSync(filePath, `${email}\n`);

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

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Subscription successful! Welcome email sent.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
