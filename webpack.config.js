// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var nodeExternals = require('webpack-node-externals');

module.exports = [
{
	watch: true,
	entry: './js/react/CarDashboard.js',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
					// options: {
					// 	presets: ['@babel/preset-env']
					// }
				}
			}
		]
	},
	resolve: {
		extensions: ['*', '.js']
	},
	output: {
		path: __dirname + '/public/js',
		publicPath: '/',
		filename: 'CarDashboard.js'
	},
	mode: 'development'
},{
	watch: true,
	entry: './js/react/OverwatchDashboard.js',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
					// options: {
					// 	presets: ['@babel/preset-env']
					// }
				}
			}
		]
	},
	resolve: {
		extensions: ['*', '.js']
	},
	output: {
		path: __dirname + '/public/js',
		publicPath: '/',
		filename: 'OverwatchDashboard.js'
	},
	mode: 'development'
},{
	watch: true,
	entry: './js/react/ScatterplotPorsches.js',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader']
			}
		]
	},
	resolve: {
		extensions: ['*', '.js']
	},
	output: {
		path: __dirname + '/public/js',
		publicPath: '/',
		filename: 'ScatterplotPorsches.js'
	},
	mode: 'development'
},{
	watch: true,
	entry: './js/react/ScatterplotCraigslist.js',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader']
			}
		]
	},
	resolve: {
		extensions: ['*', '.js']
	},
	output: {
		path: __dirname + '/public/js',
		publicPath: '/',
		filename: 'ScatterplotCraigslist.js'
	},
	mode: 'development'
},{
	watch: true,
	entry: './js/react/ScatterplotFacebook.js',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader']
			}
		]
	},
	resolve: {
		extensions: ['*', '.js']
	},
	output: {
		path: __dirname + '/public/js',
		publicPath: '/',
		filename: 'ScatterplotFacebook.js'
	},
	mode: 'development'
}
]