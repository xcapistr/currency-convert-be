const mongoose = require('mongoose');

const conversionSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	currencyA: String,
	currencyB: String,
	amountA: Number,
	amountB: Number,
	amountUSD: Number
});

module.exports = mongoose.model('Conversion', conversionSchema);
