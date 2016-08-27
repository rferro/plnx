
import pkg from '../package'
import crypto from 'crypto'
import querystring from 'querystring'

import debug from 'debug'
import request from 'request'
import autobahn from 'autobahn'
import _ from 'lodash'

import config from './config'
import nonce from './nonce'

let dbg = debug(pkg.name)

for (let command in config.commands) {
  let cfg = config.commands[command]

  exports[command] = function(options, cb) {
    if (arguments.length === 1) {
      cb = options
      options = {}
    }

    let opt = _.cloneDeep(options)
    let ks = typeof opt.key === 'string' && typeof opt.secret === 'string'
    let is_private = cfg.type === 'private' || (cfg.type === 'both' && ks)

    if (typeof cb !== 'function') {
      throw new Error(`${command}: callback is not a function`)
    }

    if (is_private && !ks) {
      return cb(`${command}: options.key and options.secret are required`)
    }

    let key = opt.key
    let secret = opt.secret

    delete opt.key
    delete opt.secret

    let missing = []
    let params = cfg.type === 'both'
      ? cfg.params[is_private ? 'private' : 'public']
      : cfg.params

    for (let param of params) {
      if (param.slice(-1) !== '?' && typeof opt[param] === 'undefined') {
        missing.push(param)
      }
    }

    if (missing.length) {
      return cb(`${command}: options ${missing} are required`)
    }

    let ropt = {
      json: true,
      headers: {
        'User-Agent': `${pkg.name} ${pkg.version}`
      }
    }

    opt.command = command

    if (is_private) {
      opt.nonce = nonce()
      ropt.method = 'POST'
      ropt.url = config.urls.private
      ropt.form = opt
      ropt.headers.Key = key
      ropt.headers.Sign = crypto
        .createHmac('sha512', new Buffer(secret))
        .update(querystring.stringify(opt))
        .digest('hex')
    } else {
      ropt.method = 'GET'
      ropt.url = config.urls.public
      ropt.qs = opt
    }

    dbg({ key, secret, opt, is_private, ropt })

    request(ropt, (err, res, data) => {
      if (err) {
        cb(err)
      } else if (res.statusCode !== 200) {
        cb(`statusCode ${res.statusCode}`)
      } else if (data && data.error) {
        cb(data.error)
      } else {
        cb(null, data)
      }
    })
  }
}

// fix poloniex api docs
exports.return24Volume = exports.return24hVolume

exports.push = (onopen) => {
  let conn = new autobahn.Connection({ url: config.urls.push, realm: 'realm1' })
  conn.onopen = onopen
  conn.open()
}
