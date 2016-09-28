"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

exports.AggParser = AggParser;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AggParser(query) {
	try {
		this.query = JSON.parse(query);
	} catch (e) {
		throw new Error("Error en el Parseo de la query");
	}
}

AggParser.prototype.parse = function () {
	for (var i = 0; i < this.query.length; i++) {
		for (var key in this.query[i]) {
			this.query[i][key] = this.ssqParser(this.query[i][key]);
		}
	};
	return this.query;
};

AggParser.prototype.applyChange = function (oid) {
	if (!oid.hasOwnProperty("$oid")) {
		return oid;
	}
	return _mongoose2.default.Types.ObjectId(oid.$oid);
};

AggParser.prototype.ssqParser = function (q) {
	for (var i in q) {
		if ((0, _typeof3.default)(q[i]) === "object" && !Array.isArray(q[i])) {
			if (q[i].hasOwnProperty("$oid")) {
				q[i] = this.applyChange(q[i]);
				return q;
			}
			for (var w in q[i]) {
				q[i][w] = this.ssqParser(q[i][w]);
			}
		}
		if (Array.isArray(q[i])) {
			for (var e = 0; e < q[i].length; e++) {
				q[i][e] = this.ssqParser(q[i][e]);
			};
		}
	}
	return q;
};
//# sourceMappingURL=aggregation.oidParser.js.map
