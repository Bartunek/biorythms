
Bio = function (bday, actdate, accuracy, range) {

	var self = this,
		now = new Date(Date.now()),
		dayLength = 86400000,
		bDay, actDate, daysFromBirth,
		acc = accuracy || 2,
		range = range || 1,
		roundNum = function (num, dec) {
			return  Math.round( num * Math.pow( 10, dec ) ) / Math.pow( 10, dec );
		};


	self.init = function (bday, actdate, range) {
		if (typeof bday.getDate() === 'number'){
			bDay = bday;
		} else {
			console.log("Nebylo zadáno datum narození");
			return false;
		}
		actDate = actdate ? actdate - dayLength : new Date(now.getFullYear(), now.getMonth(), now.getDate()) - dayLength;
		daysFromBirth = Math.round( ( actDate - bDay ) / dayLength);
		console.log(new Date(actdate));
	};

	self.getDate = function () {
		return actDate;
	};

	self.setDate = function (date) {
		if (typeof date.getDate() === 'number'){
			console.log(date);
			actDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()) - dayLength;
			daysFromBirth = Math.round( ( actDate - bDay ) / dayLength);
		} else {
			console.log("Nebylo zadáno datum narození");
			return false;
		}
		return self;
	};

	self._setAccuracy = function (accuracy) {
		acc = !isNaN(parseInt(accuracy, 10)) ? parseInt(accuracy) : acc;
		return self;
	};

	self.getPhysical = function ( coef, days) {
		coef = coef || range;
		return roundNum( coef * Math.sin( ( ( daysFromBirth % 23 ) * 2 * Math.PI ) / 23 ), acc);
	};

	self.getEmotional = function ( coef, days) {
		coef = coef || range;
		return roundNum( coef * Math.sin( ( ( daysFromBirth % 28 ) * 2 * Math.PI ) / 28 ), acc);
	};

	self.getIntelectual = function ( coef, days) {
		coef = coef || range;
		return roundNum( coef * Math.sin( ( ( daysFromBirth % 33 ) * 2 * Math.PI ) / 33 ), acc);
	};

	// console.log(daysFromBirth);
	// console.log(arguments);

	self.init(bday, actdate, range);
	return self;
};


$(document).ready(function() {
		
	var $input = $(this).find('#js-date'),
		$actual = $(this).find('#js-actual'),
		$btn = $(this).find('#js-submit'),
		date = $input.val(),
		act = $actual.val(),
		year = date.substr(0, 4),
		month = date.substr(5, 2),
		day = date.substr(8),
		actYear = act.substr(0, 4),
		actMonth = act.substr(5, 2),
		actDay = act.substr(8);
		
	var bio = new Bio(new Date(year, month, day), new Date(actYear, actMonth, actDay));
	
	$('form').on('submit', function(event) {
		event.preventDefault();
		
		act = $(this).find('#js-actual').val();
		actYear = act.substr(0, 4);
		actMonth = act.substr(5, 2);
		actDay = act.substr(8);

		bio.setDate( new Date(actYear, actMonth, actDay) );
		console.log("bday:", $input.val(), "actual:", $actual.val());
		console.log(bio.getDate());

		$('.js-phy').text(bio.getPhysical(100));
		$('.js-emo').text(bio.getEmotional(100));
		$('.js-int').text(bio.getIntelectual(100));

	});

	$('#js-actual').on('change', function(event) {
		event.preventDefault();
		var act = $(this).val();
		actYear = act.substr(0, 4);
		actMonth = act.substr(5, 2);
		actDay = act.substr(8);

		bio.setDate( new Date(actYear, actMonth, actDay) );
		console.log(bio.getDate());

		$('.js-phy').text(bio.getPhysical(100));
		$('.js-emo').text(bio.getEmotional(100));
		$('.js-int').text(bio.getIntelectual(100));

	});

	$('form').trigger('submit');

	var settings = {
		width: $('#canvas').innerWidth(),
		height: $('#canvas').innerHeight(),
		table: {
			paddingTop: 40,
			paddingLeft: 60,
			paddingRight: 20,
			paddingBottom: 20,
			rows: 4,
			cols: 26
		}
	},
	emoStyle = {
		"stroke": "#fa5ab9",
		"stroke-opacity": 0.7,
		"stroke-width": 4
	},
	intStyle = {
		"stroke": "#00cdc3",
		"stroke-opacity": 0.7,
		"stroke-width": 4
	},
	phyStyle = {
		"stroke": "#9b81de",
		"stroke-opacity": 0.7,
		"stroke-width": 4
	},
	yDescriptions = ["100%", "50%", "0%", "-50%", "-100%"],
	xDescriptions = [],
	emoVals = [],
	intVals = [],
	phyVals = [], dateVals = [],
	dayLength = 86400000,
	days = settings.table.cols,
	daysHalf = Math.abs(days / 2);

/*
	for (var i = 1; i < settings.table.cols + 2; i++) {
		if ( i > 2 && i < settings.table.cols){
			xDescriptions.push(i + ".");
		} else {
			xDescriptions.push("");
		}
	};
*/
	bio._setAccuracy(4);

	var thisDay = new Date(Date.now());
	for (var i = -(daysHalf), j = 0; i <= daysHalf; i++, j++) {
		console.log("i:", i, "j:", j);
		
		var date = new Date( Date.UTC(thisDay.getFullYear(), thisDay.getMonth() + 1, thisDay.getDate()) + (i * dayLength) + dayLength ),
			txt = date.getDate();
		xDescriptions.push(txt += '.');
		console.log('Date:', date, 'Year:', date.getFullYear());

		if (i === 0) {
			//debugger;
		};

		dateVals.push(date);
		console.log(date);
		bio.setDate(date);

		emoVals.push(bio.getEmotional());
		intVals.push(bio.getIntelectual());
		phyVals.push(bio.getPhysical());
	};
	console.log("Date values", dateVals);

	var g = new Graphie(window, "canvas", settings);

	var roundNum = function (num, dec) {
			return  Math.round( num * Math.pow( 10, dec ) ) / Math.pow( 10, dec );
		},
		changeValues = function(i){
			console.log('Selected item:', i, 'Date:', dateVals[i]);

			$('.js-phy').text( roundNum(phyVals[i] * 100, 2) );
			$('.js-emo').text( roundNum(emoVals[i] * 100, 2) );
			$('.js-int').text( roundNum(intVals[i] * 100, 2) );
		};

	g	._drawGrid()
		._setVerticalDesc(yDescriptions)
		._setHorizontalDesc(xDescriptions)
		._drawCurve(emoVals, emoStyle)
		._drawCurve(intVals, intStyle)
		._drawCurve(phyVals, phyStyle)
		._setMaskFn(changeValues);

	$(window).on('resize', function(event) {
		settings.width = $('#canvas').innerWidth();
		settings.height = $('#canvas').innerHeight();
		g	._reset(settings)
			._drawGrid()
			._setVerticalDesc(yDescriptions)
			._setHorizontalDesc(xDescriptions)
			._drawCurve(emoVals, emoStyle)
			._drawCurve(intVals, intStyle)
			._drawCurve(phyVals, phyStyle);
	});

});