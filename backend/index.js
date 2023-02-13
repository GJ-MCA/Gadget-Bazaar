const connectToMongo = require('./db');
const express = require('express')

connectToMongo();
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello GJ to backend!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})