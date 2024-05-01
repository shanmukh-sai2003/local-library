const express = require('express');
const logger = require('morgan');
const path = require('path');
const makeConnection = require('./connect');
const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

makeConnection();

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});