/**
 *
 * Parseable
 *
 **/

var defaultValues = {
  _limit: 200,
  set limit(value){
    this._limit = value;
  },
  get limit(){
    return this._limit;
  }
}

var syncOperationParser = function(params){
  var _increment = function(field,operation){
    var value = {};
    value[field] = operation['amount'];
    return [null,{$inc:value}];
  }

  var _add = function(field,operation){
    var value = {};
    value[field] = operation['objects'];
    return [null,{$pushAll:value}];
  }

  var _addUnique = function(field,operation){
    var value = {};
    value[field] = {$each:operation['objects']};
    return [null,{$addToSet:value}];
  }

  var _remove = function(field,operation){
    var value = {};
    value[field] = operation['object'];
    return [null,{$pull:value}];
  }

  var _removeAll = function(field,operation){
    var value = {};
    value[field] = operation['objects'];
    return [null,{$pullAll:value}];
  }

  var _delete = function(field,operation){
    var value = {};
    value[field] = '';
    return [null,{$unset:value}];
  }

  var _set = function(field){
    return [null,{$set:field}];
  }

  // parse string into object
  if(typeof(params) !== 'object'){
    try{
      params = JSON.parse(params);
    }catch(e){
      return ['SyntaxError', null];
    }
  }

  var field = Object.keys(params)[0];

  if(!field){
    return ['field is undefined', null];
  }

  var operation = params[field];

  if(typeof(operation) !== 'object'){
    try{
      operation = JSON.parse(operation);
    }catch(e){
      return _set(params);
    }
  }

  var _isOpration = util.isOperation(operation);
  if(_isOpration[1]){
    return [_isOpration[1],null];
  }

  if(!operation.hasOwnProperty('__op')) return _set(params);

  if(operation['__op'] === 'Increment'){
    return _increment(field,operation);
  }

  if(operation['__op'] === 'Add'){
    return _add(field,operation);
  }

  if(operation['__op'] === 'AddUnique'){
    return _addUnique(field,operation);
  }

  if(operation['__op'] === 'Remove'){
    return _remove(field,operation);
  }

  if(operation['__op'] === 'RemoveAll'){
    return _removeAll(field,operation);
  }

  if(operation['__op'] === 'Delete'){
    return _delete(field,operation);
  }

  return ['unknown operation: ' + operation['__op']];
}

var util = {
  IGNORE_OPERATION: 1,
  IGNORE_OPERATOR: 1 <<1,
  valuesContainMergeableObject: function(obj,filter){
    var _result = [false,null];
    for (var _key in obj){
      var _value = obj[_key];
      var _isMergeable = util.isMergeable(_value,filter);
      if(_isMergeable[1]){
        _result[1] = _isMergeable[1];
      }
      if(_isMergeable[0]){
        _result[0] = _isMergeable[0];
      }
    }
    return _result;
  },
  valuesContainObject: function(obj){
    for (var key in obj){
      var value = obj[key];
      if(typeof(value) === 'object' && ! (value instanceof Array) ){
        return [true,null];
      }
    }
    return [false,null];
  },
    //return result and error message
  isOperator : function(obj){
    var operators = ['$gt','$gte','$in','$lt','$lte','$ne','$nin','$or','$nor','$or','$not','$in','$nin','$exists','$type','$mod','$regex','$text','$where','$all','$elemMatch','$size','$geoWithin','$geoIntersects','$near','$nearSphere','$geometry','$maxDistance','$center','$centerSphere','$box','$polygon','$uniqueDocs','$options'];
    var operatorCount = 0;
    var notOperatorArray = [];
    var keyCount = 0;

    for(var key in obj){
      keyCount++;
      if(operators.indexOf(key) !== -1){
        operatorCount++;
      }else{
        notOperatorArray.push(key);
      }
    }

    if(operatorCount === keyCount){
      return [true, null];
    }
    if(notOperatorArray.length === keyCount){
      return [false, null];
    }else{
      return [false,'unknown operator: '+notOperatorArray.toString()];
    }
  },
  isOperation : function(obj){
    if(obj && obj.hasOwnProperty('__op')){
      if(obj['__op'] === 'Increment'){
        if(!obj.hasOwnProperty('amount')) return [false,'no property \'amount\': '+JSON.stringify(obj)];
        if(typeof(obj['amount']) !== 'number') return [false,'\'amount\' is not number: '+JSON.stringify(obj)];
        if(Object.getOwnPropertyNames(obj).length > 2){
          return [false,'syntax error:'+JSON.stringify(obj)];
        }
        return [true,null];
      }

      if(obj['__op'] === 'Add'){
        if(!obj.hasOwnProperty('objects')) return [false,'no property \'objects\': '+JSON.stringify(obj)];
        if(! (obj['objects'] instanceof Array )) return [false,'\'objects\' is not Array: '+JSON.stringify(obj)];
        if(Object.getOwnPropertyNames(obj).length > 2){
          return [false,'syntax error:'+JSON.stringify(obj)];
        }
        return [true,null];
      }

      if(obj['__op'] === 'AddUnique'){
        if(!obj.hasOwnProperty('objects')) return [false,'no property \'objects\': '+JSON.stringify(obj)];
        if(! (obj['objects'] instanceof Array )) return [false,'\'objects\' is not Array: '+JSON.stringify(obj)];
        if(Object.getOwnPropertyNames(obj).length > 2){
          return [false,'syntax error:'+JSON.stringify(obj)];
        }
        return [true,null];
      }

      if(obj['__op'] === 'Remove'){
        if(!obj.hasOwnProperty('object')) return [false,'no property \'object\': '+JSON.stringify(obj)];
        if(! (obj['object'] instanceof Object )) return [false,'\'object\' is not Object: '+JSON.stringify(obj)];
        if((obj['object'] instanceof Array )) return [false,'\'object\' is not Object: [' + obj['object'] +']'];
        
        if(Object.getOwnPropertyNames(obj).length > 2){
          return [false,'syntax error:'+JSON.stringify(obj)];
        }
        return [true,null];
      }

      if(obj['__op'] === 'RemoveAll'){
        if(!obj.hasOwnProperty('objects')) return [false,'no property \'objects\': '+JSON.stringify(obj)];
        if(! (obj['objects'] instanceof Array )) return [false,'\'objects\' is not Array: '+JSON.stringify(obj)];
        if(Object.getOwnPropertyNames(obj).length > 2){
          return [false,'syntax error:'+JSON.stringify(obj)];
        }
        return [true,null];
      }

      if(obj['__op'] === 'Delete'){
        if(Object.getOwnPropertyNames(obj).length > 1){
          return [false,'syntax error:'+JSON.stringify(obj)];
        }
        return [true,null];
      }

      return [false,'unknown operation:'+JSON.stringify(obj)];
    }else{
      return [false,null];
    }
  },
  isMergeable: function(obj,filter){
    var _isMergeable =[false,null];
    var _isObject =(function(v){
      if(v && typeof(v) === 'object' && Object.getOwnPropertyNames(v).length===0){
        return  [false,'contain empty object: '+JSON.stringify(v)];
      }
      return [typeof(v) === 'object' && ! (v instanceof Array), null];
    })(obj);

    var _isOperation = [false,null];
    var _isOperator = [false,null];

    if(_isObject[1]){
      return [false,_isObject[1]];
    }

    if(filter & util.IGNORE_OPERATION){
      _isOperation = util.isOperation(obj);
      if(_isOperation[1]){
        return [false,_isOperation[1]];
      }
    }

    if(filter & util.IGNORE_OPERATOR){
      _isOperator= util.isOperator(obj);
      if(_isOperator[1]){
        return [false,_isOperator[1]];
      }
    }

    if(_isOperation[0] || _isOperator[0]){
      _isMergeable = [false,null];
    }else{
      if(_isObject[0]){
        _isMergeable = [true,null];
      }
    }

    return _isMergeable;
  },
  mergeSub : function(obj,filter){

    var output = {};
    for (var key1 in obj){
      if(!obj.hasOwnProperty(key1)) continue;

      var value1 = obj[key1];

      if(util.isMergeable(value1,filter)[0]){
        for(var key2 in value1){
          var value2 = value1[key2];
          var newValue = key1+'.'+key2;
          output[newValue] = value2;
        }
      }else{
        output[key1] = value1;
      }
    }
    return output;
  }
}

var parseDocument = function(params,callback,filter){

  if(typeof(params) !== 'object'){
    try{
      params = JSON.parse(params);
      if(typeof(params) !== 'object'){
        return callback('SyntaxError');
      }
    }catch(e){
      return callback('SyntaxError');
    }
  }

  var result = params;
  var i = 0;
  var containMergeableObject = util.valuesContainMergeableObject(result,filter);

  if(containMergeableObject[1]){
    return callback(containMergeableObject[1]);
  }

  while(containMergeableObject[0]){

    result = util.mergeSub(result,filter);

    if(i++ >5){
      return callback('infinite loop');
    }

    containMergeableObject = util.valuesContainMergeableObject(result,filter);

    if(containMergeableObject[1]){
      return callback(containMergeableObject[1]);
    }
  }

  return callback(null,result);
}

// Where Parser : for params in find
var whereParser = function(params,callback){
  return parseDocument(params,callback,util.IGNORE_OPERATOR);
}

var sortParser = function(params,callback){
  if(typeof(params) !== 'object'){
    try{
      params = JSON.parse(params);
      if(typeof(params) !== 'object'){
        return callback('SyntaxError');
      }
    }catch(e){
      // If not an object and failed to parse, just continue with the sort as the raw value
      return callback(null, params);
    }
  }
  
  var result = params;
  var i = 0;

  while(util.valuesContainObject(result)[0]){
    result = util.mergeSub(result);

    if(i++ >5){
      return callback('infinite loop');
    }
  }

  for (var key in result){
    if(result[key] === '-1'){
      result[key] = -1;
    }
    if(result[key] === '1'){
      result[key] = 1;
    }
    if(result[key] !== -1 && result[key] !== 1){
      return callback('bad sort specification: ' + result[key]);
    }
  }

  return callback(null,result);
}

// The Limit Parser: check value
var limitParser = function(param,callback){
  var MAX_VALUE = 2147483648;
  var MIN_VALUE = -2147483648;

  var output = Number(param);

  if(output<-2147483648 || output>2147483648){
    return callback('value out of range');
  }

  if(isNaN(output)){
    return callback('SyntaxError');
  }

  return callback(null,output);
}

var skipParser = limitParser;

var keysParser = function(param,callback){

  if((typeof param) != 'string') return callback('SyntaxError: keys is not string');

  var output = {};
  var keys = param.split(',');
  for(var i in keys){
    var key = keys[i];
    if(key.length >1){
      if(key[0] === '-'){
        output[key.substring(1)] = 0;
      }else{
        output[key] = 1;
      }
    }else{
       if(key.length === 0) continue;

       output[key] = 1;
    }
  }

  return callback(null,output);
}

var operationParser = function(params,callback){

  parseDocument(params,function(err,result){

    if(err) return callback(err);

    var output = {};

    for (var _operationKey in result){

      var _operation = {};
      _operation[_operationKey] = result[_operationKey];
      var _mongoOperation = syncOperationParser(_operation);

      if(_mongoOperation[0]){
        return callback(_mongoOperation[0]);
      }else{
        for(var _operator in _mongoOperation[1]){

          //_param : {'a.b':{c:123}}
          var _param = _mongoOperation[1][_operator];

          //_paramKey : 'a.b'
          for (var _paramKey in _param){

            if(output.hasOwnProperty(_operator)){
              output[_operator][_paramKey] = _param[_paramKey];
            }else{
              output[_operator] = {};
              output[_operator][_paramKey] = _param[_paramKey];
            }
          }
        }
      }
    }

    if(Object.getOwnPropertyNames(output).length ===0){
      return callback('field is undefined');
    }

    return callback(null,output);
  },util.IGNORE_OPERATION);
}

var operationMiddleware = function(req, res, next){

  if(req.body){
    if(typeof(req.body) !== 'object'){
      try{
        req.body = JSON.parse(req.body);
      }catch(e){
        return next('SyntaxError:'+req.body);
      }
    }
  }

  if(req.body && Object.getOwnPropertyNames(req.body).length > 0){
    operationParser(req.body,function(err,result){
      if(err) return next(err);

      req.body = result;
      if(arguments[3]){
        return arguments[3](req, res, next);
      }else{
        return next();
      }
    });
  }else{
      if(arguments[3]){
        return arguments[3](req, res, next);
      }else{
        return next();
      }
  }
}

var bodyFilterMiddleware = function(req, res, next){
  if(req.body){
    if(typeof(req.body) !== 'object'){
      try{
        req.body = JSON.parse(req.body);
      }catch(e){
        return next('SyntaxError');
      }
    }
  }

  if(req.body && Object.getOwnPropertyNames(req.body).length >= 0){
    var _filterNames = ['where','sort','limit','skip','keys'];
    for (var _index in _filterNames){
      if(!req.body.hasOwnProperty(_filterNames[_index])){
        if(_filterNames[_index] === 'limit'){
          req.body[_filterNames[_index]] = defaultValues.limit;
        }else if(_filterNames[_index] === 'skip'){
          req.body[_filterNames[_index]] = 0;
        }else if(_filterNames[_index] === 'keys'){
          req.body[_filterNames[_index]] = "";
        }else{
          req.body[_filterNames[_index]] = {};
        }
      }
    }

    // if(Object.getOwnPropertyNames(req.query).length > 4){
    //   var _unknownProperties = [];
    //   for (var _property in req.query){
    //     if(req.query.hasOwnProperty(_property) && _filterNames.indexOf(_property) === -1){
    //       _unknownProperties.push(_property);
    //       return next('unknown properties:'+_unknownProperties);
    //     }
    //   }
    // }

    whereParser(req.body.where,function(err,result){
      if(err) return next(err+': where');
      req.body.where = result;
      sortParser(req.body.sort,function(err,result){
        if(err) return next(err +': sort');
        req.body.sort = result;
        limitParser(req.body.limit,function(err,result){
          if(err) return next(err +': limit');
          req.body.limit = result;

          skipParser(req.body.skip,function(err,result){
            if(err) return next(err +': skip');
            req.body.skip = result;

            keysParser(req.body.keys,function(err,result){
              if(err) return next(err +': keys');
              req.body.keys = result;
              if(arguments[3]){
                return arguments[3](req, res, next);
              }else{
                return next();
              }
            });
          });
        });
      });
    });

  }else{
    return next();
  }
}

var filterMiddleware = function(req, res, next){
  if(req.query){
    if(typeof(req.query) !== 'object'){
      try{
        req.query = JSON.parse(req.query);
      }catch(e){
        return next('SyntaxError');
      }
    }
  }
  
  if(req.query && Object.getOwnPropertyNames(req.query).length >= 0){
    var _filterNames = ['where','sort','limit','skip','keys'];
    for (var _index in _filterNames){
      if(!req.query.hasOwnProperty(_filterNames[_index])){
        if(_filterNames[_index] === 'limit'){
          req.query[_filterNames[_index]] = defaultValues.limit;
        }else if(_filterNames[_index] === 'skip'){
          req.query[_filterNames[_index]] = 0;
        }else if(_filterNames[_index] === 'keys'){
          req.query[_filterNames[_index]] = "";
        }else{
          req.query[_filterNames[_index]] = {};
        }
      }
    }

    // if(Object.getOwnPropertyNames(req.query).length > 4){
    //   var _unknownProperties = [];
    //   for (var _property in req.query){
    //     if(req.query.hasOwnProperty(_property) && _filterNames.indexOf(_property) === -1){
    //       _unknownProperties.push(_property);
    //       return next('unknown properties:'+_unknownProperties);
    //     }
    //   }
    // }

    whereParser(req.query.where,function(err,result){
      if(err) return next(err+': where');
      req.query.where = result;
      sortParser(req.query.sort,function(err,result){
        if(err) return next(err +': sort');
        req.query.sort = result;
        limitParser(req.query.limit,function(err,result){
          if(err) return next(err +': limit');
          req.query.limit = result;

          skipParser(req.query.skip,function(err,result){
            if(err) return next(err +': skip');
            req.query.skip = result;

            keysParser(req.query.keys,function(err,result){
              if(err) return next(err +': keys');
              req.query.keys = result;
              if(arguments[3]){
                return arguments[3](req, res, next);
              }else{
                return next();
              }
            });
          });
        });
      });
    });

  }else{
    return next();
  }
}

var parseableMiddleware = function(req, res, next){
  operationMiddleware(req, res, next, filterMiddleware);
}

exports.operationMiddleware = operationMiddleware;
exports.bodyFilterMiddleware = bodyFilterMiddleware;
exports.filterMiddleware = filterMiddleware;
exports.operationParser = operationParser;
exports.whereParser = whereParser;
exports.sortParser = sortParser;
exports.limitParser = limitParser;
exports.skipParser = skipParser;
exports.keysParser = keysParser;
exports.middleware = parseableMiddleware;
exports.defaultValues = defaultValues;
