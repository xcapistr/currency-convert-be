const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Conversion = require('../models/coversion');
const fixerRates = require('../modules/rates/rates.js');
const fixerData = require('../modules/rates/rates.json');

// Handle incoming GET requests to /conversions
router.get('/', (req, res, next) => {
	Conversion.find()
		.exec()
		.then(docs => {
			// console.log(docs);
			res.status(200).json(docs);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

// Handle incoming POST request to /conversions
// includes calling updateRates function and calculate the result of the conversion
router.post('/', (req, res, next) => {
	console.log('calling POST on /conversions');
	// 1st control
	if (!req.body.currencyA || !req.body.currencyB || !req.body.amountA) {
		console.log(
			'missing atributes, required are currencyA, currencyB and amountA'
		);
		console.log(req);
		res.status(400).json({
			message:
				'missing atributes, required are currencyA, currencyB and amountA'
		});

		// 2nd control
	} else if (
		!fixerData.rates[req.body.currencyA] ||
		!fixerData.rates[req.body.currencyB]
	) {
		res.status(400).json({
			message: 'currency not found'
		});
	} else {
		// conversion init
		var conversion = new Conversion({
			_id: new mongoose.Types.ObjectId(),
			currencyA: req.body.currencyA,
			currencyB: req.body.currencyB,
			amountA: req.body.amountA
		});

		// update and calculate
		fixerRates.updateRates(function(newRates) {
			conversion.amountB =
				(conversion.amountA / newRates.rates[conversion.currencyA]) *
				newRates.rates[conversion.currencyB];

			conversion.amountUSD =
				(conversion.amountA / newRates.rates[conversion.currencyA]) *
				newRates.rates['USD'];

			// save
			conversion
				.save()
				.then(result => {
					console.log(result);
					res.status(201).json({
						message: 'Handling POST request to /conversions',
						conversion: conversion
					});
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({
						error: err
					});
				});
		});
	}
});

// Handle incoming GET request to /conversions/conversionId
router.get('/:conversionId', (req, res, next) => {
	const id = req.params.conversionId;
	Conversion.findById(id)
		.exec()
		.then(doc => {
			console.log('From DB', doc);
			if (doc) {
				res.status(200).json(doc);
			} else {
				res
					.status(404)
					.json({ message: 'No valid entry found for provided ID' });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

// Handle incoming DELETE request to /conversions/conversionIs
router.delete('/:conversionId', (req, res, next) => {
	const id = req.params.conversionId;
	Conversion.findOneAndRemove({ _id: id }) //updated function from .remove()
		.exec()
		.then(result => {
			if (result) {
				res
					.status(200)
					.json({ message: 'conversion has been deleted', conversion: result });
			} else {
				res.status(404).json({ message: 'conversion not found' });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;
