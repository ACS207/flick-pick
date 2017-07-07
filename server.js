const express = require('express');
const env = require('dotenv').load();
// const config = require('./db/dbconfig.js');
// const db = require('./db/dbsetup.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const router = require('./server/router.js');

const port = process.env.PORT || 3000;

// EXPRESS
const app = express();

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(morgan('dev'));

// ROUTES
app.use(express.static(path.resolve(__dirname, './public')));
app.use('/', router);


// INITIALIZE
app.listen(port, () => {
  console.log('listening ', port)
});

module.exports = app;
