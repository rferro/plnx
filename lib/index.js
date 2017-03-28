'use strict';

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _autobahn = require('autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _nonce = require('./nonce');

var _nonce2 = _interopRequireDefault(_nonce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbg = (0, _debug2.default)(_package2.default.name);

var _loop = function _loop(command) {
  var cfg = _config2.default.commands[command];

  exports[command] = function (options, cb) {
    if (arguments.length === 1) {
      cb = options;
      options = {};
    }

    var opt = _lodash2.default.cloneDeep(options);
    var ks = typeof opt.key === 'string' && typeof opt.secret === 'string';
    var is_private = cfg.type === 'private' || cfg.type === 'both' && ks;

    if (typeof cb !== 'function') {
      throw new Error(command + ': callback is not a function');
    }

    if (is_private && !ks) {
      return cb(command + ': options.key and options.secret are required');
    }

    var key = opt.key;
    var secret = opt.secret;

    delete opt.key;
    delete opt.secret;

    var missing = [];
    var params = cfg.type === 'both' ? cfg.params[is_private ? 'private' : 'public'] : cfg.params;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var param = _step.value;

        if (param.slice(-1) !== '?' && typeof opt[param] === 'undefined') {
          missing.push(param);
        }
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

    if (missing.length) {
      return cb(command + ': options ' + missing + ' are required');
    }

    var ropt = {
      json: true,
      headers: {
        'User-Agent': _package2.default.name + ' ' + _package2.default.version
      }
    };

    opt.command = command;

    if (is_private) {
      opt.nonce = (0, _nonce2.default)();
      ropt.method = 'POST';
      ropt.url = _config2.default.urls.private;
      ropt.form = opt;
      ropt.headers.Key = key;
      ropt.headers.Sign = _crypto2.default.createHmac('sha512', new Buffer(secret)).update(_querystring2.default.stringify(opt)).digest('hex');
    } else {
      ropt.method = 'GET';
      ropt.url = _config2.default.urls.public;
      ropt.qs = opt;
    }

    dbg({ key: key, secret: secret, opt: opt, is_private: is_private, ropt: ropt });

    (0, _request2.default)(ropt, function (err, res, data) {
      if (err) {
        cb(err);
      } else if (res.statusCode !== 200) {
        cb('statusCode ' + res.statusCode, data);
      } else if (data && data.error) {
        cb(data.error, data);
      } else {
        cb(null, data);
      }
    });
  };
};

for (var command in _config2.default.commands) {
  _loop(command);
}

// fix poloniex api docs
exports.return24Volume = exports.return24hVolume;

exports.push = function (onopen) {
  var conn = new _autobahn2.default.Connection({ url: _config2.default.urls.push, realm: 'realm1' });
  conn.onopen = onopen;
  conn.open();
};
