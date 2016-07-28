/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/uploads              ->  index
 * POST    /api/uploads              ->  create
 * GET     /api/uploads/:id          ->  show
 * PUT     /api/uploads/:id          ->  update
 * DELETE  /api/uploads/:id          ->  destroy
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

var _upload = require('./upload.model');

var _upload2 = _interopRequireDefault(_upload);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* AWS S3 */
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

_awsSdk2.default.config.credentials = _environment2.default.AWS;
//AWS S3 Object
var S3 = new _awsSdk2.default.S3();

// Gets a list of Uploads
function index(req, res) {
  S3.listObjects({ Bucket: 'pmgv-files' }, function (err, data) {
    if (err) {
      return respondWithResult(res)(err);
    }
    return respondWithResult(res)(data);
  });
}

// Gets a single Upload from the DB
function show(req, res) {
  var opt = {
    Bucket: 'pmgv-files',
    Key: req.params.id
  };

  S3.getObject(opt, function (err, data) {
    res.end(data.Body);
  });
}

// Creates a new Upload in the DB
function create(req, res) {

  // create an incoming form object
  var form = new _formidable2.default.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  //form.multiples = true;

  // store all uploads in the /uploads directory
  //form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function (field, file) {
    var s3req = {
      Body: _fs2.default.readFileSync(file.path),
      Bucket: 'pmgv-files',
      Key: file.name
    };

    S3.putObject(s3req, function (err, data) {
      //if(err) return respondWithResult(res)(err);

      //return respondWithResult(res)({ok:true});
    });
  });

  // log any errors that occur
  form.on('error', function (err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function () {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);
}

// Updates an existing Upload in the DB
function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _upload2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Upload from the DB
function destroy(req, res) {
  var conf = {
    Bucket: 'pmgv-files',
    Delete: {
      Objects: [{ Key: req.params.id }]
    }
  };
  S3.deleteObjects(conf, function (err, data) {
    if (err) return res.json(err);

    return res.json({ status: 'OK' });
  });
}
//# sourceMappingURL=upload.controller.js.map
