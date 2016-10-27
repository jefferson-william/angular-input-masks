define(function () {
	'use strict';
	
	return {
		maxNumber: function(ctrl, value, limit) {
			var max = parseFloat(limit, 10);
			return ctrl.$isEmpty(value) || isNaN(max) || value <= max;
		},
		minNumber: function(ctrl, value, limit) {
			var min = parseFloat(limit, 10);
			return ctrl.$isEmpty(value) || isNaN(min) || value >= min;
		}
	};
});
