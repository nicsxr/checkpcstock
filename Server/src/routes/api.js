const express = require('express')
const router = express.Router()

const connection = require('../database/db')
const scrape = require('../scraper')

router.get('/getall', (req, res) => {
    connection.query("SELECT * FROM `items`", async (err, rows) => {
        res.json(rows)
    });
})

router.get('/get', (req, res) => {
    const searchWord = req.query.searchWord
    const stores = req.query.stores
    const items = req.query.items
    const inStock = req.query.inStock
    console.log(req.query)

    let itemQuery = `SELECT * FROM items WHERE name like '%${searchWord}%'`

    // ADD ITEMS
    if(items){
        itemQuery += ` AND `
        for (let i = 0; i < items.length; i++) {
            if(i == items.length-1){
                itemQuery += `name LIKE '%${items[i]}%'`
            }else{
                itemQuery += `name LIKE '%${items[i]}%' OR `
            }   
        }
    }

    if(stores){
        itemQuery += ` AND `
        for (let i = 0; i < stores.length; i++) {
            if(i == stores.length-1){
                itemQuery += `store LIKE '%${stores[i]}%'`
            }else{
                itemQuery += `store LIKE '%${stores[i]}%' OR `
            }   
        }
    }

    if(inStock=='true'){
        itemQuery += ` AND in_stock = 1`
    }
    console.log(itemQuery)
    
    connection.query(itemQuery, async (err, rows) => {
        res.json(rows)
    })

})


router.post('/add', (req, res) => {
    url = req.body.url
    connection.query("SELECT * FROM `items` WHERE link LIKE ?", `%${url}%`, async (err, rows) => {
        if(rows < 1){
            scrape(url)
            res.send('Listing has been added!')
        }else{
            scrape(url)
            res.sendStatus(403)
        }
    });    
})

router.post('/subscribe', (req, res) => {
    const email = req.body.email
    const item = req.body.item
    connection.query("SELECT * FROM `subscribes` WHERE email = ? AND item = ?", [email, item], async (err, rows) => {
        if(err) throw err
        if(rows < 1){
            connection.query(`INSERT INTO subscribes (email, item) VALUES ('${email}', '${item}')`, async (err, rows) =>{
                if(err) throw err
                res.sendStatus(200)
            })
        }else{
            res.sendStatus(403)
        }
    });    
})



module.exports = router