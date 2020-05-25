const express = require('express');
const assetRouter = require('./routes/assets');
const productRouter = require('./routes/products');
const loginRouter = require('./routes/login');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users');
const authenticationMiddleware = require('./middlewares/authentication');

const app = express();
const port = 80;

app.use(express.json());
app.use(authenticationMiddleware);

app.use('/assets', assetRouter);
app.use('/products', productRouter);
app.use('/login', loginRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);

app.use(function(error, req, res, next) {
    res.status(500);
    // TODO Michal: better exception handling
    // distinguish between internal exceptions and exceptions to show to the user
    if (error.message || error.stack) {
      res.json({message: error.message, stack: error.stack });
    } else {
      res.send(error);
    }
  });


app.listen(port, () => console.log(`App listening on port ${port}!`));