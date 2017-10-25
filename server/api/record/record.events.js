/**
 * Record model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _record = require('./record.model');

var _record2 = _interopRequireDefault(_record);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RecordEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
RecordEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _record2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    RecordEvents.emit(event + ':' + doc._id, doc);
    RecordEvents.emit(event, doc);
  };
}

exports.default = RecordEvents;
//# sourceMappingURL=record.events.js.map
