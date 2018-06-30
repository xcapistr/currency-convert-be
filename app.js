const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ratesRoutes = require('./api/routes/rates');

// DB connection
mongoose.connect(
	'mongodb://purple:' +
		process.env.MONGO_ATLAS_PW +
		'@purple-currency-converter-shard-00-00-hklqs.mongodb.net:27017,purple-currency-converter-shard-00-01-hklqs.mongodb.net:27017,purple-currency-converter-shard-00-02-hklqs.mongodb.net:27017/test?ssl=true&replicaSet=purple-currency-converter-shard-0&authSource=admin&retryWrites=true'
);

// morgan for logs in console
app.use(morgan('dev'));

// http body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow access (CORS)
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Origin',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});

// Routes which should handle requests
app.use('/rates', ratesRoutes);

// Errors handling
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
