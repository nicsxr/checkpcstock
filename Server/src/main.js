const express = require('express')
const cors = require('cors')
require('dotenv').config()

const colors = require('colors')
const api = require('./routes/api')
const {updateEmails, updateDatabase} = require('./updater')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', api)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname + '/public'))

    app.get(/.*/, (req, res) => {
        res.sendFile(__dirname + '/public/index.html')
    })
}



// setInterval(() => {
//     updateEmails()
// }, 3000);
//updateDatabase()
app.listen(8000)