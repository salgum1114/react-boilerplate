const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const fs = require('fs-extra');
const lessToJs = require('less-vars-to-js');
const yaml = require('js-yaml');

const CONF_PATH = path.join(__dirname, 'config');
const config = yaml.safeLoad(fs.readFileSync(path.join(CONF_PATH, 'app.yml')), 'utf8');

const { app } = config;

const isProduction = process.env.NODE_ENV === 'production';

const paletteLess = fs.readFileSync('./src/styles/core/theme.less', 'utf8');
const variables = lessToJs(paletteLess);
const options = {
	antDir: path.join(__dirname, './node_modules/antd'),
	stylesDir: path.join(__dirname, './src/styles'),
	varFile: path.join(__dirname, './src/styles/core/theme.less'),
	mainLessFile: path.join(__dirname, './src/styles/index.less'),
	themeVariables: Object.keys(variables),
	indexFileName: 'index.html',
	generateOnce: false,
};

module.exports = {
	entry: {
		moment: 'moment',
		lodash: 'lodash',
		vendor: ['react', 'react-dom', 'react-router-dom'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|tsx|ts)$/,
				loader: 'babel-loader',
				include: path.resolve(__dirname, 'src'),
				exclude: [/node_modules/],
				options: {
					cacheDirectory: true,
					babelrc: false,
					presets: [
						[
							'@babel/preset-env',
							{
								modules: false,
								useBuiltIns: 'usage',
								corejs: 3,
								targets: { browsers: ['last 5 versions', 'ie >= 11'], node: 'current' },
							},
						],
						'@babel/preset-react',
						'@babel/preset-typescript',
					],
					plugins: [
						'@babel/plugin-transform-runtime',
						'@babel/plugin-syntax-dynamic-import',
						['@babel/plugin-proposal-decorators', { legacy: true }],
						'@babel/plugin-syntax-async-generators',
						['@babel/plugin-proposal-class-properties', { loose: false }],
						'@babel/plugin-proposal-object-rest-spread',
						'@babel/plugin-transform-spread',
						'react-hot-loader/babel',
						'dynamic-import-webpack',
						['import', { libraryName: 'antd', style: true }],
					],
				},
			},
			{
				test: /\.(js|jsx|tsx|ts)?$/,
				include: /node_modules/,
				use: ['react-hot-loader/webpack'],
			},
			{
				test: /\.(css|less)$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true,
							modifyVars: variables,
						},
					},
				],
			},
			{
				test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader',
				options: {
					name: 'fonts/[hash].[ext]',
					limit: 10000,
				},
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			PUBLIC_URL: isProduction ? JSON.stringify(app.publicUrl) : JSON.stringify('/'),
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			title: '',
		}),
		new HtmlWebpackPlugin({
			filename: '404.html',
			title: '',
		}),
		new AntDesignThemePlugin(options),
	],
	optimization: {
		moduleIds: 'hashed',
		runtimeChunk: 'single',
		splitChunks: {
			minSize: 30000,
			cacheGroups: {
				common: {
					chunks: 'all',
					minChunks: 2,
					maxInitialRequests: 5, // The default limit is too small to showcase the effect
					priority: 20,
				},
				vendor: {
					test: /node_modules/,
					name: 'vendor',
					enforce: true,
					chunks: 'all',
					priority: 10,
				},
			},
		},
		noEmitOnErrors: true,
	},
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.less'],
	},
	node: {
		net: 'empty',
		fs: 'empty',
		tls: 'empty',
	},
};
