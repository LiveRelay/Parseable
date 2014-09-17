Parseable
=============

Parseable allows NodeJS developers to build REST API applications with client-driven (ad hoc, dynamic) queries similar to noBackend platforms. It is influenced by the features provided by the LoopBack and Parse.com Backend-as-a-Service platforms. Parseable can parse RESTful API endpoint queries into properly structured [MongoDB](http://www.mongodb.org) syntax.



##Parseable Middlewares

### middleware
- invokes operationMiddleware and filterMiddleware in sequence

### operationMiddleware
- parse req.body with operationParser

### filterMiddleware
- parse req.query with whereParser, sortParser, limitParser and skipParser in sequence

### Example of using Parseable as a middleware:
    var parseable = require('parseable').middleware;
    var router = require('express').Router();
    router.get('/', parseable, function(req, res) {...});


## Parser functions

- ### Parseable.operationParser

 - Increment: increment a number field
>        input:  {"field":{"__op": "Increment", "amount": 1234}}
>        output: {$inc:{"field":1234}}

 - Add: add objects to array field
>        input: {"field":{"__op": "Add", "objects": [1,2,3]}}
>        output: {$pushAll:{"field":[1,2,3]}}

 - AddUnique: add objects if not existed
>        input: {"field":{"__op": "AddUnique", "objects": [1,2,3]}}
>        output: {$addToSet:{"field":{$each:[1,2,3]}}}
 - Remove: remove objects from array field
>        input: {"field":{"__op": "Remove", "objects": [1,2,3]}}
>        output: {$pullAll:{"field":[1,2,3]}}

 - Delete: delete a field
>        input: {"field":{"__op": "Delete"}}
>        output: {$unset:{"field":""}}

- ### Parseable.whereParser :
>        input: {"a1":{"b1":{"c1":1}}}
>        output: {"a1.b1.c1":1}
>
>        input: "{\"a1\":{\"b1\":{\"c1\":1}}}"
>        output: {"a1.b1.c1":1}
>
>        input: {"a1":{"b1":{"c1":[1,2,3]}}}
>        output: {"a1.b1.c1":[1,2,3]}
>   
>        input: {"a1":{"b1":{"c1":[1,2,3]},"b2":1}}
>        output: {"a1.b1.c1":[1,2,3],"a1.b2":1}
>
>        input: {"a1":{"b1":{"c1":[1,2,3]},"b2":1},"a2":1}
>        output: {"a1.b1.c1":[1,2,3],"a1.b2":1,"a2":1}
>
>        input: {"a1":{"b1":{"c1":[1,2,3],"c2":"abc"},"b2":1},"a2":1}
>        output: {"a1.b1.c1":[1,2,3],"a1.b1.c2":"abc","a1.b2":1,"a2":1}
>
>        input: {}
>        output: {}
>   
>        input: "{aaa}"
>        output: SyntaxError
>
>        input: "{a:123}"
>        output: SyntaxError
>
>        input: "{'a':123}"
>        output:  SyntaxError


- ### Parseable.sortParser :
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
>        output: "bad sort specification: 1,2,3"
>
>        input: {"a1":{"b1":{"c1":1},"b2":0}}
>        output: "bad sort specification: 0"
>
>        input: {}
>        output: {}
>
>        input: "{aaa}"
>        output: "SyntaxError"
>
>        input: "{a:123}"
>        output: SyntaxError
>
>        input: "{'a':123}"
>        output: SyntaxError

- ### Parseable.limitParser 

- ### Parseable.skipParser
>        input: 123
>        output: 123
>
>        input: 2147483648
>        output: 2147483648
>
>        input: "123"
>        output: 123
>
>        input: 2147483649
>        output: value out of range
>
>        input: -2147483649
>        output: value out of range
>
>        input: "123a"
>        output: SyntaxError
>
>        input: "{limit:123}"
>        output: SyntaxError



### Example of using Parseable functions:

    parser(input,function(err,output){
      ...
    });
