/* eslint-disable max-lines */
const dotenv = require('dotenv');
const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

// prepare config
dotenv.config();
const app = express();
const PORT = 8091;

// middlewares
app.use(cors({ origin: '*' }));
// app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  next(createError(404));
});

// write your routes here

// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

// eslint-disable-next-line
app.listen(PORT, () => console.info(`mock server started on port ${PORT}`));
