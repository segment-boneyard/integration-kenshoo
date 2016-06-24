
/**
 * Module Dependencies
 */

var reject = require('reject');
var lookup = require('obj-case');

/**
 * Map track
 *
 * @param {Track} track
 * @param {Object} settings
 * @return {Array}
 * @api private
 */

exports.track = function(track, settings) {
  var events = settings.eventToTypeMap || {};
  var type = lookup(events, track.event());
  if (type) {
    return {
      payload: reject({
        promoCode: track.proxy('properties.promoCode') || track.proxy('properties.promotionId'),
        valueCurrency: track.currency(),
        orderId: track.orderId(),
        val: track.revenue(),
        id: settings.token,
        track: "1",
        type: type
      }),
      cookie: 'kenshoo_id=' + track.proxy('context.referrer.id')
    }
  };
  return undefined;
};
