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

var MsgErrorSchema = new Schema({
  id: Schema.Types.Number,
  value: Schema.Types.String
}, { _id: false });

var InputsSchema = new Schema({
  id: Schema.Types.String,
  dataType: Schema.Types.String,
  name: Schema.Types.String,
  inputSchema: Schema.Types.ObjectId,
  required: Schema.Types.Boolean,
  reqValid: Schema.Types.Boolean,
  validateType: Schema.Types.String,
  regex: Schema.Types.String,
  msgError: [MsgErrorSchema],
  label: Schema.Types.String
}, { _id: false });

var QuerySchema = new Schema({
  id: Schema.Types.String,
  schm: Schema.Types.String,
  filter: Schema.Types.String,
  populate: [Schema.Types.String]
}, { _id: false });

var SchmSchema = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  label: Schema.Types.String,
  query: [QuerySchema],
  created: Schema.Types.Date,
  updated: [updatedSchema],
  inputs: [InputsSchema],
  active: Boolean
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
