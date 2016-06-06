/**
 * Created by moshee
 * on: 24/04/16.
 */
var debug = require('debug')('segmentio:kenshoo');
var Integration = require('segmentio-integration');
var dot = require('obj-case');
var Batch = require('batch');
var mapper = require('./mapper');

/**
 * Kenshoo Segment integration module
 */

var Kenshoo = module.exports = new Integration('Kenshoo')
    .channels(['mobile', 'server', 'client'])
    .ensure('settings.token')
    .ensure('settings.endpointUrl')
    .ensure(function (msg) {
        if (msg.proxy('context.referrer.id') === 'some-id') return;
        return this.reject('context.referrer.id must be "some-id"');
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

Kenshoo.prototype.initialize = function () {
    this.endpoint = this.settings.endpointUrl;
};

Kenshoo.prototype.track = function (track, callback) {
    var self = this;
    var payload = mapper.track(track, this.settings);
    self
        .get()
        .set('User-Agent', 'Segment.io/1.0.0')
        .set('Cookie', payload.cookie)
        .query(payload)
        .end(self.handle(callback));
};