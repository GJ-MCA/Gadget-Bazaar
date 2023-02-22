const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors');
connectToMongo();
const app = express()
const port = 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello GJ to backend!')
})

// Routes
app.use('/gadgetbazaar/auth', require('./routes/auth'));
app.use('/gadgetbazaar/products/', require('./routes/products/products_main'));
app.use('/gadgetbazaar/admin/products/', require('./routes/admin/admin_products'));
app.use('/gadgetbazaar/order', require('./routes/products/products_order'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})