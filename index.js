var crypto = require('crypto')

module.exports = shopify

function shopify(secret, field) {
  if (!(this instanceof shopify))
    return new shopify(secret, field)

  if (!secret) throw new Error('secret is required')
  field = field || 'X-Shopify-Hmac-SHA256'
  return function(req, res, next) {
    var raw = ''
    req.on('data', function(chunk) {
      raw += chunk
    })

    req.on('end', function() {
      req.shopifyBody = raw
    })

    req.fromShopify = function() {
      var header = req.get(field)
      var sh = crypto
        .createHmac('sha256', secret)
        .update(new Buffer(req.shopifyBody, 'utf8'))
        .digest('base64')

      return sh === header
    }

    next()
  }
}
