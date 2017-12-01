
import pkg from '../package'
import crypto from 'crypto'
import querystring from 'querystring'

import { Buffer } from 'safe-buffer'
import debug from 'debug'
import request from 'request'
import autobahn from 'autobahn'
import _ from 'lodash'

import config from './config'
import nonce from './nonce'

let dbg = debug(pkg.name)

for (let command in config.commands) {
  let cfg = config.commands[command]

  exports[command] = function (options, cb) {
    if (typeof options === 'function') {
      cb = options
      options = {}
    } else if (!options) {
      options = {}
    }

    let opt = _.cloneDeep(options)
    let ks = typeof opt.key === 'string' && typeof opt.secret === 'string'
    let isPrivate = cfg.type === 'private' || (cfg.type === 'both' && ks)

    if (typeof cb !== 'function') {
      return new Promise((resolve, reject) => {
        exports[command](options, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      })
    }

    if (isPrivate && !ks) {
      return cb(new Error(`${command}: options.key and options.secret are required`))
    }

    let key = opt.key
    let secret = opt.secret

    delete opt.key
    delete opt.secret

    let missing = []
    let params = cfg.type === 'both'
      ? cfg.params[isPrivate ? 'private' : 'public']
      : cfg.params

    for (let param of params) {
      if (param.slice(-1) !== '?' && typeof opt[param] === 'undefined') {
        missing.push(param)
      }
    }

    if (missing.length) {
      return cb(new Error(`${command}: options ${missing} are required`))
    }

    let ropt = {
      json: true,
      headers: {
        'User-Agent': `${pkg.name} ${pkg.version}`
      }
    }

    opt.command = command

    if (isPrivate) {
      opt.nonce = nonce()
      ropt.method = 'POST'
      ropt.url = config.urls.private
      ropt.form = opt
      ropt.headers.Key = key
      ropt.headers.Sign = crypto
        .createHmac('sha512', Buffer.from(secret))
        .update(querystring.stringify(opt))
        .digest('hex')
    } else {
      ropt.method = 'GET'
      ropt.url = config.urls.public
      ropt.qs = opt
    }

    dbg({ key, secret, opt, isPrivate, ropt })

    request(ropt, (err, res, data) => {
      cb(err, data, res);
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
