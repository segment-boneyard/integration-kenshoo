/**
 * Created by moshee
 * on: 26/04/16.
 */

var facade = require('segmentio-facade');
var extend = require('extend');
var uid = require('uid');

var userId1  = uid();
var email    = 'testing-' + userId1 + '@segment.io';

exports.track = function (context) {
    context = extend({
        userId     : userId1,
        event      : 'Baked a cake',
        properties : {
            revenue : 19.95,
            date : (new Date()).toISOString()
        },
        channel    : 'server',
        timestamp  : new Date(),
        context : {
            ip : '12.212.12.49',
            userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'
        }
    }, context);
    return new facade.Track(context);
};


exports.track.bare = function (context) {
    context = extend({
        userId  : 'aaa',
        event   : 'Bear tracks',
        channel : 'server'
    }, context);
    return new facade.Track(context);
};
