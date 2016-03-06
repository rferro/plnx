"use strict";

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _nonce = require("nonce");

var _nonce2 = _interopRequireDefault(_nonce);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbg = (0, _debug2.default)("plnx");

var _loop = function _loop(command) {
  var cfg = _config2.default.commands[command];

  exports[command] = function (opt, cb) {
    var ks = typeof opt.key === "string" && typeof opt.secret === "string";
    var is_private = cfg.type === "private" || cfg.type === "both" && ks;

    if (arguments.length === 1) {
      cb = opt;
      opt = {};
    }

    if (typeof cb !== "function") throw new Error(command + ": callback is not a function");

    if (is_private && !ks) return cb(command + ": opt.key and opt.secret are required");

    var key = opt.key;
    var secret = opt.secret;

    delete opt.key;
    delete opt.secret;

    var missing = [];

    if (cfg.type === "both") cfg.params = cfg.params[is_private ? "private" : "public"];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = cfg.params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var param = _step.value;

        if (param.slice(-1) !== "?" && typeof opt[param] === "undefined") missing.push(param);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (missing.length) return cb(command + ": " + missing + " required");

    var ropt = { json: true };

    opt["command"] = command;
    opt["nonce"] = (0, _nonce2.default)()();

    if (is_private) {
      ropt["method"] = "POST";
      ropt["url"] = _config2.default.url.private;
      ropt["form"] = opt;
      ropt["headers"] = {
        Key: key,
        Sign: _crypto2.default.createHmac('sha512', new Buffer(secret)).update(_querystring2.default.stringify(opt)).digest('hex')
      };
    } else {
      ropt["method"] = "GET";
      ropt["url"] = _config2.default.url.public;
      ropt["qs"] = opt;
    }

    (0, _request2.default)(ropt, function (err, res, data) {
      if (!err && data && data.error) err = data.error;

      if (err) return cb(err);

      cb(null, data);
    });

    dbg({ key: key, secret: secret, opt: opt, is_private: is_private });
  };
};

for (var command in _config2.default.commands) {
  _loop(command);
}

// fix poloniex api docs
exports.return24Volume = exports.return24hVolume;