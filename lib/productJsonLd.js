'use strict'
var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
Object.defineProperty(exports, '__esModule', { value: !0 })
exports['default'] = void 0
var _react = _interopRequireDefault(require('react'))
var _head = _interopRequireDefault(require('next/head'))
var _markup = _interopRequireDefault(require('../node_modules/next-seo/lib/utils/markup'))
var _formatIfArray = _interopRequireDefault(require('../node_modules/next-seo/lib/utils/formatIfArray'))
var __jsx = _react['default'].createElement
var buildBrand = function (a) {
  return '\n  "brand": {\n      "@type": "Thing",\n      "name": "'.concat(a, '"\n    },\n')
}
var buildReviewRating = function (a) {
  return a ? '"reviewRating": {\n          "@type": "Rating",\n          '.concat(a.bestRating ? '"bestRating": "'.concat(a.bestRating, '",') : '', '\n          ').concat(a.worstRating ? '"worstRating": "'.concat(a.worstRating, '",') : '', '\n          "ratingValue": "').concat(a.ratingValue, '"\n        }') : ''
}
var buildAuthor = function (a) {
  return '\n  "author": {\n      "@type": "'.concat(a.type, '",\n      "name": "').concat(a.name, '"\n  },\n')
}
var buildPublisher = function (a) {
  return '\n  "publisher": {\n      "@type": "'.concat(a.type, '",\n      "name": "').concat(a.name, '"\n  },\n')
}
var buildReviews = function (a) {
  return '\n"review": [\n  '.concat(a.map(function (a) {
    return '{\n      "@type": "Review",\n      '.concat(a.author ? buildAuthor(a.author) : '', '\n      ').concat(a.publisher ? buildPublisher(a.publisher) : '', '\n      ').concat(a.datePublished ? '"datePublished": "'.concat(a.datePublished, '",') : '', '\n      ').concat(a.reviewBody ? '"reviewBody": "'.concat(a.reviewBody, '",') : '', '\n      ').concat(a.name ? '"name": "'.concat(a.name, '",') : '', '\n      ').concat(buildReviewRating(a.reviewRating), '\n  }')
  }), '],')
}
var buildAggregateRating = function (a) {
  return '\n  "aggregateRating": {\n      "@type": "AggregateRating",\n      "ratingValue": "'.concat(a.ratingValue, '",\n      "reviewCount": "').concat(a.reviewCount, '"\n    },\n')
}
var buildOffers = function (a) {
  return '\n  {\n    "@type": "Offer",\n    "priceCurrency": "'.concat(a.priceCurrency, '",\n    ').concat(a.priceValidUntil ? '"priceValidUntil": "'.concat(a.priceValidUntil, '",') : '', '\n    ').concat(a.itemCondition ? '"itemCondition": "'.concat(a.itemCondition, '",') : '', '\n    ').concat(a.availability ? '"availability": "'.concat(a.availability, '",') : '', '\n    ').concat(a.url ? '"url": "'.concat(a.url, '",') : '', '\n    ').concat(a.seller ? '\n      "seller": {\n      "@type": "Organization",\n      "name": "'.concat(a.seller.name, '"\n    },\n    ') : '', '\n    "price": "').concat(a.price, '"\n  }\n')
}
var ProductJsonLd = function (a) {
  var b = a.productName
  var c = a.images

  var d = void 0 === c ? [] : c

  var e = a.description

  var f = a.sku

  var g = a.gtin8

  var h = a.gtin13

  var i = a.gtin14

  var j = a.mpn

  var k = a.brand

  var l = a.reviews

  var SHIPPING_WEIGHT = a.SHIPPING_WEIGHT

  var AGE_GROUP = a.AGE_GROUP

  var gender = a.gender

  var color = a.color

  var size = a.size

  var m = void 0 === l ? [] : l

  var n = a.aggregateRating

  var o = a.offers

  var p = '{\n    "@context": "http://schema.org/",\n    "@type": "Product",\n    "image":'
    .concat((0, _formatIfArray['default'])(d), ',\n    ').concat(e ? '"description": "'.concat(e, '",') : '', '\n    ')
    .concat(j ? '"mpn": "'.concat(j, '",') : '', '\n    ').concat(SHIPPING_WEIGHT ? '"SHIPPING_WEIGHT": "'.concat(SHIPPING_WEIGHT, '",') : '', '\n    ')
    .concat(color ? '"color": "'.concat(color, '",') : '', '\n    ')
    .concat(AGE_GROUP ? '"AGE_GROUP": "'.concat(AGE_GROUP, '",') : '', '\n    ')
    .concat(gender ? '"gender": "'.concat(gender, '",') : '', '\n    ')
    .concat(size ? '"size": "'.concat(size, '",') : '', '\n    ')
    .concat(f ? '"sku": "'.concat(f, '",') : '', '\n    ').concat(g ? '"gtin8": "'.concat(g, '",') : '', '\n    ')
    .concat(h ? '"gtin13": "'.concat(h, '",') : '', '\n    ').concat(i ? '"gtin14": "'.concat(i, '",') : '', '\n    ')
    .concat(k ? buildBrand(k) : '', '\n    ').concat(m.length ? buildReviews(m) : '', '\n    ')
    .concat(n ? buildAggregateRating(n) : '', '\n    ').concat(o ? '"offers": '.concat(Array.isArray(o) ? '['
      .concat(o.map(function (a) {
        return ''.concat(buildOffers(a))
      }), ']') : buildOffers(o), ',') : '', '\n    "name": "').concat(b, '"\n  }')
  return _react['default'].createElement(_head['default'], null, _react['default'].createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: (0, _markup['default'])(p),
    key: 'jsonld-product'
  }))
}

var _default = ProductJsonLd
exports['default'] = _default
