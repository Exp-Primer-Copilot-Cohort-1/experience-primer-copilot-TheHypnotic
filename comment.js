// Create web server

// Import express
const express = require('express');
const app = express();

// Import body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Import mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Comment', { useNewUrlParser: true, useUnifiedTopology: true });

// Create schema
const commentSchema = new mongoose.Schema({
    name: String,
    email: String,
    comment: String
});

// Create model
const Comment = mongoose.model('Comment', commentSchema);

// Set view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Set static folder
app.use(express.static('public'));

// Create route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/comments', (req, res) => {
    Comment.find((err, comments) => {
        if (err) return console.error(err);
        res.render('comments', { comments: comments });
    });
});

app.post('/comments', (req, res) => {
    const comment = new Comment(req.body);
    comment.save()
        .then(() => res.redirect('/comments'))
        .catch(err => {
            res.status(400).send('Unable to save to database');
        });
});

// Start server
app.listen(3000, () => console.log('Server started on port 3000'));