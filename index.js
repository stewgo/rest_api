const express = require('express');
const productRouter = require('./routes/products');

const app = express();
const port = 80;

app.get('/', (req, res) => res.send('Hello World!!!'));
app.use('/products', productRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));