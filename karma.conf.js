module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      "bower_components/angular/angular.js",
      "bower_components/angular-mocks/angular-mocks.js",
      "bower_components/angular-bootstrap/ui-bootstrap.min.js",
      "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
      "src/index.coffee",
      "tests/index.coffee"
    ],
    preprocessors: {
      "src/index.coffee": "coffee",
      "tests/index.coffee": "coffee"
    },
    port: 8080,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    singleRun: true
  });
};
