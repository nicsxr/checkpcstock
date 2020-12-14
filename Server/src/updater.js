const scrape = require('./scraper')
const connection = require('./database/db')
const mail = require('./mailing')

const timer = ms => new Promise(res => setTimeout(res, ms))

async function updateDatabase(){
    connection.query("SELECT * FROM `items`", async function(err, rows){
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            scrape(row.link)
            await timer(300)
        }
        updateDatabase()
    });
}

async function updateEmails(){
    ids = await getAllSubscribedIds()
    ids.forEach(id => {
        connection.query("SELECT * FROM items WHERE id=?", id, async function(err, rows){
            item = rows[0]
            if(item.in_stock) sendEmails(id)
        })  
    });
}


async function sendEmails(id){
    emails = await getAllSubscribedEmailsById(id)
    emails.forEach(email => {
        mail(email, id)
    });
}


async function getAllSubscribedIds(){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM subscribes", async function(err, rows){
            ids = new Set()
            rows.forEach(row => {
                ids.add(row.item)
            });
            return resolve(ids)
        })
    })
}

async function getAllSubscribedEmailsById(id){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM subscribes WHERE item=?",id, async function(err, rows){
            emails = new Set()
            rows.forEach(row => {
                emails.add(row.email)
            });
            return resolve(emails)
        })
    })
}
module.exports = {updateEmails, updateDatabase}