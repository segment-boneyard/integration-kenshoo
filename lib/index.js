/**
 * Created by moshee @ Kenshoo
 * on: 24/04/16.
 */

var Integration = require('segmentio-integration');
var mapper = require('./mapper');

/**
 * Kenshoo Segment integration module
 */

var Kenshoo = module.exports = new Integration('Kenshoo')
  .channels(['mobile', 'server'])
  .ensure('settings.token')
  .ensure('settings.subdomain')
  .ensure(function (msg) {
    if (msg.proxy('context.referrer.id')) return;
    return this.reject('context.referrer.id required');
  })
  .ensure(function (msg) {
    if (msg.proxy('context.referrer.type') === 'kenshoo') return;
    return this.reject('context.referrer.type must be "kenshoo"');
  })
  .ensure(function (msg, settings) {
    if (msg.proxy('integrations.Kenshoo.cookie')) return;
    return this.reject('kenshoo cookie value required');
  })
  .retries(3);

/**
 * Initialize.
 */

Kenshoo.prototype.initialize = function () {
  this.endpoint = 'https://' + this.settings.subdomain + '.xg4ken.com/trk/v1';
};

/**
 * Track
 */

Kenshoo.prototype.track = function (track, callback) {
  var self = this;
  var payload = mapper.track(track, this.settings);
  self
    .get()
    .set('User-Agent', 'Segment.io/1.0.0')
    .set('kenshoo_id', payload.cookie)
    .query(payload.payload)
    .end(self.handle(callback));
};