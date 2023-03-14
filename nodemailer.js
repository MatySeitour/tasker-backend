import nodemailer from "nodemailer"

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "matnarucr7@gmail.com", // generated ethereal user
            pass: "mgrpvbgfpukdkzpm", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'matnarucr7@gmail.com', // sender address
        to: "matias.seitour01@gmail.com", // list of receivers
        subject: "este es un correo de prueba ✔", // Subject line
        text: "hola soy matias", // plain text body
        html: "<b>hola soy matias</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendMail();
