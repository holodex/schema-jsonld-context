var test = require('tape');

var schemaJsonldContext;

test("require module", function (t) {
  schemaJsonldContext = require('../');
  t.ok(schemaJsonldContext);
  t.end();
});

test("non schemas", function (t) {
  t.equal(schemaJsonldContext(true), null, "true is not schema");
  t.equal(schemaJsonldContext(false), null, "false is not schema");
  t.equal(schemaJsonldContext(null), null, "null is not schema");
  t.equal(schemaJsonldContext(undefined), null, "undefined is not schema");
  t.equal(schemaJsonldContext([1,2,3]), null, "array is not schema");
  t.equal(schemaJsonldContext("123"), null, "string is not schema");
  t.equal(schemaJsonldContext(123), null, "number is not schema");
  t.end();
});

test("empty schema", function (t) {
  t.deepEqual(schemaJsonldContext({}), {}, "context of empty schema is correct");
  t.end();
});

test("simple schemas", function (t) {
  t.deepEqual(schemaJsonldContext({
    id: "http://example.org/Person#",
    prefixes: {
      "": "http://open.vocab/",
    },
    context: "Person",
  }), {
    "@vocab": "http://open.vocab/",
  }, "context of person schema is correct");
  t.deepEqual(schemaJsonldContext({
    id: "http://example.org/Person#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Person",
  }), {
    vocab: "http://open.vocab/",
    Person: "vocab:Person",
  }, "context of person schema is correct");
  t.end();
});

test("schemas with properties", function (t) {
  t.deepEqual(schemaJsonldContext({
    id: "http://example.org/Person#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Person",
    properties: {
      name: {
        context: "vocab:name",
        type: "string",
      },
      bio: {
        context: "vocab:description",
        type: "string",
      },
    },
  }), {
    vocab: "http://open.vocab/",
    Person: "vocab:Person",
    name: "vocab:name",
    bio: "vocab:description",
  }, "context of person schema with properties is correct");
  t.end();
});

test("allOf/anyOf/oneOf schemas", function (t) {
  t.deepEqual(schemaJsonldContext({
    id: "http://example.org/Agent#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Agent",
    oneOf: [{
      id: "http://example.org/Person#",
      prefixes: {
        vocab: "http://open.vocab/",
      },
      context: "vocab:Person",
    }, {
      id: "http://example.org/Group#",
      prefixes: {
        org: "http://org.vocab/",
      },
      context: "org:Organization",
    }],
  }), {
    vocab: "http://open.vocab/",
    org: "http://org.vocab/",
    Agent: "vocab:Agent",
    Person: "vocab:Person",
    Group: "org:Organization",
  }, "context of agent schema is correct");
  t.end();
});

test("allOf/anyOf/oneOf with properties schemas", function (t) {
  t.deepEqual(schemaJsonldContext({
    id: "http://example.org/Agent#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Agent",
    oneOf: [{
      id: "http://example.org/Person#",
      prefixes: {
        vocab: "http://open.vocab/",
      },
      context: "vocab:Person",
      properties: {
        name: {
          context: "vocab:name",
        },
        bio: {
          context: "vocab:description",
        },
      },
    }, {
      id: "http://example.org/Group#",
      prefixes: {
        org: "http://org.vocab/",
      },
      context: "org:Organization",
      properties: {
        name: {
          context: "vocab:name",
        },
        description: {
          context: "vocab:description",
        },
      },
    }],
  }), {
    vocab: "http://open.vocab/",
    org: "http://org.vocab/",
    Agent: "vocab:Agent",
    Person: "vocab:Person",
    Group: "org:Organization",
    name: "vocab:name",
    bio: "vocab:description",
    description: "vocab:description",
  }, "context of agent schema is correct");
  t.end();
});
