const connection = require('./database/db')
const cheerio = require('cheerio')
const axios = require('axios')

function scrape(url){
    let store  = url.split('.com')[0].split('').reverse().join('')
    store = store.substr(0, store.indexOf('.')).split('').reverse().join('').toLowerCase();
    switch(store){
        case 'newegg':
            newEgg(url)
            break
        case 'bestbuy':
            bestBuy(url)
            break
        case 'amazon':
            amazon(url)
            break
    }
}

function newEgg(url){
    axios.get(url).then(res => {
        const $ = cheerio.load(res.data)

        const store = 'NewEgg'

        const name = $('.product-title').html()
        const image = $('.product-view-img-original').attr('src')
        const manufancturer = getManufancturer(name.toString())
        const price = $('.price-current').find('strong').html() + $('.price-current').find('sup').html()
        const type = getType(name)
        const inStock = $('.product-inventory').find('strong').text() == ' OUT OF STOCK.' ? 0 : 1

        connection.query("SELECT * FROM items WHERE link = ?", url , async (err, rows) =>{
            if(err) console.log(err)
            else {
                if(rows < 1){
                    connection.query(`INSERT INTO items (link,store,name,image,manufancturer,price,type,in_stock) VALUES ('${url}',${store} '${name}', '${image}', '${manufancturer}', '${price}', '${type}', '${inStock}')`)
                    console.log('New record added')
                }else{
                    connection.query(`UPDATE items SET price = ?, in_stock = ?, image = ?, last_checked = now() WHERE link = '${url}'`, [price, inStock, image])
                    console.log(`Updated: ${name} In Stock: ${inStock}`)
                }
            }
        })
    })
}

function bestBuy(url){
    axios.get(url,{
        headers: {
            Cookie: "intl_splash=false;"
        }
    }).then(res => {
        const $ = cheerio.load(res.data)

        const store = 'BestBuy'
        const image = $('.primary-image').attr('src')
        const name = $('.v-fw-regular').html()
        const manufancturer = getManufancturer(name.toString())
        const price = $('.priceView-customer-price').find('span').html().replace('$', '')
        const type = getType(name)
        const inStock = $('.add-to-cart-button').html() == 'Sold Out' ? 0 : 1

        connection.query("SELECT * FROM items WHERE link = ?", url , async (err, rows) =>{
            if(err) console.log(err)
            else {
                if(rows < 1){
                    connection.query(`INSERT INTO items (link,store,name,image,manufancturer,price,type,in_stock) VALUES ('${url}', '${store}', '${name}', '${image}', '${manufancturer}', '${price}', '${type}', '${inStock}')`)
                    console.log('New record added')
                }else{
                    connection.query(`UPDATE items SET price = ?, in_stock = ?, image = ?, last_checked = now() WHERE link = '${url}'`, [price, inStock, image])
                    console.log(`Updated: ${name} In Stock: ${inStock}`)
                }
            }
        })
    })
}


function amazon(url){
    axios.get(url).then(res => {
        const $ = cheerio.load(res.data)

        const store = 'Amazon'

        const name = $('#productTitle').html().replace(/\n/g, "")
        const image = $('#imgTagWrapperId').find('img').attr('data-old-hires')
        const manufancturer = getManufancturer(name.toString())
        const price = $('#priceblock_ourprice').html() == null ? 'N/A' : $('#priceblock_ourprice').html().replace('$', '')
        const type = getType(name)
        const inStock = $('.a-color-state').html().includes('In stock') ? 1 : 0
        
        connection.query("SELECT * FROM items WHERE link = ?", url , async (err, rows) =>{
            if(err) console.log(err)
            else {
                if(rows < 1){
                    connection.query(`INSERT INTO items (link,store,name,image,manufancturer,price,type,in_stock) VALUES ('${url}','${store}', '${name}', '${image}', '${manufancturer}', '${price}', '${type}', '${inStock}')`)
                    console.log('New record added')
                }else{
                    connection.query(`UPDATE items SET price = ?, in_stock = ?, image = ?, last_checked = now() WHERE link = '${url}'`, [price, inStock, image])
                    console.log(`Updated: ${name} In Stock: ${inStock}`)
                }
            }
        })
    })
}


function getManufancturer(name){
    name = name.toLowerCase()
    if (name.includes('nvidia') || name.includes('geforce')){
        return 'NVIDIA'
    }
    if (name.includes('radeon rx') || name.includes('amd')){
        return 'AMD'
    }
}

function getType(name){
    name = name.toLowerCase()
    if (name.includes('nvidia') || name.includes('geforce') || name.includes('radeon rx')){
        return 'GPU'
    }
    if (name.includes('cpu') || name.includes('ryzen') || name.includes('intel')){
        return 'CPU'
    }
}


module.exports = scrape