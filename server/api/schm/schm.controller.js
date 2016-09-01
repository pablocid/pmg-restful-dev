/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/schms              ->  index
 * POST    /api/schms              ->  create
 * GET     /api/schms/:id          ->  show
 * PUT     /api/schms/:id          ->  update
 * DELETE  /api/schms/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.fullSchm = fullSchm;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _schm = require('./schm.model');

var _schm2 = _interopRequireDefault(_schm);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// Gets a list of Schms
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
  if (checkParam(req.query.type, 'string')) {
    query.type = req.query.type;
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

  _q2.default.all([_schm2.default.find(query).count().exec(), _schm2.default.find(query).skip(items * (page - 1)).limit(items)]).spread(function (count, data) {
    respondWithResult(res)({
      page: parseInt(page),
      pages: Math.ceil(count / items),
      length: data.length,
      totalLength: count,
      items: data
    });
  }).fail(handleError(res));
  /*
  return Schm.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
  */
}

// function helper
var findValueByVarHelper = function findValueByVarHelper(array, key, value, target) {
  var self = this;
  if (!Array.isArray(array)) {
    return null;
  }

  var index = array.map(function (x) {
    return x[key];
  }).indexOf(value);

  if (index !== -1) {
    if (target === undefined) {
      return array[index];
    } else {
      return array[index][target];
    }
  } else {
    return null;
  }
};
function fullSchm(schmId) {
  console.log("El schema id es: " + schmId);
  var firstCall = function firstCall(s) {
    var query = { type: "schmAttrInputConf", attributes: { "$elemMatch": { id: "schema", reference: schmId } } };
    _schm2.default.find({ type: "schmAttrInputConf", attributes: { "$elemMatch": { id: "schema", reference: "57c42f2fc8307cd5b82f4484" } } }).exec().then(function (f) {
      console.log("Resultado de la query es: ");
      console.log(f);
    });
    return _q2.default.all([_schm2.default.find(query).exec(), _schm2.default.findById(schmId)]).spread(function (schmAttrInputConf, schm) {
      console.log("El schm id es : " + schm._id + " y la cantidad de schmAttrInputConf es: " + schmAttrInputConf.length);
      var index = schm.attributes.map(function (x) {
        return x.id;
      }).indexOf("attributes");
      var AttrList = [];
      if (index !== -1) {
        AttrList = schm.attributes[index].list;
      }
      return {
        schema: schm,
        schmAttrInputConf: schmAttrInputConf,
        list: AttrList
      };
    });
  };
  var secondCall = function secondCall(d) {
    var query = { "$or": [] };
    for (var i = 0; i < d.list.length; i++) {
      query["$or"].push({ type: "attrInputConf", attributes: { "$elemMatch": { id: "attribute", reference: d.list[i] } } });
    }
    return _schm2.default.find(query).then(function (s) {
      d.attrInputConf = s;
      return d;
    });
  };
  var thirdCall = function thirdCall(d) {
    var query = { "$or": [] };
    for (var i = 0; i < d.list.length; i++) {
      query["$or"].push({ _id: d.list[i] });
    }
    return _schm2.default.find(query).then(function (s) {
      d.attributes = s;
      return d;
    });
  };
  var forthCall = function forthCall(d) {
    var inputRefs = d.attributes.map(function (x) {
      return findValueByVarHelper(x.attributes, "id", "input", "reference");
    });
    //console.log(inputRefs)
    var queryInputs = { "$or": [] };
    for (var i = 0; i < inputRefs.length; i++) {
      queryInputs["$or"].push({ _id: inputRefs[i] });
    }
    //console.log(queryInputs);
    return _schm2.default.find(queryInputs).then(function (s) {
      d.inputs = s;
      return d;
    });
  };

  var concatCall = function concatCall(d) {
    var concat = [d.schema];
    concat = concat.concat(d.attributes);
    concat = concat.concat(d.schmAttrInputConf);
    concat = concat.concat(d.attrInputConf);
    concat = concat.concat(d.inputs);
    return concat;
  };

  return _q2.default.fcall(function (x) {
    return true;
  }).then(firstCall).then(secondCall).then(thirdCall).then(forthCall).then(concatCall);
}

// Gets a single Schm from the DB
function show(req, res) {
  if (req.query.record_only === "true") {
    return _schm2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
  }

  fullSchm(req.params.id).then(function (d) {
    respondWithResult(res)(d);
  }).fail(handleError(res));
}

// Creates a new Schm in the DB
function create(req, res) {
  return _schm2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Updates an existing Schm in the DB
function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _schm2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Schm from the DB
function destroy(req, res) {
  return _schm2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}

/*
"_id" : ObjectId("57a4e152c830e2bdff1a160a"), 
    "name" : "cruzamientos", 



    "_id" : ObjectId("57a4e3cac830e2bdff1a160c"), 
    "name" : "parentales", 


    "_id" : ObjectId("57a4e02ec830e2bdff1a1608"), 
    "name" : "individuos", 


  "_id" : ObjectId("57a3a35bc830e2bdff1a1606"), 
      "name" : "fenotipado", ?????
*/
//# sourceMappingURL=schm.controller.js.map
