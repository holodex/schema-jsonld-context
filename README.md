# schema-jsonld-context

returns a [jsonld](http://json-ld.org) `@context` from a [json-schema](http://json-schema.org) with `prefixes` and `context` properties.

supports

- [x] properties
- [ ] additionalProperties
- [ ] patternProperties
- [x] allOf
- [x] anyOf
- [x] oneOf
- [ ] not
- [ ] definitions
- [x] items schema
- [ ] items array of schemas
- [ ] additionalItems

pull requests welcome!

## install

with [npm](http://npmjs.org), do:

```
npm i --save schema-jsonld-context
```

## example

```
var schemaJsonldContext = require('schema-jsonld-context');

var personSchema = {
  id: "http://example.org/schemas/Person.json#",
  prefixes: {
    "": "http://schema.org/",
    "foaf": "http://xmlns.com/foaf/0.1/",
  },
  context: "foaf:Person",
  properties: {
    name: {
      context: "name",
      type: "string",
    },
    nick: {
      context: "foaf:nick",
      type: "string",
    },
  },
};

var personContext = schemaJsonldContext(personSchema);

console.log(JSON.stringify(personContext, null, 2));
// {
//  "@vocab": "http://schema.org/",
//  "foaf": "http://xmlns.com/foaf/0.1/",
//  "Person": "foaf:Person",
//  "nick": "foaf:nick"
// }
```

## license

AGPLv3
