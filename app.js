// env - check
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// moongoose
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection;
// Mongoose
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoose'))

// Ejs
app.set('view engine', 'ejs');
app.set('views', './views');
// layout的 地址 和 view一样
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));

// Routes
app.use('/', require('./routes/index'));  
app.use('/authors', require('./routes/authors'));
app.use('/books', require('./routes/books'))


app.listen(process.env.PORT || 3000);