const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63740ad867174c83e25d085b',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/', (req, res) => res.status(404).send({ message: 'Не туда зашли, батенька!' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
