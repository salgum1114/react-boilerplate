const fs = require('fs-extra');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const yaml = require('js-yaml');

const baseConfig = require('./webpack.common.js');

const CONF_PATH = path.join(__dirname, 'config');
const config = yaml.safeLoad(fs.readFileSync(path.join(CONF_PATH, 'app.yml')), 'utf8');

fs.copySync('public', 'dist');

const { app } = config;

const plugins = [
	new webpack.LoaderOptionsPlugin({
		minimize: true,
	}),
	new WorkboxPlugin.GenerateSW({
		swDest: 'sw.js',
		skipWaiting: true,
		clientsClaim: true,
	}),
];

module.exports = merge(baseConfig, {
	mode: 'production',
	entry: {
		app: ['@babel/polyfill', path.resolve(__dirname, 'src/index.tsx')],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[chunkhash:16].js',
		chunkFilename: 'js/[id].[chunkhash:16].js',
		publicPath: app.publicUrl,
	},
	optimization: {
		minimizer: [
			// we specify a custom UglifyJsPlugin here to get source maps in production
			new TerserPlugin({
				cache: true,
				parallel: true,
				terserOptions: {
					warnings: false,
					compress: {
						warnings: false,
						unused: true, // tree shaking(export된 모듈 중 사용하지 않는 모듈은 포함하지않음)
					},
					ecma: 5,
					mangle: true,
					unused: true,
				},
				sourceMap: true,
			}),
		],
	},
	plugins,
});
