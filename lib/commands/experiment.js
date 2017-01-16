'use strict';

var Command = require('../models/command');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var chalk = require('chalk');
var path = require('path');

module.exports = Command.extend({
  name: 'experiment',
  description: 'Experimental command with webpack',
  aliases: ['exp'],

  availableOptions: [],

  run: function(commandOptions) {
    var ui = this.ui;
    var project = this.project;

    function resolvePath(relativePath) {
      return path.resolve(project.root, relativePath);
    }

    // console.log(project.addons[0]);

    return new Promise(function (resolve, reject) {
      var compiler = webpack({
        devTool: 'eval',
        debug: true,
        entry: {
          app: resolvePath('app/app.js'),
          vendors: ['jquery', 'ember']
        },
        output: {
          filename: '[name].js',
          path: 'dist/',
          pathInfo: true
        },
        resolve: {
          root: [
            resolvePath('node_modules'),
            resolvePath('bower_components')
          ],
          alias: {
            ember$: resolvePath('app/ember.js')
          }
        },
        resolveLoader: {
          root: path.resolve(__dirname, '../../node_modules')
        },
        plugins: [
          new HtmlWebpackPlugin()
        ],
        module: {
          loaders: [
            {
              test: /\.js$/,
              include: resolvePath('app'),
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                babelrc: false,
                presets: [require.resolve('babel-preset-es2015')]
              }
            },
            { test: /\.hbs$/, loader: 'ember-templates-loader' }
          ]
        },
        node: {
          fs: 'empty'
        }
      });

      compiler.run(function(err, stats) {
        if (err) {
          ui.writeLine(chalk.red('Error'));

          return reject(err);
        }

        // console.log(project);
        ui.writeLine(chalk.green('Build done'));

        resolve();
      });
    });
  }
});
