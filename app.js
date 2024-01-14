const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

// 1) MIDDLEWARE

app.use(morgan('dev')); // prints request info to console

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
