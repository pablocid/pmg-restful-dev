/**
 * Schm model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _schm = require('./schm.model');

var _schm2 = _interopRequireDefault(_schm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SchmEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
SchmEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _schm2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    SchmEvents.emit(event + ':' + doc._id, doc);
    SchmEvents.emit(event, doc);
  };
}

exports.default = SchmEvents;
//# sourceMappingURL=schm.events.js.map
