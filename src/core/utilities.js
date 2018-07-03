function utilities (dependencies) {
  const _crypto = dependencies.crypto
  /// Find an object dynamically by dot style
  /// E.g.
  /// var objExample = {employee: { firstname: "camilo", job:{name:"developer"}}}
  /// searchDotStyle(objExample, 'employee.job.name')
  const searchDotStyle = (obj, query) => {
    return query.split('.').reduce((key, val) => key[val], obj)
  }

  const idGenerator = (length, prefix) => {
    // Generate 256 random bytes and converted to hex to prevent failures on unscaped chars
    let buffer = _crypto.randomBytes(256)
    let randomToken = buffer.toString('hex')
    // Generating of token
    return `${prefix || 'seed-'}${randomToken.slice(0, length)}`
  }

  const propertyIsValid = function (property) {
    if (property) {
      if (property.success === true) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const throwError = function (message) {
    if (message) {
      return { success: false, message: message, result: null }
    } else {
      return { success: false, message: 'Something was wrong while you make this action', result: null }
    }
  }

  const throwSuccess = function (data, message) {
    if (message) {
      return {
        success: true,
        message: message,
        result: data
      }
    } else {
      return {
        success: true,
        message: 'Operation completed successfully',
        result: data
      }
    }
  }

  const badRequestView = function (req, res) {
    res.render('maintenance/maintenance.view.jsx', null)
  }

  const cleanObjectData = rawObj => {
    if (rawObj && rawObj.formatted) {
      return rawObj.formatted
    } else {
      return null
    }
  }

  // Search an object in a simple array
  const findObject = (query, _array) => {
    return _array.find(function (element, index) {
      return element === query
    })
  }

  // Search an item by an object key
  const findObjectByKey = (query, key, _array) => {
    return _array.find(function (element, index) {
      return element[key] === query
    })
  }

  const findDeepObjectByKey = (query, key, _array) => {
    return _array.find(function (element, index) {
      let deepObject = searchDotStyle(element, key)
      return deepObject === query
    })
  }

  // Return index otherwise -1 is returned
  const findIndexByKey = (query, key, _array) => {
    return _array.findIndex(function (element, index) {
      return element[key] === query
    })
  }

  // Return index otherwise -1 is returned
  const findIndex = (query, _array) => {
    return _array.findIndex(function (element, index) {
      return element === query
    })
  }

  const findAndRemove = (query, _array) => {
    let index = _array.findIndex(function (element, index) {
      return element === query
    })

    if (index > -1) {
      _array.splice(index, 1)
    }
    return index
  }

  const findAndRemoveByKey = (query, key, _array) => {
    let index = _array.findIndex(function (element, index) {
      return element[key] === query
    })

    if (index > -1) {
      _array.splice(index, 1)
    }
    return index
  }

  return {
    searchers: {
      object: {
        searchDotStyle: searchDotStyle,
        findAndRemove: findAndRemoveByKey,
        findIndex: findIndexByKey,
        findObject: findObjectByKey,
        findDeepObject: findDeepObjectByKey
      },
      array: {
        findAndRemove: findAndRemove,
        findIndex: findIndex,
        findObject: findObject
      }
    },
    idGenerator: idGenerator,
    response: {
      success: throwSuccess,
      error: throwError,
      badRequestView: badRequestView,
      isValid: propertyIsValid,
      clean: cleanObjectData
    }
  }
}

module.exports = utilities
