var express = require('express')
  , request = require('supertest')
  , bodyParser = require('body-parser')
  , assert = require('assert')
  , shopify = require('../')
  , crypto = require('crypto')

describe('shopify-validate', function() {
  it('should throw err if no secret is passed', function() {
    assert.throws(function() {
      shopify()
    }, /secret is required/)
  })

  it('should add fromShopify function to req', function(done) {
    var app = express()

    app.use(shopify('1234'))
    app.use(bodyParser.json())
    app.use(function(req, res, next) {
      if (!req.fromShopify) return res.status(500).send()
      res.status(200).send()
    })
    var req = request(app)
    req
      .post('/')
      .send({ name: 'evan' })
      .end(done)
  })

  it('req.fromShopify should return true on success', function(done) {
    var app = express()

    app.use(shopify('1234'))
    app.use(bodyParser.json())
    app.use(function(req, res, next) {
      if (!req.fromShopify()) return res.status(500).send()
      res.status(200).send()
    })
    var body = {
      name: 'evan'
    }
    var headerVal = crypto.createHmac('sha256', '1234')
      .update(new Buffer(JSON.stringify(body), 'utf8'))
      .digest('base64')
    var req = request(app)
    req
      .post('/')
      .set('X-Shopify-Hmac-SHA256', headerVal)
      .send(body)
      .end(done)
  })

  it('req.fromShopify should return false on failure', function(done) {
    var app = express()

    app.use(shopify('1234'))
    app.use(bodyParser.json())
    app.use(function(req, res, next) {
      if (req.fromShopify()) return res.status(500).send()
      res.status(200).send()
    })
    var body = {
      name: 'evan'
    }
    var headerVal = crypto.createHmac('sha256', '1234')
      .update(new Buffer(JSON.stringify({name: 'evan2'}), 'utf8'))
      .digest('base64')
    var req = request(app)
    req
      .post('/')
      .set('X-Shopify-Hmac-SHA256', headerVal)
      .send(body)
      .end(done)
  })
})
