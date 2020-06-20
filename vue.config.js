var path = require("path");
var app_root = require("app-root-path");
const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        import: [app_root.resolve("/src/styles/global.styl")],
      },
      postcss: {},
    },
  },
  configureWebpack: {
    plugins: [
      new CircularDependencyPlugin({
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      }),
    ],
  },
};
