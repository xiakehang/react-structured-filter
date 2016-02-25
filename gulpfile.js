// Install with:  npm install gulp-util  --no-bin-link


var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.dev');

gulp.task('dev', function(callback){

   var compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
        // server and middleware options
        contentBase: './public/demo',
        publicPath: '/js/',
        stats: {
          // Config for minimal console.log mess.
          assets: true,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false
        }
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        // callback();
    });

});

gulp.task('default', ['dev']);
