/**
 * Created by moshee @ Kenshoo
 * on: 24/04/16.
 */

var Integration = require('segmentio-integration');
var mapper = require('./mapper');
var fmt = require('util').format;

/**
 * Kenshoo Segment integration module
 */

var Kenshoo = module.exports = new Integration('Kenshoo')
  .channels(['mobile', 'server', 'client'])
  .ensure('settings.token')
  .ensure('settings.subdomain');

Kenshoo.ensure(function(msg) {
  var referrer = msg.proxy('context.referrer.type');
  if (referrer === 'kenshoo' || referrer === 'Kenshoo') return;
  return this.reject('referrer type must be Kenshoo');
})

Kenshoo.ensure(function(msg, settings) {
  if (msg.proxy('context.referrer.id')) return;
  return this.reject('kenshoo id required');
});

/**
 * Initialize.
 */

Kenshoo.prototype.initialize = function() {
  this.endpoint = fmt('https://%s.xg4ken.com/trk/v1', this.settings.subdomain);
};

/**
 * Track
 */

Kenshoo.prototype.track = function(track, fn) {
  var result = mapper.track(track, this.settings) || {};
  if (result.cookie && result.payload) {
    this.get()
      .set('User-Agent', 'Segment.io/1.0.0')
      .set('Cookie', result.cookie)
      .query(result.payload)
      .end(this.handle(fn));
  } else {
    this.debug('unmapped event');
    fn();
  }
};