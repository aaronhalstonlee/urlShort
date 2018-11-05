require('dotenv').config();
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.port || 3000;

//connect to db
mongoose.connect(process.env.MONGOLAB_URI);

//build db
const Schema = mongoose.Schema;
const urlSchema = new Schema({
    url: String,
    short: Number
});
const Shorty = mongoose.model('Shorty', urlSchema);

const makeShort = url => url.length;
const createAndSaveShorty = (url,done)=>{
    const shortened = new Shorty({url:url, short:makeShort(url)});
    shortened.save((err,data)=>{
        if(err) done(err);
        done(null,data);
    })
}

//middlewares
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use('/public', express.static(process.cwd() + '/public'));

//routes
app.get('/', (req,res)=>{
    res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api', (req,res)=>{
    res.sendFile(process.cwd() + '/views/form.html');
});

app.post('/api/shorturl/new', (req, res) => {
    createAndSaveShorty(req.body.url);
    res.json(req.body.url);
})

app.listen(port, ()=>{
    console.log('node.js can hear you...');
});