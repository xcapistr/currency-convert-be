const fs = require('fs');
const http = require('http');
const ratesData = require('./rates.json');

var isUpToDate = () => {
	now = new Date();
	return now.getTime() / 1000 < ratesData.timestamp + 3600;
};

// function for updating rates data in rates.json file
// this function uptades at least 1 hour old data
var updateRates = callback => {
	if (isUpToDate()) {
		callback(ratesData);
	} else {
		const options = {
			hostname: 'data.fixer.io',
			path: '/api/latest?access_key=' + process.env.FIXER_KEY,
			method: 'GET'
		};
		http
			.request(options, function(res) {
				var body = '';
				res.on('data', function(chunk) {
					body += chunk;
				});
				res.on('end', function() {
					var rates = JSON.parse(body);
					fs.writeFileSync(
						'./api/modules/rates/rates.json',
						JSON.stringify(rates)
					);
					rates.message = 'Rates has been updated';
					callback(rates);
				});
			})
			.end();
	}
};

module.exports = {
	updateRates,
	isUpToDate
};
