
Bio = function (bday, actdate, range) {

	var self = this,
		now = new Date(Date.now()),
		dayLength = 86400000,
		bDay, actDate, daysFromBirth,
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
		range = range || 1;
		actDate = actdate ? actdate - dayLength : new Date(now.getYear(), now.getMonth(), now.getDate()) - dayLength;
		daysFromBirth = Math.round( ( actDate - bDay ) / dayLength);
	};

	self.getDate = function () {
		return actDate;
	};

	self.setDate = function (date) {
		if (typeof date.getDate() === 'number'){
			console.log(date);
			actDate = date - dayLength;
			daysFromBirth = Math.round( ( actDate - bDay ) / dayLength);
		} else {
			console.log("Nebylo zadáno datum narození");
			return false;
		}
		return this;
	};

	self.getPhysical = function (days) {
		return roundNum( 100 * Math.sin( ( ( daysFromBirth % 23 ) * 2 * Math.PI ) / 23 ), 6);
	};

	self.getEmotional = function (days) {
		return roundNum( 100 * Math.sin( ( ( daysFromBirth % 28 ) * 2 * Math.PI ) / 28 ), 6);
	};

	self.getIntelectual = function (days) {
		return roundNum( 100 * Math.sin( ( ( daysFromBirth % 33 ) * 2 * Math.PI ) / 33 ), 6);
	};

	console.log(daysFromBirth);
	console.log(arguments);

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

		console.log("bday:", $input.val(), "actual:", $actual.val());
		console.log("day:", day, "month:", month, "year:", year);

		$('.js-phy').text(bio.getPhysical());
		$('.js-emo').text(bio.getEmotional());
		$('.js-int').text(bio.getIntelectual());

	});

	$('#js-actual').on('change', function(event) {
		event.preventDefault();
		act = $(this).val();
		actYear = act.substr(0, 4);
		actMonth = act.substr(5, 2);
		actDay = act.substr(8);

		bio.setDate( new Date(actYear, actMonth, actDay) );

		$('.js-phy').text(bio.getPhysical());
		$('.js-emo').text(bio.getEmotional());
		$('.js-int').text(bio.getIntelectual());

	});

	$('form').trigger('submit');

	var settings = {
		width: $('#canvas').innerWidth(),
		height: $('#canvas').innerHeight(),
		table: {
			paddingTop: 40,
			paddingLeft: 40,
			paddingRight: 20,
			paddingBottom: 20,
			rows: 4,
			cols: 25
		}
	};
	var g = new Graphie(window, "canvas", settings);

	g._drawGrid();

});