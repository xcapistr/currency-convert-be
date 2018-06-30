const express = require('express');
const router = express.Router();
const fixerRates = require('../modules/rates/rates.js');

// Handle incoming GET request to /rates
router.get('/', (req, res, next) => {
	// result must wait for update of rates
	// this is done by callback function
	fixerRates.updateRates(function(newRates) {
		res.status(200).json(newRates);
	});
});

module.exports = router;
