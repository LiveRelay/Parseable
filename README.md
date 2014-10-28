Parseable
=============

Parseable allows NodeJS developers to build REST API applications with client-driven (ad hoc, dynamic) queries similar to noBackend platforms. It is influenced by the features provided by the LoopBack and Parse.com Backend-as-a-Service platforms. Parseable can parse RESTful API endpoint queries into properly structured [MongoDB](http://www.mongodb.org) syntax.



##Parseable Middlewares

### middleware
- invokes operationMiddleware and filterMiddleware in sequence

### operationMiddleware
- parse req.body with operationParser

### filterMiddleware
- parse req.query with whereParser, sortParser, limitParser, skipParser, and keysParser in sequence

### default values
If req.query does't contain property "limit", Parseble will add it to req.query with value 200.<br />
<br />
The default value can be changed, e.g.:
```javascript
  var defaultValues = require('parseable').defaultValues; 
  defaultValues.limit = 100;
```

### Example of using Parseable as a middleware:
```javascript
  var parseable = require('parseable').middleware;  
  var router = require('express').Router();
    
  router.get('/', function(req, res, next) {
    //raw request:
    console.log(req.query);//{"where":{"a1":{"b1":{"c1":{$gt:10}}}},"sort":{},"skip":0,"keys":"a,b,-c"}
    next();
  });
  
  router.get('/', parseable, function(req, res) {
    //after:
    console.log(req.query);//{"where":{"a1.b1.c1":{$gt:10}},"sort":{},"limit":200,"skip":0,"keys":{a:1,b:1,c:0}}
  });
```
<br />
```javascript
  var parseable = require('parseable').middleware;  
  var router = require('express').Router();
    
  router.put('/', function(req, res, next) {
    //raw request:
    console.log(req.body);//{"field":{"__op": "Increment", "amount": 1234}}
    next();
  });
  
  router.put('/', parseable, function(req, res) {
    //after:
    console.log(req.body);//{$inc:{"field":1234}}
  });
```
<br />
Multiple Operation:
```javascript
  var parseable = require('parseable').middleware;  
  var router = require('express').Router();
    
  router.put('/', function(req, res, next) {
    //raw request:
    console.log(req.body);//{"field":{"sub_field1":{"__op": "Remove", "object": {"a":1}},"sub_field2":{"__op": "Increment", "amount": 1234}}, "field2":{"__op": "AddUnique", "objects": [1,2,3]}}
    next();
  });
  
  router.put('/', parseable, function(req, res) {
    //after:
    console.log(req.body);//{"$pull":{"field.sub_field1":{"a":1}},"$inc":{"field.sub_field2":1234},"$addToSet":{"field2":{"$each":[1,2,3]}}}
  });
```
<br />
<br />
## Parseable functions

### Parseable.operationParser

```javascript
  var operationParser = require('parseable').operationParser; 
  
  var input = {"field":{"__op": "Increment", "amount": 1234}};

  operationParser(input,function(err,output){
    console.log(output); // {$inc:{"field":1234}}
  });

```

 - Increment: increment a number field
>        input:  {"field":{"__op": "Increment", "amount": 1234}}
>        output: {$inc:{"field":1234}}

 - Add: add objects to array field
>        input: {"field":{"__op": "Add", "objects": [1,2,3]}}
>        output: {$pushAll:{"field":[1,2,3]}}

 - AddUnique: add objects if not existed
>        input: {"field":{"__op": "AddUnique", "objects": [1,2,3]}}
>        output: {$addToSet:{"field":{$each:[1,2,3]}}}

 - Remove: removes from an existing array all instances of a value or values that match a specified query
>        input: {"field":{"__op": "Remove", "object": {"a":1}}}
>        output: {$pull:{"field":{"a":1}}}

 - RemoveAll: remove objects from array field
>        input: {"field":{"__op": "RemoveAll", "objects": [1,2,3]}}
>        output: {$pullAll:{"field":[1,2,3]}}

 - Delete: delete a field
>        input: {"field":{"__op": "Delete"}}
>        output: {$unset:{"field":""}}

 - Set: replaces the value of a field to the specified value.
>        input: {"field":123}
>        output: {$set:{field:123}}

### Parseable.whereParser:
```javascript
  var whereParser = require('parseable').whereParser; 
  var input = {"a1":{"b1":{"c1":1}}};

  whereParser(input,function(err,output){
    console.log(output); // {"a1.b1.c1":1}
  });

```

>        input: {"a1":{"b1":{"c1":1}}}
>        output: {"a1.b1.c1":1}
>
>        input: "{\"a1\":{\"b1\":{\"c1\":1}}}"
>        output: {"a1.b1.c1":1}
>
>        input: {"a1":{"b1":{"c1":[1,2,3],"c2":"abc"},"b2":1},"a2":1}
>        output: {"a1.b1.c1":[1,2,3],"a1.b1.c2":"abc","a1.b2":1,"a2":1}
>
>        input: "{'a':123}"
>        err:  SyntaxError


### Parseable.sortParser :

```javascript
  var sortParser = require('parseable').sortParser; 

  var input = {"a1":{"b1":{"c1":1}}};

  sortParser(input,function(err,output){
    console.log(output); // {"a1.b1.c1":1}
  });

```

>        input: {"a1":{"b1":{"c1":1}}}
>        output: {"a1.b1.c1":1}
>
>        input: "{\"a1\":{\"b1\":{\"c1\":1}}}"
>        output: {"a1.b1.c1":1}
>
>        input: {"a1":{"b1":{"c1":1},"b2":-1},"a2":1}
>        output: {"a1.b1.c1":1,"a1.b2":-1,"a2":1}
>
>        input: {"a1":{"b1":{"c1":[1,2,3]}}}
>        err: "bad sort specification: 1,2,3"
>
>        input: {"a1":{"b1":{"c1":1},"b2":0}}
>        err: "bad sort specification: 0"
>


### Parseable.limitParser 
### Parseable.skipParser

```javascript
  var limitParser = require('parseable').limitParser; 
  var skipParser = require('parseable').skipParser; 
  
  var input = 123;

  limitParser(input,function(err,output){
    console.log(output); // 123
  });

```

>        input: 123
>        output: 123
>
>        input: "123"
>        output: 123
>
>        input: 2147483649
>        err: value out of range
>
>        input: -2147483649
>        err: value out of range
>
>        input: "123a"
>        err: SyntaxError
>
>        input: "{limit:123}"
>        err: SyntaxError



### Parseable.keysParser

```javascript
  var keysParser = require('parseable').keysParser; 
  
  var input = "foo,-koo";

  keysParser(input,function(err,output){
    console.log(output); // {"foo":1,"koo":0}
  });

```

>        input: "a,b,c,-d"
>        output: {a:1,b:1,c:1,d:0}
>
>        input: "a,b,c,,,"
>        output: {a:1,b:1,c:1}
>
>        input: 123
>        err: "SyntaxError: keys is not string"
