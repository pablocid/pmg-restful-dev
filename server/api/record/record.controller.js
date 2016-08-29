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
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _record = require('./record.model');

var _record2 = _interopRequireDefault(_record);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schm = require('../schm/schm.controller');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _lodash2.default.merge(entity, updates);
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

  var items = req.query.items || 30;
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
  var qAllArr = [_record2.default.find(query).count().exec(), _record2.default.find(query).skip(items * (page - 1)).limit(items)];
  if (query.schm) {
    qAllArr.push(Schm.fullSchm(query.schm));
  }

  _q2.default.all(qAllArr).spread(function (count, data, schema) {
    respondWithResult(res)({
      page: parseInt(page),
      pages: Math.ceil(count / items),
      length: data.length,
      totalLength: count,
      schema: schema,
      items: data
    });
  }).fail(handleError(res));
}

// Gets a single Record from the DB
function show(req, res) {
  //check if id is objectId
  var query;
  if (!checkParam(req.params.id, 'objectId') && checkParam(req.query.schm, 'objectId') && checkParam(req.query.key, 'objectId') && checkParam(req.query.datatype, 'string')) {
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
