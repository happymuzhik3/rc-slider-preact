'use strict';

exports.__esModule = true;
exports.default = addEventListenerWrap;

var _addDomEventListener = require('add-dom-event-listener');

var _addDomEventListener2 = _interopRequireDefault(_addDomEventListener);

var _preactCompat = require('preact-compat');

var _preactCompat2 = _interopRequireDefault(_preactCompat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addEventListenerWrap(target, eventType, cb) {
  /* eslint camelcase: 2 */
  var callback = _preactCompat2.default.unstable_batchedUpdates ? function run(e) {
    _preactCompat2.default.unstable_batchedUpdates(cb, e);
  } : cb;
  return (0, _addDomEventListener2.default)(target, eventType, callback);
}