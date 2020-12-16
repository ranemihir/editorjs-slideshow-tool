/* eslint-disable no-undef */
const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						query: {
							presets: [ '@babel/preset-env' ],
						},
					},
					'eslint-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader?removeSVGTagAttrs=false'
			}
		]
	},
	output: {
		path: path.join(__dirname, '/dist'),
		publicPath: '/',
		filename: 'bundle.js',
		library: 'SlideshowPlugin',
		libraryTarget: 'umd',
		libraryExport: 'default'
	}
};
