/**
 * Created by moshee on 26/04/16.
 */
var Test = require('segmentio-integration-tester');
var helpers = require('./helpers');
var assert = require('assert');
var should = require('should');
var K = require('..');
var mapper = require('../lib/mapper');
var facade = require('segmentio-facade');

describe("Kenshoo / SegmentIO integration", function() {
    var settings;
    var k;

    beforeEach(function(){
        settings = {
            token: 'token',
            subdomain: '4075'
        };
        k = new K(settings);
        test = Test(k, __dirname);
    });

    it('should have the correct settings', function(){
        test
            .name('Kenshoo')
            .channels(['server', 'mobile'])
            .ensure('settings.token')
            .ensure('settings.subdomain')
    });

    describe('.validate()', function(){
        var msg;

        beforeEach(function(){
            msg = {
                event: 'some-event',
                context: {
                    referrer: {
                        id: 'some-id',
                        type: 'kenshoo'
                    }
                },
                integrations: {
                    Kenshoo: {
                        cookie: 'cookieval',
                        type: 'testConv'
                    }
                }
            };
        });

        it('should be invalid if `referrer.id` is missing', function(){
            delete msg.context.referrer.id;
            test.invalid(msg, settings);
        });

        it('should be invalid if `.referrer.type` is not "kenshoo"', function(){
            msg.context.referrer.type = 'foo';
            test.invalid(msg, settings);
        });

        it('should be valid if settings are complete', function(){
            test.valid(msg, settings);
        });
    });

    describe('verify event mapping to kenshoo payload', function() {
        var options = {};
        it('should map basic track with values', function() {
            var json = test.fixture('track-basic');
            var mapped = mapper.track(toMessage(json.input), settings, options);
            assert.deepEqual(mapped.payload, json.output);

        });

        it('should map basic track with no values and assign defaults', function() {
            var json = test.fixture('track-basic-no-defaults');
            var mapped = mapper.track(toMessage(json.input), settings, options);
            assert.deepEqual(mapped.payload, json.output);

        });

    });

    function toMessage(msg){
        var msg = msg || {};
        return new facade.Track(msg);
    }

    describe('.track()', function(){
        var track;
        beforeEach(function() {
            track = helpers.track.bare({
                event: 'some-event',
                context: {
                    referrer: {
                        id: 'SAhCht3bQKPGd-z7ZvtYWW-i',
                        type: 'kenshoo'
                    },
                    integrations: {
                        Kenshoo: {
                            cookie: 'cookieval',
                            type: 'testConv'
                        }
                    }
                },

            });
        });

        it('should track an event successfully', function(done){
            test
                .track(track, settings)
                .expects(200, done);
        });

        it('should match the event name case-insensitively', function(done){
            var trackData = track.json();
            trackData.event = track.event().toUpperCase();
            track = helpers.track(trackData);
            test
                .track(track, settings)
                .expects(200, done);
        });
    });
});
