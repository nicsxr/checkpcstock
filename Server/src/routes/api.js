const express = require('express')
const router = express.Router()

const connection = require('../database/db')
const scrape = require('../scraper')

router.get('/getall', (req, res) => {
    connection.query("SELECT * FROM `items`", async (err, rows) => {
        res.json(rows)
    });
})

router.get('/get/:name', (req, res) => {
    const name = req.params.name
    connection.query("SELECT * FROM `items` WHERE name LIKE ?", `%${name}%`, async (err, rows) => {
        res.json(rows)
    });
})


router.post('/add', (req, res) => {
    url = req.body.url
    connection.query("SELECT * FROM `items` WHERE link LIKE ?", `%${url}%`, async (err, rows) => {
        if(rows < 1){
            scrape(url)
            res.send('Listing has been added!')
        }else{
            res.sendStatus(403)
        }
    });    
})

router.post('/subscribe', (req, res) => {
    const email = req.body.email
    const item = req.body.item

    connection.query("SELECT * FROM `subscribes` WHERE email LIKE ? AND item = ?", [email, item], async (err, rows) => {
        if(rows < 1){
            connection.query("INSERT INTO subscribes (email, item)", [email, item])
            res.send('Subscribed!')
        }else{
            res.send('Already subscribed!')
        }
    });    
})





module.exports = router