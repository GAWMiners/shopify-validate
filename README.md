# shopify-validate

Simple express middleware to validate shopify web hooks

## Install

```bash
$ npm install --save shopify-validate
```

## Usage

```js
var express = require('express')
  , bodyParser = require('body-parser')
  , Shopify = require('shopify-validate')
  , shopifySecret = process.env.SHOPIFY_SECRET

var shopify = new Shopify(shopifySecret)
// make sure the shopify validate middleware
// is added before bodyParser
var middleware = [shopify, bodyParser.json()]

var app = express()

app.post('/webhook', middleware, function(req, res) {
  // validate the request is from shopify
  if (!req.fromShopify()) {
    return res.status(401).send()
  }

  // send success notification to shopify
  // done before to prevent timeout
  res.status(200).send()

  var body = req.body
  // process webhook
})
```

## Test

```bash
$ npm test
```

## License

MIT (See `LICENSE` for more info)

## Author

Evan Lucas

(c) 2014 GAW Miners
