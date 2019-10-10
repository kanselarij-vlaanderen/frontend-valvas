'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'frontend-valvas',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    moment: {
      allowEmpty: true,
      includeLocales: ['nl-be'],
      includeTimezone: 'all'
    },
    'vo-webuniversum': {
      header: '//tni.widgets.burgerprofiel.dev-vlaanderen.be/api/v1/widget/252b8537-c7d4-4795-b5b9-172a8041c839/embed',
      footer: '//tni.widgets.burgerprofiel.dev-vlaanderen.be/api/v1/widget/50e798c1-2fb1-42e3-93d7-a99c0be2e6bc/embed'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if (process.env.DEPLOY_ENV === 'production') {
    ENV['vo-webuniversum']['header'] = '//prod.widgets.burgerprofiel.vlaanderen.be/api/v1/widget/48061525-8c17-44e2-b446-45d8d2030943/embed';
    ENV['vo-webuniversum']['footer'] = '//prod.widgets.burgerprofiel.vlaanderen.be/api/v1/widget/cfa02882-3603-4850-b5d3-d75ce48994d2/embed';
  }

  return ENV;
};
