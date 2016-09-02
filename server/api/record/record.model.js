'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var updatedSchema = new Schema({
	user: Schema.Types.ObjectId,
	date: Schema.Types.Date
}, { _id: false });

var attrsSchema = new Schema({
	id: Schema.Types.String,
	number: Schema.Types.Number,
	boolean: Schema.Types.Boolean,
	string: Schema.Types.String,
	list: [Schema.Types.String],
	date: Schema.Types.Date,
	value: Schema.Types.Mixed,
	reference: Schema.Types.ObjectId
}, { _id: false });

var RecordSchema = new Schema({
	schm: Schema.Types.ObjectId,
	created: { type: Schema.Types.Date, required: true, default: Date.now },
	updated: [updatedSchema],
	attributes: [attrsSchema]
});

exports.default = _mongoose2.default.model('Record', RecordSchema);
//# sourceMappingURL=record.model.js.map
