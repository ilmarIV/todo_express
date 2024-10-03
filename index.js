const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('test')
})

app.listen(3001, () => {
    console.log('app is started http://localhost:3001')
})