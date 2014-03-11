

Graphie = function(window, id, settings) {

	var self = this,
		R = window.Raphael, // Get Raphael instance
		r = R(id, settings.width, settings.height), // Create canvas
		c = .5, // Corection coeficient
		opts = {}, // configuration object
		round = function (num, dec) {
			dec = dec || 2;
			return  Math.round( num * Math.pow( 10, dec ) ) / Math.pow( 10, dec );
		},
		getAnchors = function(p1x, p1y, p2x, p2y, p3x, p3y) {
			var l1 = (p2x - p1x) / 2,
				l2 = (p3x - p2x) / 2,
				a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
				b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
			a = p1y < p2y ? Math.PI - a : a;
			b = p3y < p2y ? Math.PI - b : b;
			var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
				dx1 = l1 * Math.sin(alpha + a),
				dy1 = l1 * Math.cos(alpha + a),
				dx2 = l2 * Math.sin(alpha + b),
				dy2 = l2 * Math.cos(alpha + b);
			return {
				x1: p2x - dx1,
				y1: p2y + dy1,
				x2: p2x + dx2,
				y2: p2y + dy2
			};
		};

	self._init = function() {
		self.grid = {};
		self.xDescItems = [];
		self.yDescItems = [];
		self.curves = [];
		return self;
	};


	// Polyfill for array check
	if(!Array.isArray) {
		Array.isArray = function (vArg) {
			var isArray;
			isArray = vArg instanceof Array;
			return isArray;
		};
	}

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

	self._setDefaults = function(settings, defaults){
		opts.width =				settings.width || defaults.width;
		opts.height =				settings.height || defaults.height;
		opts.table = {}; opts.xDesc = {}; opts.yDesc = {};
		if (!settings.table) {
			settings.table = {};
		}
		if (!settings.xDesc) {
			settings.xDesc = {};
		}
		if (!settings.yDesc) {
			settings.yDesc = {};
		}
		opts.table.paddingTop =		settings.table.paddingTop || defaults.table.paddingTop;
		opts.table.paddingRight =	settings.table.paddingRight || defaults.table.paddingRight;
		opts.table.paddingBottom =	settings.table.paddingBottom || defaults.table.paddingBottom;
		opts.table.paddingLeft =	settings.table.paddingLeft || defaults.table.paddingLeft;
		opts.table.rows =			settings.table.rows || defaults.table.rows;
		opts.table.cols =			settings.table.cols || defaults.table.cols;
		opts.table.strokeColor =	settings.table.strokeColor || defaults.table.strokeColor;
		opts.table.width =			opts.width - opts.table.paddingLeft - opts.table.paddingRight;
		opts.table.height =			opts.height - opts.table.paddingTop - opts.table.paddingBottom

		opts.xDesc.text = 			settings.xDesc.text || defaults.xDesc.text;
		opts.xDesc.dist =			settings.xDesc.dist || defaults.xDesc.dist;

		opts.yDesc.text = 			settings.yDesc.text || defaults.yDesc.text;
		opts.yDesc.dist =			settings.yDesc.dist || defaults.yDesc.dist;

		opts.line = 				defaults.line;
		opts.lineHover = 			defaults.lineHover;
	};

	self._reset = function (settings) {
		self._setDefaults(settings, self.defaults);
		r.clear();
		r.setSize(opts.width, opts.height);
		return self._init();
	}

	self._drawGrid = function () {
		var X = ( ( opts.width - opts.table.paddingLeft - opts.table.paddingRight ) / opts.table.cols ),
			Y =  ( ( opts.height - opts.table.paddingTop - opts.table.paddingBottom ) / opts.table.rows ),
			xOrigin = opts.table.paddingLeft,
			yOrigin = opts.table.paddingTop,
			tWidth = opts.table.width,
			tHeight = opts.table.height;


		self.grid = r.drawGrid( xOrigin, yOrigin, tWidth, tHeight, opts.table.cols, opts.table.rows, opts.table.strokeColor);
		return self;
	};

	self._setHorizontalDesc = function (values, cols) {
		console.log('Horizontal descriptions', values);
		cols = Array.isArray(values) ? values.length : opts.table.cols;
		var stepLength = opts.table.width / ( cols - 1 );
		if (Array.isArray(values)) {
			for (var i = 0; i < cols; i++) {
				self.xDescItems.push(
					r.text(
						opts.table.paddingLeft + ( stepLength * i ),
						opts.table.paddingTop - opts.xDesc.dist,
						values[i]).attr(opts.xDesc.text)
				);
				values[i]
			};
		} else if (typeof values === "object") {

		} else {

		}
		return self;
	};

	self._setVerticalDesc = function (values, rows) {
		console.log('Vertical descriptions:', values);
		rows = Array.isArray(values) ? values.length : opts.table.rows;
		var stepLength = opts.table.height / ( rows - 1 );
		
		if (Array.isArray(values)) {
			for (var i = 0; i < rows; i++) {
				if (!values[i]) {continue;}
				self.yDescItems.push(
					r.text(
						opts.table.paddingLeft - opts.yDesc.dist,
						opts.table.paddingTop + ( stepLength * i ),
						values[i]).attr(opts.yDesc.text)
				);
			};
		} else if (typeof values === "object") {
			// TODO Values are given as object of range and number of steps
		} else {
			// TODO
		}
		return self;
	};

	self._drawCurve = function (values, style, hoverStyle) {
		var p = [],
			xOrig = opts.table.paddingLeft,
			yOrig = opts.table.paddingTop + ( opts.table.height / 2 ),
			max = opts.table.height / 2,
			X = ( ( opts.width - opts.table.paddingLeft - opts.table.paddingRight ) / opts.table.cols ),
			style = style || opts.line,
			hStyle = hoverStyle || opts.lineHover;

		for (var i = 0; i < values.length; i++) {
			var x, x0, x2, y, y0, y1, cp1, cp2, d0X, d0Y, d2X, d2Y, a, coords, line;

			// Actual X coords, next X coords, previous X coords
			x = round( xOrig + ( X * i ) );
			x2 = round( xOrig + ( X * (i + 1) ) );
			x0 = round( xOrig + ( X * (i - 1) ) );
			x2 = !isNaN(x2) ? x2 : x;
			x0 = !isNaN(x0) ? x0 : x;
			
			// Actual Y coords, next Y coords, previous Y coords
			y = round( yOrig + ( values[i] * max ) );
			y2 = round( yOrig + ( values[i + 1] * max ) );
			y0 = round( yOrig + ( values[i - 1] * max ) );
			y2 = !isNaN(y2) ? y2 : y;
			y0 = !isNaN(y0) ? y0 : y;

			// Differences
			d0X = !isNaN(x0) ? ( x - (x - x0) / 2 ) : x;
			d0Y = !isNaN(y0) ? ( y - (y - y0) / 2 ) : y;
			d2X = !isNaN(x2) ? ( x - (x2 - x) / 2 ) : x;
			d2Y = !isNaN(y2) ? ( y - (y2 - y) / 2 ) : y;

			// console.log('x0:', x0, 'y0:', y0, 'x:', x, 'y:', y, 'x2:', x2, 'y2:', y2);
			a = getAnchors(x0, y0, x, y, x2, y2);

			coords = [a.x1, a.y1, x, y, a.x2, a.y2];
			console.log(coords);

			cp1 = a.x1  + "," + a.y1 ;
			cp2 = a.x2  + "," + a.y2 ;

			// r.circle(d0X, d0Y, 2).attr({fill: "#f00"});
			// r.circle(d2X, d2Y, 2).attr({fill: "#0f0"});

			if (i === 0) {
				p.push("M" + x + "," + y );
				p.push("C" + x + "," + y );
				// debugger;
			} else if (i + 1 === values.length) {
				p.push("L" + x + "," + y );
			} else {
				// debugger;
				p.push("C" + cp1 + "," + cp2 + "," + x + "," + y );
			}
		};
		//console.log('Path:', p.join(''));
		line = r.path(p.join('')).attr(style);
		self.curves.push(line);
		line.hover(
			function(){
				this.attr(hStyle);
			},
			function(){
				this.attr(style);
			}, line, line);
		return self;
	}

	self._init();
	self._setDefaults(settings, self.defaults);

	return self;
};

Graphie.prototype.defaults = {
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
		dist:	20,
		text: {
			"font":			"14px Arial",
			"fill":			"#333",
			"text-anchor":	"middle"
		}
	},
	yDesc: {
		dist:	10,
		text: {
			"font":			"14px Arial",
			"fill":			"#333",
			"text-anchor":	"end"
		}
	},
	line: {
		"stroke": "#aaf",
		"stroke-opacity": 0.7,
		"stroke-width": 4,
	},
	lineHover : {
		"stroke-opacity": 1
	}
};
