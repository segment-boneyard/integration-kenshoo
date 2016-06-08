
/**
 * Map track
 *
 * @param {Track} track
 * @param {Object} settings
 * @return {Array}
 * @api private
 */

exports.track = function(track, settings){
  var options = track.options(this.name) || {};
  var convType = options.type || 'conv';
  var userCookie = options.cookie || '';
  var payload = {};
  payload.track = "1";
  payload.id = settings.token;
  payload.val = track.revenue() || 0.0;
  payload.orderId = track.orderId() || '';
  payload.promoCode = track.proxy('properties.promoCode') || track.proxy('properties.promotionId') || '';
  payload.valueCurrency = track.currency() || 'USD';
  payload.type = convType;
  return { payload: payload, cookie: userCookie };
};
