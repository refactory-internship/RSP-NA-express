const nodemailer = require('nodemailer');

module.exports = {
    sendMail(id, email, token) {
        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: 'Email Verification for RSP - Notes App',
                html: `
                <h2>Please verify your email by clicking on the link below</h2>
                <a href='${process.env.CLIENT_URL}/auth/emailVerification/${id}/${token}'>
                ${process.env.CLIENT_URL}/auth/emailVerification/${id}/${token}
                </a>
                `
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
}