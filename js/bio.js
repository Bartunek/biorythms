Bio = function (bday, actdate, accuracy, range) {

	range = range || 1;
	var self = this,
		now = new Date(Date.now()),
		dayLength = 86400000,
		bDay, actDate, daysFromBirth,
		acc = accuracy || 2,
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
		actDate = actdate ? actdate : new Date(now.getFullYear(), now.getMonth(), now.getDate());
		daysFromBirth = Math.round( ( actDate - bDay ) / dayLength );
		console.log(new Date(actdate));
	};

	self.getDate = function () {
		return actDate;
	};

	self.setDate = function (date) {
		if (typeof date.getDate() === 'number'){
			actDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			console.log('Set date to: ', actDate, 'bDay: ', bDay, '\n');

			daysFromBirth = Math.round( ( actDate - bDay ) / dayLength );

			console.log('daysFromBirth: ', daysFromBirth, '\n');
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