'use strict';
//require('dotenv').config();
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.port || 3000;

//connect to db
mongoose.connect(process.env.MONGOLAB_URI,{useMongoClient:true});

//build db
const Schema = mongoose.Schema;
const urlSchema = new Schema({
    url: String,
    short: String
});
const Shorty = mongoose.model('Shorty', urlSchema);

const makeShort = (url) => {
    var len = url.length;
    var ran = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
    return len.length < ran.length ? len : ran;
}

//middlewares
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use('/public', express.static(process.cwd() + '/public'));

//routes
app.get('/', (req,res)=>{
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', (req, res) => {
  var shortURL = makeShort(req.body.url)
  const shortened = new Shorty({url: req.body.url, short: shortURL});
  shortened.save((err, data)=>{
    if(err) throw(err);
    res.json({'url': req.body.url, 'short':shortURL});
  });
})

app.get('/api/:url', (req, res) => {
  //const url = req.params.url;
  Shorty.find({short: req.params.url}, (err, data)=>{
    if(err) throw(err);
    res.redirect(301, data[0].url);
  })
})

app.listen(port, ()=>{
    console.log('oh fuck, hold on a sec...');
    setTimeout(()=>{
          console.log('*shuffles papers around*');
        }, 1100);
    setTimeout(() => {
        console.log('ok im ready now')
    }, 2500);
});