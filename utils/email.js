const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = 'Ramadan Points <ramadanpoints@gmail.com>';
    }

    newTransport() {
        // if(process.env.NODE_ENV === 'production') {
        //     // Sendgrid
        //     return nodemailer.createTransport({
        //         service: 'gmail',
        //         auth: {
        //             user: process.env.EMAIL_USERNAME_PROD,
        //             pass: process.env.EMAIL_PASSWORD_PROD
        //         }
        //     });
        // }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendVerification() {
        await this.send('verifyAccount', 'Email Verification from Ramadan Points Familly');
    }

    async sendResetPassword() {
        await this.send('resetPassword', 'Password Reset from Ramadan Points Familly');
    }
}