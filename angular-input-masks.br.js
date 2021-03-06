define('angular-input-masks', ['angular', 'moment', 'string-mask', 'mask-factory', 'br-validations', 'validators'], function (angular, moment, StringMask, maskFactory, BrV, validators) {

(function (window, angular, undefined) {
	
	'use strict';

	angular.module('ui.utils.masks.br', ['ui.utils.masks.helpers'])
		.directive('uiBrBoletoBancarioMask', BoletoBancarioDirective)
		.directive('uiBrCepMask', CepDirective)
		.directive('uiBrCnpjMask', CnpjDirective)
		.directive('uiBrCpfMask', CpfDirective)
		.directive('uiBrCpfcnpjMask', CpfCnpjDirective)
		.directive('uiBrIeMask', BrIeMaskDirective)
		.directive('uiNfeAccessKeyMask', NfeDirective)
		.directive('uiBrCarPlateMask', CarPlateDirective)
		.directive('uiBrPhoneNumber', BrPhoneDirective);

	function BoletoBancarioDirective() {
		var boletoBancarioMask = new StringMask('00000.00000 00000.000000 00000.000000 0 00000000000000');

		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.replace(/[^0-9]/g, '').slice(0, 47);
			},
			format: function(cleanValue) {
				if (cleanValue.length === 0) {
					return cleanValue;
				}

				return boletoBancarioMask.apply(cleanValue).replace(/[^0-9]$/, '');
			},
			validations: {
				brBoletoBancario: function(value) {
					return value.length === 47;
				}
			}
		});
	}

	function CepDirective() {
		var cepMask = new StringMask('00000-000');

		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.toString().replace(/[^0-9]/g, '').slice(0, 8);
			},
			format: function(cleanValue) {
				return (cepMask.apply(cleanValue) || '').replace(/[^0-9]$/, '');
			},
			validations: {
				cep: function(value) {
					return value.length === 8 || value.length === 9;
				}
			}
		});
	}

	var BrV = require('br-validations');

	function CnpjDirective() {
		var cnpjPattern = new StringMask('00.000.000\/0000-00');

		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.replace(/[^\d]/g, '').slice(0, 14);
			},
			format: function(cleanValue) {
				return (cnpjPattern.apply(cleanValue) || '').trim().replace(/[^0-9]$/, '');
			},
			validations: {
				cnpj: function(value) {
					return BrV.cnpj.validate(value);
				}
			}
		});
	}

	function CpfDirective() {
		var cpfPattern = new StringMask('000.000.000-00');
	
		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.replace(/[^\d]/g, '').slice(0, 11);
			},
			format: function(cleanValue) {
				return (cpfPattern.apply(cleanValue) || '').trim().replace(/[^0-9]$/, '');
			},
			validations: {
				cpf: function(value) {
					return BrV.cpf.validate(value);
				}
			}
		});
	}

	function CpfCnpjDirective() {
		var cnpjPattern = new StringMask('00.000.000\/0000-00');
		var cpfPattern = new StringMask('000.000.000-00');

		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.replace(/[^\d]/g, '').slice(0, 14);
			},
			format: function(cleanValue) {
				var formatedValue;

				if (cleanValue.length > 11) {
					formatedValue = cnpjPattern.apply(cleanValue);
				} else {
					formatedValue = cpfPattern.apply(cleanValue) || '';
				}

				return formatedValue.trim().replace(/[^0-9]$/, '');
			},
			validations: {
				cpf: function(value) {
					return value.length > 11 || BrV.cpf.validate(value);
				},
				cnpj: function(value) {
					return value.length <= 11 || BrV.cnpj.validate(value);
				}
			}
		});
	}

	BrIeMaskDirective.$inject = ['$parse'];
	
	function BrIeMaskDirective($parse) {
		var ieMasks = {
			'AC': [{mask: new StringMask('00.000.000/000-00')}],
			'AL': [{mask: new StringMask('000000000')}],
			'AM': [{mask: new StringMask('00.000.000-0')}],
			'AP': [{mask: new StringMask('000000000')}],
			'BA': [{chars: 8, mask: new StringMask('000000-00')},
				{mask: new StringMask('0000000-00')}],
			'CE': [{mask: new StringMask('00000000-0')}],
			'DF': [{mask: new StringMask('00000000000-00')}],
			'ES': [{mask: new StringMask('00000000-0')}],
			'GO': [{mask: new StringMask('00.000.000-0')}],
			'MA': [{mask: new StringMask('000000000')}],
			'MG': [{mask: new StringMask('000.000.000/0000')}],
			'MS': [{mask: new StringMask('000000000')}],
			'MT': [{mask: new StringMask('0000000000-0')}],
			'PA': [{mask: new StringMask('00-000000-0')}],
			'PB': [{mask: new StringMask('00000000-0')}],
			'PE': [{chars: 9, mask: new StringMask('0000000-00')},
				{mask: new StringMask('00.0.000.0000000-0')}],
			'PI': [{mask: new StringMask('000000000')}],
			'PR': [{mask: new StringMask('000.00000-00')}],
			'RJ': [{mask: new StringMask('00.000.00-0')}],
			'RN': [{chars: 9, mask: new StringMask('00.000.000-0')},
				{mask: new StringMask('00.0.000.000-0')}],
			'RO': [{mask: new StringMask('0000000000000-0')}],
			'RR': [{mask: new StringMask('00000000-0')}],
			'RS': [{mask: new StringMask('000/0000000')}],
			'SC': [{mask: new StringMask('000.000.000')}],
			'SE': [{mask: new StringMask('00000000-0')}],
			'SP': [{mask: new StringMask('000.000.000.000')},
				{mask: new StringMask('-00000000.0/000')}],
			'TO': [{mask: new StringMask('00000000000')}]
		};

		function clearValue(value) {
			if (!value) {
				return value;
			}

			return value.replace(/[^0-9]/g, '');
		}

		function getMask(uf, value) {
			if (!uf || !ieMasks[uf]) {
				return;
			}

			if (uf === 'SP' && /^P/i.test(value)) {
				return ieMasks.SP[1].mask;
			}

			var masks = ieMasks[uf];
			var i = 0;
			while (masks[i].chars && masks[i].chars < clearValue(value).length && i < masks.length - 1) {
				i++;
			}

			return masks[i].mask;
		}

		function applyIEMask(value, uf) {
			var mask = getMask(uf, value);

			if (!mask) {
				return value;
			}

			var processed = mask.process(clearValue(value));
			var formatedValue = processed.result || '';
			formatedValue = formatedValue.trim().replace(/[^0-9]$/, '');

			if (uf === 'SP' && /^p/i.test(value)) {
				return 'P' + formatedValue;
			}

			return formatedValue;
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				var state = ($parse(attrs.uiBrIeMask)(scope) || '').toUpperCase();

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					return applyIEMask(value, state);
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyIEMask(value, state);
					var actualValue = clearValue(formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					if (state && state.toUpperCase() === 'SP' && /^p/i.test(value)) {
						return 'P' + actualValue;
					}

					return actualValue;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);

				ctrl.$validators.ie = function validator(modelValue) {
					return ctrl.$isEmpty(modelValue) || BrV.ie(state).validate(modelValue);
				};

				scope.$watch(attrs.uiBrIeMask, function(newState) {
					state = (newState || '').toUpperCase();

					parser(ctrl.$viewValue);
					ctrl.$validate();
				});
			}
		};
	}

	function NfeDirective() {
		var nfeAccessKeyMask = new StringMask('0000 0000 0000 0000 0000' +
			' 0000 0000 0000 0000 0000 0000');
	
		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.replace(/[^0-9]/g, '').slice(0, 44);
			},
			format: function(cleanValue) {
				return (nfeAccessKeyMask.apply(cleanValue) || '').replace(/[^0-9]$/, '');
			},
			validations: {
				nfeAccessKey: function(value) {
					return value.length === 44;
				}
			}
		});
	}

	function CarPlateDirective() {
		var carPlateMask = new StringMask('UUU-0000');
	
		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7);
			},
			format: function(cleanValue) {
				return (carPlateMask.apply(cleanValue) || '').replace(/[^a-zA-Z0-9]$/, '');
			},
			validations: {
				carPlate: function(value) {
					return value.length === 7;
				}
			}
		});
	}

	function BrPhoneDirective() {
		var phoneMask8D = new StringMask('(00) 0000-0000'),
			phoneMask9D = new StringMask('(00) 00000-0000'),
			phoneMask0800 = new StringMask('0000-000-0000');
	
		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.toString().replace(/[^0-9]/g, '').slice(0, 11);
			},
			format: function(cleanValue) {
				var formatedValue;
				if (cleanValue.indexOf('0800') === 0) {
					formatedValue = phoneMask0800.apply(cleanValue);
				} else if (cleanValue.length < 11) {
					formatedValue = phoneMask8D.apply(cleanValue) || '';
				} else {
					formatedValue = phoneMask9D.apply(cleanValue);
				}
	
				return formatedValue.trim().replace(/[^0-9]$/, '');
			},
			getModelValue: function(formattedValue, originalModelType) {
				var cleanValue = this.clearValue(formattedValue);
	
				return originalModelType === 'number' ? parseInt(cleanValue) : cleanValue;
			},
			validations: {
				brPhoneNumber: function(value) {
					var valueLength = value && value.toString().length;
					return valueLength === 10 || valueLength === 11;
				}
			}
		});
	}
	
})(window, window.angular);

(function (window, angular, undefined) {
	
	'use strict';

	var m = angular.module('ui.utils.masks.helpers', []);

	m.factory('PreFormatters', [function() {
		function clearDelimitersAndLeadingZeros(value) {
			if (value === '0') {
				return '0';
			}

			var cleanValue = value.replace(/^-/,'').replace(/^0*/, '');
			return cleanValue.replace(/[^0-9]/g, '');
		}

		function prepareNumberToFormatter(value, decimals) {
			return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
		}

		return {
			clearDelimitersAndLeadingZeros: clearDelimitersAndLeadingZeros,
			prepareNumberToFormatter: prepareNumberToFormatter
		};
	}])
	.factory('NumberMasks', [function() {
		return {
			viewMask: function(decimals, decimalDelimiter, thousandsDelimiter) {
				var mask = '#' + thousandsDelimiter + '##0';

				if (decimals > 0) {
					mask += decimalDelimiter;
					for (var i = 0; i < decimals; i++) {
						mask += '0';
					}
				}

				return new StringMask(mask, {
					reverse: true
				});
			},
			modelMask: function(decimals) {
				var mask = '###0';

				if (decimals > 0) {
					mask += '.';
					for (var i = 0; i < decimals; i++) {
						mask += '0';
					}
				}

				return new StringMask(mask, {
					reverse: true
				});
			}
		};
	}]);

})(window, window.angular);

(function (window, angular, undefined) {
	
	'use strict';

	angular.module('ui.utils.masks.global', ['ui.utils.masks.helpers'])
		.directive('uiDateMask', DateMaskDirective)
		.directive('uiMoneyMask', MoneyMaskDirective)
		.directive('uiNumberMask', NumberMaskDirective)
		.directive('uiPercentageMask', PercentageMaskDirective)
		.directive('uiScientificNotationMask', ScientificNotationMaskDirective)
		.directive('uiTimeMask', TimeMaskDirective)
		.directive('uiCreditCard', MaskDirective);

	function isISODateString(date) {
		return /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}([-+][0-9]{2}:[0-9]{2}|Z)$/
			.test(date.toString());
	}

	DateMaskDirective.$inject = ['$locale'];

	function DateMaskDirective($locale) {
		var dateFormatMapByLocale = {
			'pt-br': 'DD/MM/YYYY',
		};

		var dateFormat = dateFormatMapByLocale[$locale.id] || 'YYYY-MM-DD';

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				var dateMask = new StringMask(dateFormat.replace(/[YMD]/g,'0'));

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var cleanValue = value;
					if (typeof value === 'object' || isISODateString(value)) {
						cleanValue = moment(value).format(dateFormat);
					}

					cleanValue = cleanValue.replace(/[^0-9]/g, '');
					var formatedValue = dateMask.apply(cleanValue) || '';

					return formatedValue.trim().replace(/[^0-9]$/, '');
				}

				ctrl.$formatters.push(formatter);

				ctrl.$parsers.push(function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = formatter(value);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return moment(formatedValue, dateFormat).toDate();
				});

				ctrl.$validators.date =	function validator(modelValue, viewValue) {
					if (ctrl.$isEmpty(modelValue)) {
						return true;
					}

					return moment(viewValue, dateFormat).isValid() && viewValue.length === dateFormat.length;
				};
			}
		};
	}

	var validators = require('validators');

	MoneyMaskDirective.$inject = ['$locale', '$parse', 'PreFormatters'];
	
	function MoneyMaskDirective($locale, $parse, PreFormatters) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					currencySym = $locale.NUMBER_FORMATS.CURRENCY_SYM,
					symbolSeparation = ' ',
					decimals = $parse(attrs.uiMoneyMask)(scope);


				function maskFactory(decimals) {
					var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
					var maskPattern = symbolSeparation + '#' + thousandsDelimiter + '##0' + decimalsPattern;
					return new StringMask(maskPattern, {reverse: true});
				}

				if (angular.isDefined(attrs.uiHideGroupSep)) {
					thousandsDelimiter = '';
				}

				if (angular.isDefined(attrs.uiHideSpace)) {
					symbolSeparation = '';
				}

				if (angular.isDefined(attrs.currencySymbol)) {
					currencySym = attrs.currencySymbol;
					if (attrs.currencySymbol.length === 0) {
						symbolSeparation = '';
					}
				}

				if (isNaN(decimals)) {
					decimals = 2;
				}
				decimals = parseInt(decimals);
				var moneyMask = maskFactory(decimals);

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}
					var prefix = (angular.isDefined(attrs.uiNegativeNumber) && value < 0) ? '-' : '';
					var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
					return prefix + currencySym + moneyMask.apply(valueToFormat);
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					actualNumber = actualNumber.replace(/^[0]+([1-9])/,'$1');
					actualNumber = actualNumber || '0';
					var formatedValue = currencySym + moneyMask.apply(actualNumber);

					if (angular.isDefined(attrs.uiNegativeNumber)) {
						var isNegative = (value[0] === '-'),
							needsToInvertSign = (value.slice(-1) === '-');

						//only apply the minus sign if it is negative or(exclusive)
						//needs to be negative and the number is different from zero
						if (needsToInvertSign ^ isNegative && !!actualNumber) {
							actualNumber *= -1;
							formatedValue = '-' + formatedValue;
						}
					}

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue ? parseInt(formatedValue.replace(/[^\d\-]+/g,''))/Math.pow(10,decimals) : null;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);

				if (attrs.uiMoneyMask) {
					scope.$watch(attrs.uiMoneyMask, function(_decimals) {
						decimals = isNaN(_decimals) ? 2 : _decimals;
						decimals = parseInt(decimals);
						moneyMask = maskFactory(decimals);

						parser(ctrl.$viewValue);
					});
				}

				if (attrs.min) {
					var minVal;

					ctrl.$validators.min = function(modelValue) {
						return validators.minNumber(ctrl, modelValue, minVal);
					};

					scope.$watch(attrs.min, function(value) {
						minVal = value;
						ctrl.$validate();
					});
				}

				if (attrs.max) {
					var maxVal;

					ctrl.$validators.max = function(modelValue) {
						return validators.maxNumber(ctrl, modelValue, maxVal);
					};

					scope.$watch(attrs.max, function(value) {
						maxVal = value;
						ctrl.$validate();
					});
				}
			}
		};
	}

	NumberMaskDirective.$inject = ['$locale', '$parse', 'PreFormatters', 'NumberMasks'];
	
	function NumberMaskDirective($locale, $parse, PreFormatters, NumberMasks) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					decimals = $parse(attrs.uiNumberMask)(scope);

				if (angular.isDefined(attrs.uiHideGroupSep)) {
					thousandsDelimiter = '';
				}

				if (isNaN(decimals)) {
					decimals = 2;
				}

				var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = NumberMasks.modelMask(decimals);

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return null;
					}

					var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
					var formatedValue = viewMask.apply(valueToFormat);
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if (angular.isDefined(attrs.uiNegativeNumber)) {
						var isNegative = (value[0] === '-'),
							needsToInvertSign = (value.slice(-1) === '-');

						//only apply the minus sign if it is negative or(exclusive) or the first character
						//needs to be negative and the number is different from zero
						if ((needsToInvertSign ^ isNegative) || value === '-') {
							actualNumber *= -1;
							formatedValue = '-' + ((actualNumber !== 0) ? formatedValue : '');
						}
					}

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var prefix = (angular.isDefined(attrs.uiNegativeNumber) && value < 0) ? '-' : '';
					var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
					return prefix + viewMask.apply(valueToFormat);
				}

				function clearViewValueIfMinusSign() {
					if (ctrl.$viewValue === '-') {
						ctrl.$setViewValue('');
						ctrl.$render();
					}
				}

				element.on('blur', clearViewValueIfMinusSign);

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);

				if (attrs.uiNumberMask) {
					scope.$watch(attrs.uiNumberMask, function(_decimals) {
						decimals = isNaN(_decimals) ? 2 : _decimals;
						viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = NumberMasks.modelMask(decimals);

						parser(ctrl.$viewValue);
					});
				}

				if (attrs.min) {
					var minVal;

					ctrl.$validators.min = function(modelValue) {
						return validators.minNumber(ctrl, modelValue, minVal);
					};

					scope.$watch(attrs.min, function(value) {
						minVal = value;
						ctrl.$validate();
					});
				}

				if (attrs.max) {
					var maxVal;

					ctrl.$validators.max = function(modelValue) {
						return validators.maxNumber(ctrl, modelValue, maxVal);
					};

					scope.$watch(attrs.max, function(value) {
						maxVal = value;
						ctrl.$validate();
					});
				}
			}
		};
	}

	PercentageMaskDirective.$inject = ['$locale', '$parse', 'PreFormatters', 'NumberMasks'];

	function PercentageMaskDirective($locale, $parse, PreFormatters, NumberMasks) {
		function preparePercentageToFormatter(value, decimals, modelMultiplier) {
			return PreFormatters.clearDelimitersAndLeadingZeros((parseFloat(value)*modelMultiplier).toFixed(decimals));
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					decimals = parseInt(attrs.uiPercentageMask),
					hideSpace = false,
					backspacePressed = false;

				element.bind('keydown keypress', function(event) {
					backspacePressed = event.which === 8;
				});

				var modelValue = {
					multiplier : 100,
					decimalMask: 2
				};

				if (angular.isDefined(attrs.uiHideGroupSep)) {
					thousandsDelimiter = '';
				}

				if (angular.isDefined(attrs.uiHideSpace)) {
					hideSpace = true;
				}

				if (angular.isDefined(attrs.uiPercentageValue)) {
					modelValue.multiplier  = 1;
					modelValue.decimalMask = 0;
				}

				if (isNaN(decimals)) {
					decimals = 2;
				}

				var numberDecimals = decimals + modelValue.decimalMask;
				var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = NumberMasks.modelMask(numberDecimals);

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var valueToFormat = preparePercentageToFormatter(value, decimals, modelValue.multiplier);
					return viewMask.apply(valueToFormat) + ' %';
				}

				function parse(value) {
					if (ctrl.$isEmpty(value)) {
						return null;
					}

					var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
					if (value.length > 1 && value.indexOf('%') === -1) {
						valueToFormat = valueToFormat.slice(0,valueToFormat.length-1);
					}
					if (backspacePressed && value.length === 1 && value !== '%') {
						valueToFormat = '0';
					}
					var percentSign = hideSpace ? '%' : ' %';
					var formatedValue = viewMask.apply(valueToFormat) + percentSign;
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parse);

				if (attrs.uiPercentageMask) {
					scope.$watch(attrs.uiPercentageMask, function(_decimals) {
						decimals = isNaN(_decimals) ? 2 : _decimals;

						if (angular.isDefined(attrs.uiPercentageValue)) {
							modelValue.multiplier  = 1;
							modelValue.decimalMask = 0;
						}

						numberDecimals = decimals + modelValue.decimalMask;
						viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = NumberMasks.modelMask(numberDecimals);

						parse(ctrl.$viewValue);
					});
				}

				if (attrs.min) {
					var minVal;

					ctrl.$validators.min = function(modelValue) {
						return validators.minNumber(ctrl, modelValue, minVal);
					};

					scope.$watch(attrs.min, function(value) {
						minVal = value;
						ctrl.$validate();
					});
				}

				if (attrs.max) {
					var maxVal;

					ctrl.$validators.max = function(modelValue) {
						return validators.maxNumber(ctrl, modelValue, maxVal);
					};

					scope.$watch(attrs.max, function(value) {
						maxVal = value;
						ctrl.$validate();
					});
				}
			}
		};
	}

	ScientificNotationMaskDirective.$inject = ['$locale', '$parse'];

	function ScientificNotationMaskDirective($locale, $parse) {
		var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
			defaultPrecision = 2;

		function significandMaskBuilder(decimals) {
			var mask = '0';

			if (decimals > 0) {
				mask += decimalDelimiter;
				for (var i = 0; i < decimals; i++) {
					mask += '0';
				}
			}

			return new StringMask(mask, {
				reverse: true
			});
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				var decimals = $parse(attrs.uiScientificNotationMask)(scope);

				if (isNaN(decimals)) {
					decimals = defaultPrecision;
				}

				var significandMask = significandMaskBuilder(decimals);

				function splitNumber(value) {
					var stringValue = value.toString(),
						splittedNumber = stringValue.match(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);

					return {
						integerPartOfSignificand: splittedNumber[1],
						decimalPartOfSignificand: splittedNumber[2],
						exponent: splittedNumber[3] | 0
					};
				}

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					if (typeof value === 'string') {
						value = value.replace(decimalDelimiter, '.');
					} else if (typeof value === 'number') {
						value = value.toExponential(decimals);
					}

					var formattedValue, exponent;
					var splittedNumber = splitNumber(value);

					var integerPartOfSignificand = splittedNumber.integerPartOfSignificand || 0;
					var numberToFormat = integerPartOfSignificand.toString();
					if (angular.isDefined(splittedNumber.decimalPartOfSignificand)) {
						numberToFormat += splittedNumber.decimalPartOfSignificand;
					}

					var needsNormalization =
						(integerPartOfSignificand >= 1 || integerPartOfSignificand <= -1) &&
						(
							(angular.isDefined(splittedNumber.decimalPartOfSignificand) &&
							splittedNumber.decimalPartOfSignificand.length > decimals) ||
							(decimals === 0 && numberToFormat.length >= 2)
						);

					if (needsNormalization) {
						exponent = numberToFormat.slice(decimals + 1, numberToFormat.length);
						numberToFormat = numberToFormat.slice(0, decimals + 1);
					}

					formattedValue = significandMask.apply(numberToFormat);

					if (splittedNumber.exponent !== 0) {
						exponent = splittedNumber.exponent;
					}

					if (angular.isDefined(exponent)) {
						formattedValue += 'e' + exponent;
					}

					return formattedValue;
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var viewValue = formatter(value),
						modelValue = parseFloat(viewValue.replace(decimalDelimiter, '.'));

					if (ctrl.$viewValue !== viewValue) {
						ctrl.$setViewValue(viewValue);
						ctrl.$render();
					}

					return modelValue;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);

				ctrl.$validators.max = function validator(value) {
					return ctrl.$isEmpty(value) || value < Number.MAX_VALUE;
				};
			}
		};
	}

	function TimeMaskDirective() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				var timeFormat = '00:00:00';

				if (angular.isDefined(attrs.uiTimeMask) && attrs.uiTimeMask === 'short') {
					timeFormat = '00:00';
				}

				var formattedValueLength = timeFormat.length;
				var unformattedValueLength = timeFormat.replace(':', '').length;
				var timeMask = new StringMask(timeFormat);

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var cleanValue = value.replace(/[^0-9]/g, '').slice(0, unformattedValueLength) || '';
					return (timeMask.apply(cleanValue) || '').replace(/[^0-9]$/, '');
				}

				ctrl.$formatters.push(formatter);

				ctrl.$parsers.push(function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var viewValue = formatter(value);
					var modelValue = viewValue;

					if (ctrl.$viewValue !== viewValue) {
						ctrl.$setViewValue(viewValue);
						ctrl.$render();
					}

					return modelValue;
				});

				ctrl.$validators.time = function(modelValue) {
					if (ctrl.$isEmpty(modelValue)) {
						return true;
					}

					var splittedValue = modelValue.toString().split(/:/).filter(function(v) {
						return !!v;
					});

					var hours = parseInt(splittedValue[0]),
						minutes = parseInt(splittedValue[1]),
						seconds = parseInt(splittedValue[2] || 0);

					return modelValue.toString().length === formattedValueLength &&
						hours < 24 && minutes < 60 && seconds < 60;
				};
			}
		};
	}

	function MaskDirective() {
		var ccSize = 16;
		var ccMask = new StringMask('0000 0000 0000 0000');

		return maskFactory({
			clearValue: function(rawValue) {
				return rawValue.toString().replace(/[^0-9]/g, '').slice(0, ccSize);
			},
			format: function(cleanValue) {
				var formatedValue;

				formatedValue = ccMask.apply(cleanValue) || '';

				return formatedValue.trim().replace(/[^0-9]$/, '');
			},
			validations: {
				creditCard: function(value) {
					var valueLength = value && value.toString().length;
					return valueLength === ccSize;
				}
			}
		});
	}

})(window, window.angular);

(function (window, angular, undefined) {
	
	'use strict';

	angular.module('ui.utils.masks', ['ui.utils.masks.global', 'ui.utils.masks.br']);

})(window, window.angular);

});
