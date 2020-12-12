const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const baseConfig = require('./webpack.common.js');

const CONF_PATH = path.join(__dirname, 'config');
const config = yaml.safeLoad(fs.readFileSync(path.join(CONF_PATH, 'app.yml')), 'utf8');

const { app, server } = config;

const devPort = app.port;
const host = app.host;
const publicUrl = app.publicUrl;

const proxyHttp = server.http;
const proxyWs = server.ws;
const proxyEnabeld = server.enabled;

module.exports = merge(baseConfig, {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: {
		app: [
			'@babel/polyfill',
			'react-hot-loader/patch',
			`webpack-dev-server/client?http://${host}:${devPort}`,
			'webpack/hot/only-dev-server',
			path.resolve(__dirname, 'src/index.tsx'),
		],
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		publicPath: publicUrl,
		filename: '[name].[hash:16].js',
		chunkFilename: '[id].[hash:16].js',
	},
	devServer: {
		inline: true,
		port: devPort,
		contentBase: path.resolve(__dirname, 'public'),
		hot: true,
		publicPath: publicUrl,
		historyApiFallback: true,
		host,
		open: true,
		proxy: proxyEnabeld
			? {
					'/ext': {
						target: proxyHttp,
					},
					'/api': {
						target: proxyHttp,
					},
					'/api/ws': {
						target: proxyWs,
						ws: true,
					},
			  }
			: undefined,
		headers: {
			'X-Frame-Options': 'sameorigin', // used iframe
		},
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // HMR을 사용하기 위한 플러그인
	],
});
