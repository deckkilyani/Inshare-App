const nodeMailer = require('nodemailer');

const sendMail = async ({from, to, subject, text,html}) =>{
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }

    });

    let info = await transporter.sendMail({
        from: `InShare <${from}>`,
        to,
        subject,
        text,
        html,
    });

    //return info;
}



module.exports = sendMail;