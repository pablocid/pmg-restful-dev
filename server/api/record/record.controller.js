/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/records              ->  index
 * POST    /api/records              ->  create
 * GET     /api/records/:id          ->  show
 * PUT     /api/records/:id          ->  update
 * DELETE  /api/records/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.stream = stream;
exports.index = index;
exports.aggregate = aggregate;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _record = require('./record.model');

var _record2 = _interopRequireDefault(_record);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schm = require('../schm/schm.controller');

var Stream = require('stream').Stream;

var EJSON = require('mongodb-extended-json');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function ArrayFormatter() {
    Stream.call(this);
    this.writable = true;
    this._done = false;
}

ArrayFormatter.prototype = Stream.prototype;

ArrayFormatter.prototype.write = function (doc) {
    if (!this._hasWritten) {
        this._hasWritten = true;

        // open an object literal / array string along with the doc
        this.emit('data', '[' + (0, _stringify2.default)(doc));
    } else {
        this.emit('data', ',' + (0, _stringify2.default)(doc));
    }

    return true;
};

ArrayFormatter.prototype.end = ArrayFormatter.prototype.destroy = function () {
    if (this._done) return;
    this._done = true;

    // close the object literal / array
    this.emit('data', ']');
    // done
    this.emit('end');
};

function stream(req, res) {
    var query = {};
    //filtrar por schm
    if (checkParam(req.query.schm, 'objectId')) {
        query.schm = req.query.schm;
        //console.log('schm')
    }

    if (checkParam(req.query.filter, 'filter')) {
        query["$and"] = [];

        var filter = JSON.parse(req.query.filter);
        for (var i = 0; i < filter.length; i++) {
            var p = { attributes: {} };
            p["attributes"]["$elemMatch"] = {};
            p["attributes"]["$elemMatch"]['id'] = filter[i].key;
            p["attributes"]["$elemMatch"][filter[i].datatype] = filter[i].value;
            query["$and"].push(p);
        }
    }

    _record2.default.find(query).cursor().pipe(new ArrayFormatter()).pipe(res);
}

function saveUpdates(updates) {
    return function (entity) {
        var updated = _lodash2.default.extend(entity, updates);
        return updated.save().then(function (updated) {
            return updated;
        });
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove().then(function () {
                res.status(204).end();
            });
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

function checkParam(param, dataType) {

    if (param === null) {
        return false;
    }
    var response = false;

    if (dataType === 'string') {
        if (typeof param === 'string' && param.length > 0) {
            response = true;
        }
    }

    if (dataType === 'number') {
        //console.log('chequea numero')
        if (typeof param === 'number') {
            response = true;
        }
        if (typeof param === 'string') {

            if (/^\d*$/.test(param)) {
                //console.log('es  numero')
                response = true;
            }
        }
    }

    if (dataType === 'objectId') {
        if (/^[0-9a-f]{24}$/i.test(param)) {
            response = true;
        }
    }

    //filtro de registros
    if (dataType === 'filter') {
        //checkeando si hay errores en el parseo a JSON
        try {
            var arr = JSON.parse(param);
            //check if is an Array and if is empty
            if (arr.length) {
                // verificando si los obj dentro del array tiene las propiedades key, datatype y value
                var isValid = true;
                for (var index = 0; index < arr.length; index++) {
                    if (arr[index].key === null || arr[index].value === null || arr[index].datatype === null) {
                        isValid = false;
                    }
                }
                response = isValid;
            }
        } catch (err) {
            response = false;
            console.log('invalid JSON');
        }
    }

    return response;
}

// Gets a list of Records
function index(req, res) {

    var items = 30;
    if (checkParam(req.query.items, 'number')) {
        items = parseInt(req.query.items);
    }
    var page = req.query.page || 1;
    // checking the query data types
    if (!checkParam(page, 'number') || page === "0") {
        return respondWithResult(res, 500)({ Error: 'El parámetro page no es válido' });
    }
    if (!checkParam(items, 'number')) {
        return respondWithResult(res, 500)({ Error: 'El parámetro items no es válido' });
    }

    var query = {};
    //filtrar por schm
    if (checkParam(req.query.schm, 'objectId')) {
        query.schm = req.query.schm;
        //console.log('schm')
    }
    // populate by attr objectId
    if (checkParam(req.query.populate, 'objectId')) {
        //query.populate = req.query.populate;
        //console.log('schm')
    }
    if (checkParam(req.query.filter, 'filter')) {
        query["$and"] = [];

        var filter = JSON.parse(req.query.filter);
        for (var i = 0; i < filter.length; i++) {
            var p = { attributes: {} };
            p["attributes"]["$elemMatch"] = {};
            p["attributes"]["$elemMatch"]['id'] = filter[i].key;
            p["attributes"]["$elemMatch"][filter[i].datatype] = filter[i].value;
            query["$and"].push(p);
        }
        //console.log(filter);
    }
    var qAllArr = [_record2.default.find(query).count().exec(), _record2.default.find(query).sort({ created: -1 }).skip(items * (page - 1)).limit(items)];
    if (query.schm) {
        qAllArr.push(Schm.fullSchm(query.schm));
    }
    _q2.default.all(qAllArr).spread(function (count, data, schema) {
        return {
            page: parseInt(page),
            pages: Math.ceil(count / items),
            length: data.length,
            totalLength: count,
            schema: schema,
            items: data
        };
    }).then(function (x) {
        if (checkParam(req.query.populate, 'objectId')) {
            return PopulateByAttr(x, req.query.populate);
        }
        return x;
    }).then(function (x) {
        if (x.schemaPopulated) {
            return Schm.fullSchm(x.schemaPopulated).then(function (s) {
                x.schemaPopulated = s;
                return x;
            });
        } else {
            return x;
        }
    }).then(function (x) {
        return respondWithResult(res)(x);
    }).fail(handleError(res));

    function PopulateByAttr(res, attrId) {
        res.itemsPopulated = res.items.map(function (x) {
            return x.attributes.filter(function (x) {
                return x.id === attrId;
            }).map(function (x) {
                return x.reference;
            });
        }).map(function (x) {
            if (x.length) {
                return x[0];
            } else {
                return null;
            }
        }).filter(function (x) {
            return x;
        });
        var popQuery = { "$or": [] };
        for (var q = 0; q < res.itemsPopulated.length; q++) {
            popQuery.$or.push({ _id: res.itemsPopulated[q] });
        }

        return _record2.default.find(popQuery).exec().then(function (x) {
            if (x.length) {
                res.schemaPopulated = x[0].schm;
            }
            res.itemsPopulated = x;
            return res;
        });
        //filtrar la referencia del 
    }
}
function aggregate(req, res) {
    // var query;
    // var AggregateParser = require("./services/aggregation.oidParser").AggParser;

    // var aP = new AggregateParser(req.query.query);
    // query = aP.parse();
    // console.log('inflate', EJSON.inflate(req.query.query));
    // console.log('deflate', EJSON.deflate(req.query.query));
    // console.log('parse', EJSON.parse(req.query.query))

    return _record2.default.aggregate(EJSON.parse(req.query.query)).exec().then(respondWithResult(res, 200)).catch(handleError(res));
}
// Gets a single Record from the DB
function show(req, res) {
    //si schm, key y datatype estan presentes, el id será tomado como el valor del atributo y no como _id
    var query;
    if (checkParam(req.query.schm, 'objectId') && checkParam(req.query.key, 'objectId') && checkParam(req.query.datatype, 'string')) {
        query = { schm: req.query.schm, attributes: {} };
        query.attributes["$elemMatch"] = {};
        query.attributes["$elemMatch"]["id"] = req.query.key;
        query.attributes["$elemMatch"][req.query.datatype] = req.params.id;
    } else {
        query = req.params.id;
    }

    return _q2.default.fcall(function (x) {
        return query;
    }).then(function (res) {
        if (typeof res === 'string') {
            return _record2.default.findById(res);
        } else {
            return _record2.default.find(query);
        }
    }).then(function (res) {
        if (Array.isArray(res)) {
            return Schm.fullSchm(req.query.schm).then(function (schm) {
                return {
                    length: res.length,
                    schema: schm,
                    record: res[0]
                };
            });
        } else {
            return Schm.fullSchm(res.schm).then(function (schm) {
                return {
                    schema: schm,
                    record: res
                };
            });
        }
    }).then(respondWithResult(res)).catch(handleError(res)).done(function (a) {
        console.log("DONE " + a);
    });
}

// Creates a new Record in the DB
function create(req, res) {
    return _record2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Updates an existing Record in the DB
function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return _record2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Record from the DB
function destroy(req, res) {
    return _record2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=record.controller.js.map
