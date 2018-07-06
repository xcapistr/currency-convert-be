# currency-convert-be

Just experimental currency conversion app (server app in Node JS). It uses [Mongo DB](https://www.mongodb.com/) and [fixer.io](https://fixer.io/) API.

## FIXER rates access

Put `"FIXER_KEY"` value in `./nodemon.json` file.

## Run server

Run `npm start` command.

## API methods

### GET /rates

Return actual currency rates from fixer.io. Fixer data are stored in local file. Data older than 1 hour are always updated.

### GET /conversions

Return list of conversions.

### GET /conversions/[conversion-id]

Return single conversion.

### POST /conversions

Make a new conversion and save it to DB.

Request body example:

```json
{
	"currencyA": "CZK",
	"currencyB": "EUR",
	"amountA": "25"
}
```

### DELETE /converions/[conversion-id]

Remove a single conversion.
