/**
 *
 * Mocha test script for Parseable
 *
 **/

var assert = require("assert");
var should = require('should');
var parseable = require('../index').middleware;
var operationMiddleware = require('../index').operationMiddleware;
var filterMiddleware = require('../index').filterMiddleware;
var operationParser = require('../index').operationParser;
var whereParser = require('../index').whereParser;
var sortParser = require('../index').sortParser;
var limitParser = require('../index').limitParser;
var skipParser = require('../index').skipParser;
var keysParser = require('../index').keysParser;
var defaultValues = require('../index').defaultValues;

describe('operationParser', function(){

  beforeEach(function(done){
    done();
  })

  describe('All Operation', function(){
    var param1 = '{"field":{}}';
    var errorMsg1 = "contain empty object: {}";
    it(param1 + " should return " + errorMsg1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg1);
      }));
    });

    var param2 = '{}';
    var errorMsg2 = "field is undefined";
    it(param2 + " should return " + errorMsg2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg2);
      }));
    });

    var param3 = '{123:qwe}';
    var errorMsg3 = "SyntaxError";
    it(param3 + " should return " + errorMsg3, function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err,errorMsg3);
      }));
    });

  });

  describe('Increment', function(){
    var param1 = '{"field":{"__op": "Increment", "amount": 123}}';
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$inc:{"field":123}}));
      }));
    });

    var param1_2 = {"field":'{"__op": "Increment", "amount": 123}'};
    it(param1_2, function(){
      assert.equal(undefined,operationParser(param1_2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$inc:{"field":123}}));
      }));
    });

    var param2 = {"field":{"__op": "Increment", "amount": 123}};
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$inc:{"field":123}}));
      }));
    });

    var param3 = '{"field":{"__op": "Increment", "amount": "aaa"}}';
    var errorMsg3 = "'amount' is not number: {\"__op\":\"Increment\",\"amount\":\"aaa\"}";
    it(param3 + " should return " + errorMsg3, function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg3);
      }));
    });

    var param4 = '{"field":{"__op": "Increment"}}';
    var errorMsg4 = "no property 'amount': {\"__op\":\"Increment\"}";
    it(param4 + " should return " + errorMsg4, function(){
      assert.equal(undefined,operationParser(param4,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg4);
      }));
    });

  });

  describe('Add', function(){
    var param1 = '{"field":{"__op": "Add", "objects": [1,2,3]}}';
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$pushAll:{"field":[1,2,3]}}));
      }));
    });

    var param2 = {"field":{"__op": "Add", "objects": [1,2,3]}};
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$pushAll:{"field":[1,2,3]}}));
      }));
    });

    var param3 = '{"field":{"__op": "Add", "objects": 123}}';
    var errorMsg3 = "'objects' is not Array: {\"__op\":\"Add\",\"objects\":123}";
    it(param3 + " should return " + errorMsg3, function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg3);
      }));
    });

    var param4 = '{"field":{"__op": "Add", "abc": 123}}';
    var errorMsg4 = "no property 'objects': {\"__op\":\"Add\",\"abc\":123}";
    it(param4  + " should return error", function(){
      assert.equal(undefined,operationParser(param4,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg4);
      }));
    });

  });

  describe('AddUnique', function(){
    var param1 = '{"field":{"__op": "AddUnique", "objects": [1,2,3]}}';
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$addToSet:{"field":{$each:[1,2,3]}}}));
      }));
    });

    var param2 = {"field":{"__op": "AddUnique", "objects": [1,2,3]}};
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$addToSet:{"field":{$each:[1,2,3]}}}));
      }));
    });

    var param3 = '{"field":{"__op": "AddUnique", "objects": 123}}';
    var errorMsg3 = "'objects' is not Array: {\"__op\":\"AddUnique\",\"objects\":123}";
    it(param3  + " should return error", function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg3);
      }));
    });

    var param4 = '{"field":{"__op": "Add", "abc": 123}}';
    var errorMsg4 = "no property 'objects': {\"__op\":\"Add\",\"abc\":123}";
    it(param4  + " should return error", function(){
      assert.equal(undefined,operationParser(param4,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg4);
      }));
    });

  });


  describe('Remove', function(){
    var param1 = {"field":{"__op": "Remove", "object": {a:1}}};
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$pull:{"field":{'a':1}}}));
      }));
    });

    var param2 = '{"field":{"__op": "Remove", "object": {"a":1}}}';
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$pull:{"field":{'a':1}}}));
      }));
    });

    var param3 = '{"field":{"__op": "Remove", "object":[1,2,3] }}';
    var errorMsg3 = "'object' is not Object: [1,2,3]";
    it(param3  + " should return error", function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg3);
      }));
    });

    var param4 = '{"field":{"__op": "Remove", "abc": 123}}';
    var errorMsg4 = "no property 'object': {\"__op\":\"Remove\",\"abc\":123}";
    it(param4  + " should return error", function(){
      assert.equal(undefined,operationParser(param4,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg4);
      }));
    });

  });

  describe('RemoveAll', function(){
    var param1 = '{"field":{"__op": "RemoveAll", "objects": [1,2,3]}}';
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$pullAll:{"field":[1,2,3]}}));
      }));
    });

    var param2 = {"field":{"__op": "RemoveAll", "objects": [1,2,3]}};
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$pullAll:{"field":[1,2,3]}}));
      }));
    });

    var param3 = '{"field":{"__op": "RemoveAll", "objects": 123}}';
    var errorMsg3 = "'objects' is not Array: {\"__op\":\"RemoveAll\",\"objects\":123}";
    it(param3  + " should return error", function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg3);
      }));
    });

    var param4 = '{"field":{"__op": "RemoveAll", "abc": 123}}';
    var errorMsg4 = "no property 'objects': {\"__op\":\"RemoveAll\",\"abc\":123}";
    it(param4  + " should return error", function(){
      assert.equal(undefined,operationParser(param4,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg4);
      }));
    });

  });

  describe('Delete', function(){
    var param1 = '{"field":{"__op": "Delete"}}';
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$unset:{"field":""}}));
      }));
    });

    var param2 = {"field":{"__op": "Delete"}};
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify({$unset:{"field":""}}));
      }));
    });
  });

  describe('Set', function(){
    var param1 = '{"field":123}';
    var result1 = {"$set":{"field":123}};
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify(result1));
      }));
    });

    var param2 = {"field":123};
    var result2 = {"$set":{"field":123}};
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify(result2));
      }));
    });

    var param3 = {"field":{"subfield":123}};
    var result3 = {"$set":{"field.subfield":123}};
    it(param3, function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify(result3));
      }));
    });
  });

  describe('Multi Operation', function(){
    var param1 = '{"field":{"__op": "AddUnique", "objects": [1,2,3]}, "field2":{"__op": "AddUnique", "objects": [4,5,6]}}';
    var expect1 = {"$addToSet":{"field":{"$each":[1,2,3]},"field2":{"$each":[4,5,6]}}};
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify(expect1));
      }));
    });

    var param2 = {"field":{"__op": "AddUnique", "objects": [1,2,3]}, "field2":{"__op": "AddUnique"}};
    var errorMsg2 = "no property 'objects': {\"__op\":\"AddUnique\"}";
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){

        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err,errorMsg2);
      }));
    });

    var param3 = {"field":{"subfield":123}, "field2":{"__op": "AddUnique", "objects": [4,5,6]}};
    var expect3 = {"$set":{"field.subfield":123},"$addToSet":{"field2":{"$each":[4,5,6]}}};
    it(param3, function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify(expect3));
      }));
    });
  });

  describe('Sub-Document Operation', function(){
    var param1 = {"field":{"sub_field":{"__op": "AddUnique", "objects": [1,2,3]}}};
    var expect1 = {"$addToSet":{"field.sub_field":{"$each":[1,2,3]}}};
    it(param1, function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify(expect1));
      }));
    });

    var param2 = {"field":{"sub_field1":{"__op": "AddUnique", "objects": [1,2,3]}}, "field2":{"__op": "AddUnique", "objects": [1,2,3]} };
    var expect2 = {"$addToSet":{"field.sub_field1":{"$each":[1,2,3]},"field2":{"$each":[1,2,3]} }};
    it(param2, function(){
      assert.equal(undefined,operationParser(param2,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify(expect2));
      }));
    });

    var param3 = {"field":{"sub_field1":{"__op": "AddUnique", "objects": [1,2,3]},"sub_field2":{"__op": "Increment", "amount": 1234}}, "field2":{"__op": "AddUnique", "objects": [1,2,3]} };
    var expect3 = {"$addToSet":{"field.sub_field1":{"$each":[1,2,3]},"field2":{"$each":[1,2,3]}},"$inc":{"field.sub_field2":1234}};
    it(param3, function(){
      assert.equal(undefined,operationParser(param3,function(err,syntax){
        should.not.exist(err);
        should.exist(syntax);
        assert.equal(JSON.stringify(syntax),JSON.stringify(expect3));
      }));
    });

    var param4 = {"field":{"sub_field1":{"__op": "AddUnique", "objects": [1,2,3]},"sub_field2":{}}};
    var errorMsg4 = "contain empty object: {}";
    it(param4, function(){
      assert.equal(undefined,operationParser(param4,function(err,syntax){

        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err,errorMsg4);
      }));
    });
  });

  describe('Unknown Operation', function(){
    var param1 = '{"field":{"__op":"unknown"}}';
    var errorMsg1 = 'unknown operation:{"__op":"unknown"}';
    it(param1 + ' should return "'+errorMsg1 + '"', function(){
      assert.equal(undefined,operationParser(param1,function(err,syntax){
        should.exist(err);
        should.not.exist(syntax);
        assert.equal(err, errorMsg1);
      }));
    });
  });

});

//Where Parser
describe('parseable.whereParser', function(){

  var param1 = {a1:{b1:{c1:1}}};
  var output1 = {"a1.b1.c1":1};
  it(JSON.stringify(param1) +" to " + JSON.stringify(output1), function(){
    assert.equal(undefined,whereParser(param1,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1));
    }));
  });

  var param1_2 = '{"a1":{"b1":{"c1":1}}}';
  var output1_2 = {"a1.b1.c1":1};
  it(JSON.stringify(param1_2) +" to " + JSON.stringify(output1_2), function(){
    assert.equal(undefined,whereParser(param1_2,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_2));
    }));
  });

  var param1_3 = {a1:{ $gt:1, $lt:3 }};
  var output1_3 = {a1:{ $gt:1, $lt:3 }};
  it(JSON.stringify(param1_3) +" to " + JSON.stringify(output1_3), function(){
    assert.equal(undefined,whereParser(param1_3,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_3));
    }));
  });

  var param1_4 = {a1:{ $gt:1, $lt:3, lala:1}};
  var errorMsg1_4 = "unknown operator: lala";
  it(JSON.stringify(param1_4) +" should return " + JSON.stringify(errorMsg1_4), function(){
    assert.equal(undefined,whereParser(param1_4,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(JSON.stringify(err), JSON.stringify(errorMsg1_4));
    }));
  });

  var param1_5 = {a1:{ $gt:1, $lt:3, lala:1, yaya:2}};
  var errorMsg1_5 = "unknown operator: lala,yaya";
  it(JSON.stringify(param1_5) +" should return " + JSON.stringify(errorMsg1_5), function(){
    assert.equal(undefined,whereParser(param1_5,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(JSON.stringify(err), JSON.stringify(errorMsg1_5));
    }));
  });

  var param1_6 = {a1:{b1:{ $gt:1, $lt:3 }, b2:{c1:1,c2:{ $gt:1, $lt:3 }} } };
  var output1_6 = {"a1.b1":{"$gt":1,"$lt":3},"a1.b2.c1":1,"a1.b2.c2":{"$gt":1,"$lt":3}};
  it(JSON.stringify(param1_6) +" to " + JSON.stringify(output1_6), function(){
    assert.equal(undefined,whereParser(param1_6,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_6));
    }));
  });

  var param1_7 = {"a1":"one"};
  var output1_7 = {"a1":"one"};
  it(JSON.stringify(param1_7) +" to " + JSON.stringify(output1_7), function(){
    assert.equal(undefined,whereParser(param1_7,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_7));
    }));
  });

  var param2 = {a1:{b1:{c1:[1,2,3]}}};
  var output2 = {"a1.b1.c1":[1,2,3]};
  it(JSON.stringify(param2) +" to " + JSON.stringify(output2), function(){
    assert.equal(undefined,whereParser(param2,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output2));
    }));
  });

  var param3 = {a1:{b1:{c1:[1,2,3]},b2:1} };
  var output3 = {"a1.b1.c1":[1,2,3],"a1.b2":1};
  it(JSON.stringify(param3) +" to " + JSON.stringify(output3), function(){
    assert.equal(undefined,whereParser(param3,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output3));
    }));
  });

  var param4 = {a1:{b1:{c1:[1,2,3]},b2:1} , a2:1};
  var output4 = {"a1.b1.c1":[1,2,3],"a1.b2":1,"a2":1};
  it(JSON.stringify(param4) +" to " + JSON.stringify(output4), function(){
    assert.equal(undefined,whereParser(param4,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output4));
    }));
  });

  var param5 = {a1:{b1:{c1:[1,2,3], c2:"abc"},b2:1} , a2:1};
  var output5 = {"a1.b1.c1":[1,2,3],"a1.b1.c2":"abc","a1.b2":1,"a2":1};
  it(JSON.stringify(param5) +" to " + JSON.stringify(output5), function(){
    assert.equal(undefined,whereParser(param5,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output5));
    }));
  });

  var param6 = {};
  var output6 = {};
  it(JSON.stringify(param6) +" to " + JSON.stringify(output6), function(){
    assert.equal(undefined,whereParser(param6,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output6));
    }));
  });

  var param7 = "{aaa}";
  var errorMsg7 = "SyntaxError";
  it(JSON.stringify(param7) +" should return " + errorMsg7, function(){
    assert.equal(undefined,whereParser(param7,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg7);
    }));
  });

  var param8 = "{a:123}";
  var errorMsg8 = "SyntaxError";
  it(JSON.stringify(param8) +" should return " + errorMsg8, function(){
    assert.equal(undefined,whereParser(param8,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg8);
    }));
  });

  var param9 = "{'a':123}";
  var errorMsg9 = "SyntaxError";
  it(JSON.stringify(param9) +" should return " + errorMsg9, function(){
    assert.equal(undefined,whereParser(param9,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg9);
    }));
  });

});


describe('parseable.sortParser', function(){

  var param1 = {a1:{b1:{c1:1}}};
  var output1 = {"a1.b1.c1":1};
  it(JSON.stringify(param1) +" to " + JSON.stringify(output1), function(){
    assert.equal(undefined,sortParser(param1,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1));
    }));
  });

  var param1_2 = '{"a1":{"b1":{"c1":1}}}';
  var output1_2 = {"a1.b1.c1":1};
  it(JSON.stringify(param1_2) +" to " + JSON.stringify(output1_2), function(){
    assert.equal(undefined,sortParser(param1_2,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_2));
    }));
  });

  var param1_3 = {"a1":{"b1":{"c1":1},"b2":-1},"a2":1};
  var output1_3 = {"a1.b1.c1":1,"a1.b2":-1,"a2":1};
  it(JSON.stringify(param1_3) +" to " + JSON.stringify(output1_3), function(){
    assert.equal(undefined,sortParser(param1_3,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_3));
    }));
  });

  var param1_4 = {"a1":"-1","a2":1};
  var output1_4 = {"a1":-1,"a2":1};
  it(JSON.stringify(param1_4) +" to " + JSON.stringify(output1_4), function(){
    assert.equal(undefined,sortParser(param1_4,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_4));
    }));
  });

  var param2 = {a1:{b1:{c1:[1,2,3]}}};
  var errorMsg2 = "bad sort specification: 1,2,3";
  it(JSON.stringify(param2) +" should return " + JSON.stringify(errorMsg2), function(){
    assert.equal(undefined,sortParser(param2,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg2);
    }));
  });

  var param3 = {a1:{b1:{c1:1},b2:0}};
  var errorMsg3 = "bad sort specification: 0";
  it(JSON.stringify(param3) +" should return " + JSON.stringify(errorMsg3), function(){
    assert.equal(undefined,sortParser(param3,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg3);
    }));
  });

  var param6 = {};
  var output6 = {};
  it(JSON.stringify(param6) +" to " + JSON.stringify(output6), function(){
    assert.equal(undefined,sortParser(param6,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output6));
    }));
  });

  var param7 = "{aaa}";
  var errorMsg7 = "SyntaxError";
  it(JSON.stringify(param7) +" should return " + errorMsg7, function(){
    assert.equal(undefined,sortParser(param7,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg7);
    }));
  });

  var param8 = "{a:123}";
  var errorMsg8 = "SyntaxError";
  it(JSON.stringify(param8) +" should return " + errorMsg8, function(){
    assert.equal(undefined,sortParser(param8,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg8);
    }));
  });

  var param9 = "{'a':123}";
  var errorMsg9 = "SyntaxError";
  it(JSON.stringify(param9) +" should return " + errorMsg9, function(){
    assert.equal(undefined,sortParser(param9,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg9);
    }));
  });

  var param10 = {a:"-1a"};
  var errorMsg10 = "bad sort specification: -1a";
  it(JSON.stringify(param10) +" should return " + errorMsg10, function(){
    assert.equal(undefined,sortParser(param10,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg10);
    }));
  });
});

describe('parseable.limitParser', function(){

  var param1 = 123;
  var output1 = 123;
  it(JSON.stringify(param1) +" to " + JSON.stringify(output1), function(){
    assert.equal(undefined,limitParser(param1,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1));
    }));
  });

  var param1_1 = 2147483648;
  var output1_1 = 2147483648;
  it(JSON.stringify(param1_1) +" to " + JSON.stringify(output1_1), function(){
    assert.equal(undefined,limitParser(param1_1,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_1));
    }));
  });

  var param1_2 = -2147483648;
  var output1_2 = -2147483648;
  it(JSON.stringify(param1_2) +" to " + JSON.stringify(output1_2), function(){
    assert.equal(undefined,limitParser(param1_2,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_2));
    }));
  });

  var param2 = "123";
  var output2 = 123;
  it(JSON.stringify(param2) +" to " + JSON.stringify(output2), function(){
    assert.equal(undefined,limitParser(param2,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output2));
    }));
  });

  var param4 = 2147483649;
  var errorMsg4 = "value out of range";
  it(JSON.stringify(param4) +" should return " + errorMsg4, function(){
    assert.equal(undefined,limitParser(param4,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg4);
    }));
  });

  var param5 = -2147483649;
  var errorMsg5 = "value out of range";
  it(JSON.stringify(param5) +" should return " + errorMsg5, function(){
    assert.equal(undefined,limitParser(param5,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg5);
    }));
  });

  var param6 = "123a";
  var errorMsg6 = "SyntaxError";
  it(JSON.stringify(param6) +" should return " + errorMsg6, function(){
    assert.equal(undefined,limitParser(param6,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg6);
    }));
  });

  var param7 = "{limit:123}";
  var errorMsg7 = "SyntaxError";
  it(JSON.stringify(param7) +" should return " + errorMsg7, function(){
    assert.equal(undefined,limitParser(param7,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg7);
    }));
  });

});

//The Skip Parser
describe('parseable.skipParser', function(){

  var param1 = 123;
  var output1 = 123;
  it(JSON.stringify(param1) +" to " + JSON.stringify(output1), function(){
    assert.equal(undefined,skipParser(param1,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1));
    }));
  });

  var param1_1 = 2147483648;
  var output1_1 = 2147483648;
  it(JSON.stringify(param1_1) +" to " + JSON.stringify(output1_1), function(){
    assert.equal(undefined,skipParser(param1_1,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_1));
    }));
  });

  var param1_2 = -2147483648;
  var output1_2 = -2147483648;
  it(JSON.stringify(param1_2) +" to " + JSON.stringify(output1_2), function(){
    assert.equal(undefined,skipParser(param1_2,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1_2));
    }));
  });

  var param2 = "123";
  var output2 = 123;
  it(JSON.stringify(param2) +" to " + JSON.stringify(output2), function(){
    assert.equal(undefined,skipParser(param2,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output2));
    }));
  });

  var param4 = 2147483649;
  var errorMsg4 = "value out of range";
  it(JSON.stringify(param4) +" should return " + errorMsg4, function(){
    assert.equal(undefined,skipParser(param4,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg4);
    }));
  });

  var param5 = -2147483649;
  var errorMsg5 = "value out of range";
  it(JSON.stringify(param5) +" should return " + errorMsg5, function(){
    assert.equal(undefined,skipParser(param5,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg5);
    }));
  });

  var param6 = "123a";
  var errorMsg6 = "SyntaxError";
  it(JSON.stringify(param6) +" should return " + errorMsg6, function(){
    assert.equal(undefined,skipParser(param6,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg6);
    }));
  });

  var param7 = "{limit:123}";
  var errorMsg7 = "SyntaxError";
  it(JSON.stringify(param7) +" should return " + errorMsg7, function(){
    assert.equal(undefined,skipParser(param7,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg7);
    }));
  });
});


describe('parseable.keysParser', function(){

  var param1 = "a,b,c,-d";
  var output1 = {a:1,b:1,c:1,d:0};
  it(JSON.stringify(param1) +" to " + JSON.stringify(output1), function(){
    assert.equal(undefined,keysParser(param1,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output1));
    }));
  });

  var param2 = "a,b,c,,,";
  var output2 = {a:1,b:1,c:1};
  it(JSON.stringify(param2) +" to " + JSON.stringify(output2), function(){
    assert.equal(undefined,keysParser(param2,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output2));
    }));
  });

  var param3 = "a,b,-";
  var output3 = {a:1,b:1,"-":1};
  it(JSON.stringify(param3) +" to " + JSON.stringify(output3), function(){
    assert.equal(undefined,keysParser(param3,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output3));
    }));
  });

  var param4 = "";
  var output4 = {};
  it(JSON.stringify(param4) +" to " + JSON.stringify(output4), function(){
    assert.equal(undefined,keysParser(param4,function(err,syntax){
      should.exist(syntax);
      should.not.exist(err);
      assert.equal(JSON.stringify(syntax), JSON.stringify(output4));
    }));
  });

  var param7 = 123;
  var errorMsg7 = "SyntaxError: keys is not string";
  it(JSON.stringify(param7) +" should return " + errorMsg7, function(){
    assert.equal(undefined,keysParser(param7,function(err,syntax){
      should.exist(err);
      should.not.exist(syntax);
      assert.equal(err, errorMsg7);
    }));
  });

});



/***
 *
 * parseable MiddleWare
 *
 ***/

describe('parseable MiddleWare', function(){

  //parseable
  describe('operation', function(){

    describe('All Operation', function(){
      var param1 = '{"field":{}}';
      var errorMsg = "contain empty object: {}";

      it(param1 + ' should call next("' + errorMsg +'")', function(){

        var req = {};
        req.body = param1;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg);
        };

        assert.equal(undefined,parseable(req,null,next));
      });

      var param2 = {};
      var expect2 = {};
      it(JSON.stringify(param2), function(){

        var req = {};
        req.body = param2;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify(expect2) );
        };

        assert.equal(undefined,parseable(req,null,next));
      });

      var param3 = '{123:qwe}';
      var errorMsg3 = "SyntaxError:{123:qwe}";
      it(param3 + ' should call next("' + errorMsg3 +'")', function(){

        var req = {};
        req.body = param3;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg3);
        };

        assert.equal(undefined,parseable(req,null,next));
      });

    });

    describe('Increment', function(){
      var param1 = '{"field":{"__op": "Increment", "amount": 123}}';
      it(param1, function(){

        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$inc:{"field":123}}));
        };

        assert.equal(undefined,parseable(req,null,next));
      });

      var param1_2 = {"field":'{"__op": "Increment", "amount": 123}'};
      it(param1_2, function(){
        var req = {};
        req.body = param1_2;

        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$inc:{"field":123}}));
        };

        assert.equal(undefined,parseable(req,null,next));
      });

      var param2 = {"field":{"__op": "Increment", "amount": 123}};
      it(param2, function(){
        var req = {};
        req.body = param2;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$inc:{"field":123}}));
        };

        assert.equal(undefined,parseable(req,null,next));
      });

      var param3 = '{"field":{"__op": "Increment", "amount": "aaa"}}';
      var errorMsg3 = "'amount' is not number: {\"__op\":\"Increment\",\"amount\":\"aaa\"}";
      it(param3 + ' should call next("' + errorMsg3 +'")', function(){

        var req = {};
        req.body = param3;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg3);
        };

        assert.equal(undefined,parseable(req,null,next));
      });

      var param4 = '{"field":{"__op": "Increment"}}';
      var errorMsg4 = "no property 'amount': {\"__op\":\"Increment\"}";
      it(param4 + ' should call next("' + errorMsg4 +'")', function(){

        var req = {};
        req.body = param4;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg4);
        };
        assert.equal(undefined,parseable(req,null,next));
      });

    });

    describe('Add', function(){
      var param1 = '{"field":{"__op": "Add", "objects": [1,2,3]}}';
      it(param1, function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$pushAll:{"field":[1,2,3]}}));
        };
        assert.equal(undefined,parseable(req,null,next));

      });

      var param2 = {"field":{"__op": "Add", "objects": [1,2,3]}};
      it(param2, function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$pushAll:{"field":[1,2,3]}}));
        };
        assert.equal(undefined,parseable(req,null,next));

      });

      var param3 = '{"field":{"__op": "Add", "objects": 123}}';
      var errorMsg3 = "'objects' is not Array: {\"__op\":\"Add\",\"objects\":123}";
      it(param3 + ' should call next("' + errorMsg3 +'")', function(){

        var req = {};
        req.body = param3;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg3);
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param4 = '{"field":{"__op": "Add", "abc": 123}}';
      var errorMsg4 = "no property 'objects': {\"__op\":\"Add\",\"abc\":123}";
      it(param4 + ' should call next("' + errorMsg4 +'")', function(){

        var req = {};
        req.body = param4;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg4);
        };
        assert.equal(undefined,parseable(req,null,next));
      });

    });

    describe('AddUnique', function(){
      var param1 = '{"field":{"__op": "AddUnique", "objects": [1,2,3]}}';
      it(param1, function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$addToSet:{"field":{$each:[1,2,3]}}}));
        };

        assert.equal(undefined,parseable(req,null,next));
      });

      var param2 = {"field":{"__op": "AddUnique", "objects": [1,2,3]}};
      it(param2, function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$addToSet:{"field":{$each:[1,2,3]}}}));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param3 = '{"field":{"__op": "AddUnique", "objects": 123}}';
      var errorMsg3 = "'objects' is not Array: {\"__op\":\"AddUnique\",\"objects\":123}";
      it(param3 + ' should call next("' + errorMsg3 +'")', function(){

        var req = {};
        req.body = param3;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg3);
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param4 = '{"field":{"__op": "Add", "abc": 123}}';
      var errorMsg4 = "no property 'objects': {\"__op\":\"Add\",\"abc\":123}";
      it(param4 + ' should call next("' + errorMsg4 +'")', function(){

        var req = {};
        req.body = param4;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg4);
        };
        assert.equal(undefined,parseable(req,null,next));
      });

    });

    describe('Remove', function(){
      var param1 = '{"field":{"__op": "Remove", "object": {"a":1} }}';
      it(param1, function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$pull:{"field":{"a":1}}}));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param2 = {"field":{"__op": "Remove", "object": {"a":1} }};
      it(param2, function(){
        var req = {};
        req.body = param2;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$pull:{"field":{"a":1}}}));
        };
        assert.equal(undefined,parseable(req,null,next));

      });

      var param3 = '{"field":{"__op": "Remove", "object": 123}}';
      var errorMsg3 = "'object' is not Object: {\"__op\":\"Remove\",\"object\":123}";
      it(param3 + ' should call next("' + errorMsg3 +'")', function(){

        var req = {};
        req.body = param3;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg3);
        };
        assert.equal(undefined,parseable(req,null,next));

      });

      var param4 = '{"field":{"__op": "Remove", "abc": 123}}';
      var errorMsg4 = "no property 'object': {\"__op\":\"Remove\",\"abc\":123}";
      it(param4 + ' should call next("' + errorMsg4 +'")', function(){

        var req = {};
        req.body = param4;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg4);
        };
        assert.equal(undefined,parseable(req,null,next));

      });

      var param5 = '{"field":{"__op": "Remove", "object": [1,2,3] }}';
      var errorMsg5 = "'object' is not Object: [1,2,3]";
      it(param4 + ' should call next("' + errorMsg5 +'")', function(){

        var req = {};
        req.body = param5;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg5);
        };
        assert.equal(undefined,parseable(req,null,next));

      });
    });

    describe('RemoveAll', function(){
      var param1 = '{"field":{"__op": "RemoveAll", "objects": [1,2,3]}}';
      it(param1, function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$pullAll:{"field":[1,2,3]}}));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param2 = {"field":{"__op": "RemoveAll", "objects": [1,2,3]}};
      it(param2, function(){
        var req = {};
        req.body = param2;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$pullAll:{"field":[1,2,3]}}));
        };
        assert.equal(undefined,parseable(req,null,next));

      });

      var param3 = '{"field":{"__op": "RemoveAll", "objects": 123}}';
      var errorMsg3 = "'objects' is not Array: {\"__op\":\"RemoveAll\",\"objects\":123}";
      it(param3 + ' should call next("' + errorMsg3 +'")', function(){

        var req = {};
        req.body = param3;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg3);
        };
        assert.equal(undefined,parseable(req,null,next));

      });

      var param4 = '{"field":{"__op": "RemoveAll", "abc": 123}}';
      var errorMsg4 = "no property 'objects': {\"__op\":\"RemoveAll\",\"abc\":123}";
      it(param4 + ' should call next("' + errorMsg4 +'")', function(){

        var req = {};
        req.body = param4;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg4);
        };
        assert.equal(undefined,parseable(req,null,next));

      });

    });

    describe('Delete', function(){
      var param1 = '{"field":{"__op": "Delete"}}';
      it(param1, function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$unset:{"field":""}}));
        };
        assert.equal(undefined,parseable(req,null,next));

      });

      var param2 = {"field":{"__op": "Delete"}};
      it(param2, function(){
        var req = {};
        req.body = param2;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify({$unset:{"field":""}}));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

    });

    describe('Multi Operation', function(){
      var param1 = '{"field":{"__op": "AddUnique", "objects": [1,2,3]}, "field2":{"__op": "AddUnique", "objects": [4,5,6]}}';
      var expect1 = {"$addToSet":{"field":{"$each":[1,2,3]},"field2":{"$each":[4,5,6]}}};
      it(param1, function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify(expect1));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param2 = {"field":{"__op": "AddUnique", "objects": [1,2,3]}, "field2":{"__op": "AddUnique"}};
      var errorMsg2 = "no property 'objects': {\"__op\":\"AddUnique\"}";
      it(param2 + ' should call next("' + errorMsg2 +'")', function(){

        var req = {};
        req.body = param2;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg2);
        };
        assert.equal(undefined,parseable(req,null,next));
      });
    });

    describe('Sub-Document Operation', function(){
      var param1 = {"field":{"sub_field":{"__op": "AddUnique", "objects": [1,2,3]}}};
      var expect1 = {"$addToSet":{"field.sub_field":{"$each":[1,2,3]}}};
      it(JSON.stringify(param1), function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify(expect1));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param2 = {"field":{"sub_field1":{"__op": "AddUnique", "objects": [1,2,3]}}, "field2":{"__op": "AddUnique", "objects": [1,2,3]} };
      var expect2 = {"$addToSet":{"field.sub_field1":{"$each":[1,2,3]},"field2":{"$each":[1,2,3]} }};
      it(JSON.stringify(param2), function(){
        var req = {};
        req.body = param2;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify(expect2));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param3 = {"field":{"sub_field1":{"__op": "AddUnique", "objects": [1,2,3]},"sub_field2":{"__op": "Increment", "amount": 1234}}, "field2":{"__op": "AddUnique", "objects": [1,2,3]} };
      var expect3 = {"$addToSet":{"field.sub_field1":{"$each":[1,2,3]},"field2":{"$each":[1,2,3]}},"$inc":{"field.sub_field2":1234}};
      it(JSON.stringify(param3), function(){
        var req = {};
        req.body = param3;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify(expect3));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param4 = {"field":{"sub_field1":{"__op": "AddUnique", "objects": [1,2,3]},"sub_field2":{}}};
      var errorMsg4 = "contain empty object: {}";
      it(param4 + ' should call next("' + errorMsg4 +'")', function(){

        var req = {};
        req.body = param4;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg4);
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param5 = {"field":{"sub_field1":{"__op": "Remove", "object": {"a":1}},"sub_field2":{"__op": "Increment", "amount": 1234}}, "field2":{"__op": "AddUnique", "objects": [1,2,3]}};
      var expect5 = {"$pull":{"field.sub_field1":{"a":1}},"$inc":{"field.sub_field2":1234},"$addToSet":{"field2":{"$each":[1,2,3]}}};
      it(JSON.stringify(param5), function(){
        var req = {};
        req.body = param5;
        var next = function(err){
          console.log("\n\n\n123:");
          console.log(req.body);
          should.not.exist(err);
          should.exist(req.body);
          assert.equal(JSON.stringify(req.body),JSON.stringify(expect5));
        };
        assert.equal(undefined,parseable(req,null,next));
      });
    });

    describe('Unknown Operation', function(){
      var param1 = {"field":{"__op":"unknown"}};
      var errorMsg1 = 'unknown operation:{"__op":"unknown"}';
      it(JSON.stringify(param1) + "should call next("+errorMsg1+")", function(){
        var req = {};
        req.body = param1;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg1)
        };
        assert.equal(undefined,parseable(req,null,next));
      });
    });

  });

  describe('Filter',function(){
    describe('All Operation', function(){
      var param1 = {where:{a1:{b1:{c1:1}}}};
      var expect1 = {"where":{"a1.b1.c1":1},"sort":{},"limit":defaultValues.limit,"skip":0,"keys":{}};
      it(JSON.stringify(param1) +" to "+JSON.stringify(expect1), function(){
        var req = {};
        req.query = param1;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.query);
          assert.equal(JSON.stringify(req.query),JSON.stringify(expect1));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param2 = {sort:{a:{b:{c:-1}}}};
      var expect2 = {"sort":{"a.b.c":-1},"where":{},"limit":defaultValues.limit,"skip":0,"keys":{}};
      it(JSON.stringify(param2)+" to "+JSON.stringify(expect2), function(){
        var req = {};
        req.query = param2;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.query);
          assert.equal(JSON.stringify(req.query),JSON.stringify(expect2));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param3 = {sort:{a:{b:{c:-1}}}, limit:200,skip:100};
      var expect3 = {"sort":{"a.b.c":-1},"limit":200,"skip":100,"where":{},"keys":{}};
      it(JSON.stringify(param3)+" to "+JSON.stringify(expect3), function(){
        var req = {};
        req.query = param3;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.query);
          assert.equal(JSON.stringify(req.query),JSON.stringify(expect3));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param4 = {"where":{"a1":{"b1":{"c1":{$gt:10}}}},"sort":{},"limit":100,"skip":0,"keys":"a,b,-c"};
      var expect4 = {"where":{"a1.b1.c1":{$gt:10}},"sort":{},"limit":100,"skip":0,"keys":{a:1,b:1,c:0}};
      it(JSON.stringify(param4)+" to "+JSON.stringify(expect4), function(){
        var req = {};
        req.query = param4;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.query);
          assert.equal(JSON.stringify(req.query),JSON.stringify(expect4));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param5 = {};
      var expect5 = {"where":{},"sort":{},"limit":defaultValues.limit,"skip":0,"keys":{}};
      it(JSON.stringify(param5)+" to "+JSON.stringify(expect5), function(){
        var req = {};
        req.query = param5;
        var next = function(err){
          should.not.exist(err);
          should.exist(req.query);
          assert.equal(JSON.stringify(req.query),JSON.stringify(expect5));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param6 = {where:123};
      var errorMsg6 = "SyntaxError: where";
      it(JSON.stringify(param6) + " should call next(\""+errorMsg6+"\")", function(){
        var req = {};
        req.query = param6;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg6)
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param7 = {sort:123};
      var errorMsg7 = "SyntaxError: sort";
      it(JSON.stringify(param7) + " should call next(\""+errorMsg7+"\")", function(){
        var req = {};
        req.query = param7;
        var next = function(err){
          should.exist(err);
          assert.equal(err, errorMsg7)
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param8 = {foo:"foo"};
      var expect8 = {foo:"foo", where:{},"sort":{},"limit":defaultValues.limit,"skip":0,"keys":{}};
      it(JSON.stringify(param8)+" to "+JSON.stringify(expect8), function(){
        var req = {};
        req.query = param8;

        var next = function(err){
          should.not.exist(err);
          should.exist(req.query);
          assert.equal(JSON.stringify(req.query),JSON.stringify(expect8));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

      var param9 = {keys:"foo,-koo"};
      var expect9 = {"keys":{"foo":1,"koo":0},where:{},"sort":{},"limit":defaultValues.limit,"skip":0};
      it(JSON.stringify(param9)+" to "+JSON.stringify(expect9), function(){
        var req = {};
        req.query = param9;

        var next = function(err){
          should.not.exist(err);
          should.exist(req.query);
          assert.equal(JSON.stringify(req.query),JSON.stringify(expect9));
        };
        assert.equal(undefined,parseable(req,null,next));
      });

    });
  });
});