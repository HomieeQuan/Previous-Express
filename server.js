const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://middletaq:gNhRcAXiSADbEhMY@palindrome.uhwanqi.mongodb.net/?retryWrites=true&w=majority";
const dbName = "palindrome";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('userWord').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {palindromes: result})
  })
})

app.post('/palindrome', (req, res) => {
  console.log(req.body.word)
  
  let pResult = false
  if(req.body.word === req.body.word.split('').reverse().join('')){
            pResult = true
  }
  db.collection('userWord').insertOne({word: req.body.word, pResult: pResult}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.delete('/palindrome', (req, res) => {
  db.collection('userWord').findOneAndDelete({word: req.body.word}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})


