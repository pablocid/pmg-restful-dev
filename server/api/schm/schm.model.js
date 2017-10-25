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
    listOfObj: Schema.Types.Mixed,
    reference: Schema.Types.ObjectId
}, { _id: false });

var SchmSchema = new Schema({
    type: Schema.Types.String,
    name: Schema.Types.String,
    schm: Schema.Types.ObjectId,
    created: { type: Schema.Types.Date, required: true, default: Date.now },
    updated: [updatedSchema],
    attributes: [attrsSchema]
});

exports.default = _mongoose2.default.model('Schm', SchmSchema);

/*
    inputs:[
        {
            id:"cantidad",
            dataType:"",
            name:"",
            inputSchema:"KJHJHK7657657",
            required:true,
            validate:true,
            validateType:"number",
            label:"Ingresa la cantidad",
            msgError:[
                {id:1, value:"Error al ingresar la cantidad bla bla"}
            ],
            regex:"\\d*2"
        }
    ]
*/
//# sourceMappingURL=schm.model.js.map
