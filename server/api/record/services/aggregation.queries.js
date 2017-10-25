'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.espalderas = espalderas;
exports.EvalIndiv = EvalIndiv;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function espalderas(req) {
    var espaldera = req.query.espaldera;
    var hilera = req.query.hilera;

    var match = {
        "schm": _mongoose2.default.Types.ObjectId("57a4e02ec830e2bdff1a1608")
    };
    var project = {
        attributes: {
            $filter: {
                input: '$attributes',
                as: 'attr',
                cond: { "$eq": ["$$attr.id", "espaldera"] }
            }
        }
    };

    if (checkParam(req.query.espaldera, "number")) {
        espaldera = parseInt(espaldera);
        match["$and"] = [{ attributes: { $elemMatch: { id: "espaldera", number: espaldera } } }];
        project.attributes.$filter.cond.$eq[1] = "hilera";
    };

    if (checkParam(req.query.espaldera, "number") && checkParam(hilera, "number")) {
        hilera = parseInt(hilera);
        match["$and"].push({ attributes: { $elemMatch: { id: "hilera", number: hilera } } });
        project.attributes.$filter.cond.$eq[1] = "posicion";
    };

    var query = [{ "$match": match }, { $project: project }, { $unwind: "$attributes" }, { $group: { _id: "$attributes.number" } }, { $sort: { _id: 1 } }];

    return query;
}

function EvalIndiv(req) {
    var espaldera = req.query.espaldera;
    var hilera = req.query.hilera;
    var schm = req.query.schm;
    var attrLookup = "";

    var match = {
        "schm": _mongoose2.default.Types.ObjectId("57a4e02ec830e2bdff1a1608")
    };
    var project = {
        attributes: {
            $filter: {
                input: '$attributes',
                as: 'attr',
                cond: { "$eq": ["$$attr.id", "espaldera"] }
            }
        }
    };

    if (checkParam(req.query.espaldera, "number")) {
        espaldera = parseInt(espaldera);
        match["$and"] = [{ attributes: { $elemMatch: { id: "espaldera", number: espaldera } } }];
        project.attributes.$filter.cond.$eq[1] = "hilera";
    };

    if (checkParam(req.query.espaldera, "number") && checkParam(hilera, "number")) {
        hilera = parseInt(hilera);
        match["$and"].push({ attributes: { $elemMatch: { id: "hilera", number: hilera } } });
        project.attributes.$filter.cond.$eq[1] = "posicion";
    };

    var query = [{ "$match": match }, { $project: project }, { $unwind: "$attributes" }, { $group: { _id: "$attributes.number" } }, { $sort: { _id: 1 } }];

    return query;
}
//# sourceMappingURL=aggregation.queries.js.map
