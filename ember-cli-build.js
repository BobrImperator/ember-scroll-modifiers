'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let addonOptions = {};

  if (process.env.DETECT_MEMORY_LEAKS === 'true') {
    addonOptions['ember-cli-terser'] = {
      terser: {
        compress: { keep_classnames: true },
        mangle: { keep_classnames: true },
      },
    };

    addonOptions['ember-cli-memory-leak-detector'] = {
      enabled: true,
      failTests: false,
      ignoreClasses: [],
      remoteDebuggingPort: '9222',
      timeout: 90000,
      writeSnapshot: false,
    };
  }

  const app = new EmberAddon(defaults, addonOptions);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    staticComponents: false,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
