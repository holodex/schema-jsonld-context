var extend = require('xtend');

var isSchema = require('schema-is-schema');

var normalizeId = require('./lib/normalizeId');

module.exports = function jsonldContext (schema) {
  // if not schema, then no context
  if (isSchema(schema) !== true) return null;

  return schemaToContext(schema);
};

function schemaToContext (schema, name) {
  // create context to return
  var context = {};

  // prefixes
  for (var key in schema.prefixes) {
    var val = schema.prefixes[key];
    if (typeof key === 'string' && key.length === 0) {
      key = "@vocab";
    }
    context[key] = val;
  }

  // if has id, use normlized id as name
  if (schema.id) {
    name = normalizeId(schema.id);
  }

  // current level context
  if (schema.context) {
    context[name] = schema.context;
  }

  // if schema composed of many schemas, recurse into each and combine with extend
  var manySchema = schema.allOf || schema.anyOf || schema.oneOf;
  if (manySchema) {
    var manyContexts = manySchema.map(function (aSchema) {
      return schemaToContext(aSchema, name);
    })
    context = extend.apply(this, [context].concat(manyContexts));
  }

  // if array of items, recurse into items schema
  if (schema.type === 'array' && schema.items) {
    context = extend(context, schemaToContext(schema.items, name));
  }

  // property contexts
  for (var key in schema.properties) {
    var val = schema.properties[key];
    if (val.context) {
      context = extend(context, schemaToContext(val, key));
    }
  };

  // strip when key, value is the same
  for (var key in context) {
    if (key === context[key]) {
      delete context[key];
    }
  }

  return context;
}
