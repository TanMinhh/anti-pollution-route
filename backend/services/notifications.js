const nodemailer = require('nodemailer');
const twilio = require('twilio');

const sendEmailAlert = async (email, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Clean Route Alert',
        text: message
    });
};

const sendWhatsAppAlert = async (phone, message) => {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await client.messages.create({
        body: message,
        from: 'whatsapp:' + process.env.TWILIO_WHATSAPP,
        to: 'whatsapp:' + phone
    });
};

module.exports = { sendEmailAlert, sendWhatsAppAlert };