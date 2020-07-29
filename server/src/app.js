console.log('Hello World');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const Post = require('../models/post')

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

app.get('/posts', (req, res) => {
    res.send(
        [{
            title: "Hello World",
            description: "HI there ! I'm practising"
        }]
    )
})

//db apis

app.post('/posts', (re, res) => {
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


app.listen(process.env.PORT || port)
console.log("listening on http://localhost:" + port)