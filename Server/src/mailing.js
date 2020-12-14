const nodemailer = require("nodemailer");
const connection = require('./database/db')

async function main(email, id) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
        user: 'checkpcstock@gmail.com',
        pass: 'Amazoni123'
        }
    });

    connection.query("SELECT * FROM `items` WHERE id = ?", id, async function(err, item){
        item = item[0]
        await transporter.sendMail({
            from: '"checkPCstock!" <checkpcstock@gmail.com>',
            to: email,
            subject: "Stock alert!",
            text: "",
            html: `
            <h1>We want to let you to know that ${item.name} became available! Check it out:</h1>
            <a style="font-size=18px;" href=${item.link}>Buy Now</a>`,
        }).then(_ => {
            connection.query("DELETE FROM subscribes WHERE email = ? AND item = ?", [email, id])
        })
    });
    
    console.log('Email sent')
}

module.exports = main