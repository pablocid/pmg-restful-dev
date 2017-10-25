/**
 * Upload model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _upload = require('./upload.model');

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UploadEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
UploadEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _upload2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    UploadEvents.emit(event + ':' + doc._id, doc);
    UploadEvents.emit(event, doc);
  };
}

exports.default = UploadEvents;
//# sourceMappingURL=upload.events.js.map
