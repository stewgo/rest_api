const express = require('express');
const productRouter = require('./routes/products');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');

const app = express();
const port = 80;

app.use(express.json());
  
app.get('/', (req, res) => res.send('Hello World!!!'));
app.use('/products', productRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

app.use(function(error, req, res, next) {
    res.status(500);
    // TODO Michal: better exception handling
    // distinguish between internal exceptions and exceptions to show to the user
    console.log(Object.keys(error));
    res.json({message: error.message, stack: error.stack });
  });


app.listen(port, () => console.log(`App listening on port ${port}!`));