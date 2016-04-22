var path = require('path');

module.exports = {
	context: __dirname + '/src',
	entry: {
		main: '../public/main'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js'
	},
	module: {
		loaders: [
		{
			test: /\.js|\.jsx/,
			loader: 'babel',
			query: {compact: false}
		},
		{ test: /\.css$/, loader: 'style-loader!css-loader' },
		{
			test: /taffy\-min/,
			loader: 'exports?TAFFY'
		}]
	},
	resolve: {
		root: path.resolve('./'),
		extensions: ['', '.js', '.jsx'],
	}

}