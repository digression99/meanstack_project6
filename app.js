const express = require('express');
const app = express();
const router = express.Router();

const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);
var bodyParser = require('body-parser');
const cors = require('cors');


mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log("couldn't connect to database," + err);
    } else {
        //console.log(config.secret);
        console.log("connected to data base, " + config.db);
    }
});


// only use cors in development environment.
app.use(cors({
    origin : 'http://localhost:4200'
}));

// make sure you put this before routes. because this has to interpret the post req.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + '/client/dist'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);

app.get('/', (req, res) => {
    res.send('hello');
});

app.get('*', (req, res) => {
    // in production mode.
    res.sendFile(path.join(__dirname, '/client/src/index.html'));
    //res.send('hello');
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});