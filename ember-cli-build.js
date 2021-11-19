'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    flatpickr: {
      locales: ['nl'],
    },
    'ember-cli-babel': {
      includePolyfill: true,
    },
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('node_modules/url-polyfill/url-polyfill.min.js');
  app.import('node_modules/@govflanders/vl-widget-client/dist/index.js');
  app.import('node_modules/@govflanders/vl-widget-polyfill/dist/index.js');

  return app.toTree();
};
