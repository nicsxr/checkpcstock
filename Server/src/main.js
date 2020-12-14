const express = require('express')
const cors = require('cors')

const api = require('./routes/api')
const {updateEmails, updateDatabase} = require('./updater')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {

})
app.use('/api', api)

setInterval(() => {
    updateEmails()
}, 30000);
updateDatabase()
app.listen(8000)