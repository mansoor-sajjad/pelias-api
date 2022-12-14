const proxyquire = require('proxyquire').noCallThru();
const _ = require('lodash');

const apiFeaturePropertiesConfig = (alwaysIncludeCategory) => ({
  generate: () => {
    return _.isBoolean(alwaysIncludeCategory) ?
      {
        get: () => ({
          alwaysIncludeCategory: alwaysIncludeCategory
        })
      } : {
        get: (field, defaultValue) => defaultValue
      };
  }
});

const geojsonifyForConfig = (alwaysIncludeCategory) => proxyquire('../../../helper/geojsonify_place_details', {
  'pelias-config': apiFeaturePropertiesConfig(alwaysIncludeCategory)
});


module.exports.tests = {};

module.exports.tests.geojsonify_place_details = (test, common) => {
  test('category property should be output when params contains \'category\' property', t => {
    [{ a: 1 }, 'this is a string'].forEach(value => {
      const source = {
        category: value
      };
      const expected = {
        category: [value]
      };

      const clean = {
        categories: true
      };

      const actual = geojsonifyForConfig()(clean, source);

      t.deepEqual(actual, expected);

    });

    t.end();

  });

  test('category property should be output when params contains \'category\' property, ' +
    'even if the alwaysIncludeCategory is false', t => {
    [{ a: 1 }, 'this is a string'].forEach(value => {
      const source = {
        category: value
      };
      const expected = {
        category: [value]
      };

      const clean = {
        categories: true
      };

      const actual = geojsonifyForConfig(false)(clean, source);

      t.deepEqual(actual, expected);

    });

    t.end();

  });

  test('category property should not be output when params does not contain \'category\' property', t => {
    const source = {
      category: [1, 2]
    };
    const expected = {};

    const clean = {};

    const actual = geojsonifyForConfig()(clean, source);

    t.deepEqual(actual, expected);
    t.end();

  });

  test('category property should be output when params does not contain \'category\' property, ' +
    'but alwaysIncludeCategory is true', t => {
    const source = {
      category: [1, 2]
    };
    const expected = {
      category: [1, 2]
    };

    const clean = {};

    const actual = geojsonifyForConfig(true)(clean, source);

    t.deepEqual(actual, expected);
    t.end();

  });

  test('category property should not be output when params is not an object', t => {
    const source = {
      category: [1, 2]
    };
    const expected = {};

    const clean = 'this is not an object';

    const actual = geojsonifyForConfig()(clean, source);

    t.deepEqual(actual, expected);
    t.end();

  });

};

module.exports.all = (tape, common) => {

  function test(name, testFunction) {
    return tape(`geojsonify: ${name}`, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
