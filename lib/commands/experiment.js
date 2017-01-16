'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk');
const path = require('path');
const Command = require('../models/command');
const Promise = require('../../lib/ext/promise');

module.exports = Command.extend({
  name: 'experiment',
  description: 'Experimental command with webpack',
  aliases: ['exp'],

  availableOptions: [],

  run(commandOptions) {
    const ui = this.ui;
    const project = this.project;

    function resolvePath(relativePath) {
      return path.resolve(project.root, relativePath);
    }

    // console.log(project.addons[0]);

    return new Promise((resolve, reject) => {
      const compiler = webpack({
        entry: {
          app: resolvePath('app/app.js'),
          vendors: ['jquery', 'ember'],
        },
        output: {
          filename: '[name].js',
          path: 'dist/',
          pathinfo: true,
        },
        resolve: {
          modules: [
            resolvePath('node_modules'),
          ],
          alias: {
            ember$: 'ember-source',
          },
        },
        resolveLoader: {
          modules: [
            path.resolve(__dirname, '../../node_modules'),
          ],
        },
        plugins: [
          new HtmlWebpackPlugin(),
        ],
        module: {
          rules: [
            {
              test: /\.js$/,
              include: resolvePath('app'),
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [require.resolve('babel-preset-es2015')],
              },
            },
            { test: /\.hbs$/, loader: 'ember-templates-loader' },
          ],
        },
        node: {
          fs: 'empty',
          net: 'empty',
          setimmediate: 'empty',
        },
      });

      compiler.run((err) => {
        if (err) {
          ui.writeLine(chalk.red('Error'));

          return reject(err);
        }

        // console.log(project);
        ui.writeLine(chalk.green('Build done'));

        resolve();
      });
    });
  },
});
