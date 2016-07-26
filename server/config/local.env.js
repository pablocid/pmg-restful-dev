'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: 'pmgrestfulapi-secret',

  FACEBOOK_ID: 'app-id',
  FACEBOOK_SECRET: 'secret',

  TWITTER_ID: 'app-id',
  TWITTER_SECRET: 'secret',

  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',

  AWS_ACCESS_KEY_ID: 'AKIAIUMTBENYRPDCHJ7Q',
  AWS_SECRET_ACCESS_KEY: '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',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
//# sourceMappingURL=local.env.js.map
