const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors');
connectToMongo();
const app = express()
const port = 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello GJ to backend!')
})

// Routes
app.use('/backend-gadgetbazaar/auth', require('./routes/auth'));
app.use('/backend-gadgetbazaar/products', require('./routes/products/products_main'));
app.use('/backend-gadgetbazaar/admin/products', require('./routes/admin/admin_products'));
app.use('/backend-gadgetbazaar/order', require('./routes/products/products_order'));
app.use('/backend-gadgetbazaar/payment', require('./routes/payment/payment_main'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})