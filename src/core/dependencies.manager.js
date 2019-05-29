function dependencies (args) {
  var _dependencies

  const setup = () => {
    _dependencies = {}

    instantiateDependencies()
  }

  const instantiateDependencies = () => {
    let express = require('express')
    let server = express()

    _dependencies = {
      express: express,
      httpServer: server,
      path: require('path'),
      http: require('http').Server(server),
      bodyParser: require('body-parser'),
      jwt: require('jsonwebtoken'), // used to create, sign, and verify tokens
      bcrypt: require('bcryptjs'),
      aesjs: require('aes-js'),
      colors: require('colors/safe'),
      cors: require('cors'),
      config: require('config'),
      firebase: require('firebase-admin'),
      request: require('request'),
      compress: require('compression'),
      helmet: require('helmet'),
      cookieParser: require('cookie-parser'),
      crypto: require('crypto'),
      googleStorage: require('@google-cloud/storage'),
      moment: require('moment'),
      root: args.root
    }
    console.log(` ${_dependencies.colors.green(`${_dependencies.config.SERVER_NAME}:`)} Dependencies imported`)
  }

  const getDependencies = () => {
    return _dependencies
  }

  const addCustomDependency = (dependency, name) => {
    _dependencies[name] = dependency
  }

  setup()
  return {
    get: getDependencies,
    add: addCustomDependency
  }
}

module.exports = dependencies