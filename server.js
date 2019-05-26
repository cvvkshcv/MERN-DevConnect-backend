const express = require('express');
const app = express();
const mongo  = require('mongoose');
const db = require('./config/keys').mongoURI;
const bodyParser = require('body-parser');
require('./config/__line');
// routing files
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const jwtAuth = require('./config/jwtAuth');

// Body parse middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

mongo
	.connect(db, { useNewUrlParser : true })
	.then(() => console.log(`Mongo connected`))
	.catch(err => console.log(err));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', jwtAuth, posts);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server listening to ${port}`);
});
