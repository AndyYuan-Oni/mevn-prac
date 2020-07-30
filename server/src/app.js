console.log('Hello World');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const Post = require('../models/post')
const path = require('path')

//https
const fs = require('fs');
const https = require('https');
const http = require('http')

const privateKey = fs.readFileSync(path.resolve('./sslcert/server.key'));
const certificate = fs.readFileSync(path.resolve('./sslcert/server.cert'));
const credentials = { key: privateKey, cert: certificate };


//connect db
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/posts');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', function(cb) {
    console.log('succeded')
})


const app = express();

const port = 5500

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

//apis
// get all posts
app.get('/posts', (req, res) => {
    Post.find({}, 'title description', function(error, posts) {
        if (error) { console.error(error); }
        res.send({
            posts: posts
        })
    }).sort({ _id: -1 })
})

//create new post
app.post('/posts', (req, res) => {
    let db = req.db;
    let title = req.body.title;
    let description = req.body.description;
    let new_post = new Post({
        title: title,
        description: description
    })

    new_post.save(function(error) {
        if (error) {
            console.error();
        }

        res.send({
            success: true,
            message: 'Post saved'
        })
    })
})

//fetch a single post
app.get('/post/:id', (req, res) => {
    let db = req.db;
    Post.findById(req.params.id, 'title description', function(error, posts) {
        if (error) {
            console.error(error);
        }
        res.send(posts)
    })
})

//update a post
app.put('/posts/:id', (req, res) => {
    let db = req.db;
    Post.findById(req.params.id, 'title description', function(error, post) {
        if (error) { console.error(error); }

        post.title = req.body.title;
        post.description = req.body.description;
        post.save(function(error) {
            if (error) { console.error(error); }
            res.send({ success: true })
        })
    })
})

//delete a post
// there is a _id prob need to be careful, it's a property of mongodb
app.delete('/posts/:id', (req, res) => {
    let db = req.db;
    console.log(req.params)
    Post.remove({
        _id: req.params.id
    }, function(err, post) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})


// app.listen(process.env.PORT || port)
// console.log("listening on http://localhost:" + port)
//https add

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app)


httpServer.listen(5000);
httpsServer.listen(port);
console.log("listening on https://localhost:" + port)