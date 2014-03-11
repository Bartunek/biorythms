

Graphie = function(window, id, settings) {

	var self = this,
		R = window.Raphael,
		r = R(id, settings.width, settings.height),
		c = .5,
		opts = {};

	R.fn.drawGrid = function (x, y, w, h, colCount, rowCount, color) {
		
		var path = [
			"M",	Math.round(x)		+ c,
					Math.round(y)		+ c,
			"L",	Math.round(x + w)	+ c,
					Math.round(y)		+ c,
					Math.round(x + w)	+ c,
					Math.round(y + h)	+ c,
					Math.round(x)		+ c,
					Math.round(y + h)	+ c,
					Math.round(x)		+ c,
					Math.round(y)		+ c
			],
			rowHeight = h / rowCount,
			columnWidth = w / colCount;

		for (var i = 1; i < rowCount; i++) {
			path = path.concat([
				"M",	Math.round(x) 					+ c,
						Math.round(y + i * rowHeight) 	+ c,
				"H",	Math.round(x + w)				+ c
			]);
		}

		for (i = 1; i < colCount; i++) {
			path = path.concat([
				"M",	Math.round(x + i * columnWidth)	+ c,
						Math.round(y)					+ c,
				"V",	Math.round(y + h)				+ c
			]);
		}
		return this.path(path.join(",")).attr({stroke: color});
	};

	var defaults = {
		width: 400,
		height: 400,
		table: {
			paddingTop:		20,
			paddingRight:	0,
			paddingBottom:	0,
			paddingLeft:	30,
			rows:			5,
			cols:			15,
			strokeColor:	"#ddd"
		},
		xDesc: {
			text: {
				font:			"14px Arial",
				fill:			"#333",
				"text-anchor":	"middle"
			}
		},
		yDesc: {
			text: {
				font:			"14px Arial",
				fill:			"#333",
				"text-anchor":	"end"
			}
		}
	};

	self._setDefaults = function(settings, defaults){
		opts.width =				settings.width || defaults.width;
		opts.height =				settings.height || defaults.height;
		opts.table = {};
		if (!settings.table) {
			settings.table = {};
		}
		opts.table.paddingTop =		settings.table.paddingTop || defaults.table.paddingTop;
		opts.table.paddingRight =	settings.table.paddingRight || defaults.table.paddingRight;
		opts.table.paddingBottom =	settings.table.paddingBottom || defaults.table.paddingBottom;
		opts.table.paddingLeft =	settings.table.paddingLeft || defaults.table.paddingLeft;
		opts.table.rows =			settings.table.rows || defaults.table.rows;
		opts.table.cols =			settings.table.cols || defaults.table.cols;
		opts.table.strokeColor =	settings.table.strokeColor || defaults.table.strokeColor;

	};

	self._drawGrid = function () {
		var X = ( ( opts.width - opts.table.paddingLeft - opts.table.paddingRight ) / opts.table.cols ),
			Y =  ( ( opts.height - opts.table.paddingTop - opts.table.paddingBottom ) / opts.table.rows ),
			xOrigin = opts.table.paddingLeft,
			yOrigin = opts.table.paddingTop,
			tWidth = opts.width - opts.table.paddingLeft - opts.table.paddingRight,
			tHeight = opts.height - opts.table.paddingTop - opts.table.paddingBottom;


		r.drawGrid( xOrigin, yOrigin, tWidth, tHeight, opts.table.cols, opts.table.rows, opts.table.strokeColor);
	};

	self._setDefaults(settings, defaults);

	return self;
};
