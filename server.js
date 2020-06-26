require('dotenv').config();

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors'); 
const routes     = require('./routes/router');
const path       = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/views'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', routes);


const PORT = process.env.PORT || 8080;


mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, db) => {
    if(!err) console.log('connected to db');
})

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

