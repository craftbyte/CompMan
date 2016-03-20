/* global angular */

angular.module('compMan', ['angularMoment', 'angularModalService'])
.directive('pwcheck', [function(){
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl){
			var fpw = '#' + attrs.pwcheck;
			elem.add(fpw).on('keyup', function(){
				scope.$apply(function() {
					var v = elem.val() === $(fpw).val();
					
					ctrl.$setValidity('pwmatch', v);
				});
			});
		}
	}
}])
.controller('loginCtrl', ['$http', '$scope', '$window', 'ModalService', ($http, $scope, $window, ModalService) => {
	var vex = $window.vex;
	$scope.login = () => {
		vex.dialog.open({
			message: "Vpiši podatke za prijavo",
			input: "<input name=\"email\" type=\"email\" placeholder=\"E-poštni naslov\" required />\n<input name=\"password\" type=\"password\" placeholder=\"Geslo\" required />",
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {
					text: 'Prijava'
				}), $.extend({}, vex.dialog.buttons.NO, {
					text: 'Prekliči'
				})
			],
			overlayClosesOnClick: false,
			callback: (data) => {
				if (data) {
					$scope.loginPending=true;
					$scope.$apply();
					$http.post('/login', data).then((response) => {
						$window.location = "/"
					}, (response) => {
						vex.dialog.alert("Napačen e-poštni naslov ali geslo")
						$scope.loginPending=false;
						$scope.$apply();
					})
				}
			}
		})
	}

	$scope.signUp = () => {
		vex.dialog.open({
			message: "Vpiši podatke za registracijo",
			input: "<input name=\"name\" type=\"text\" placeholder=\"Ime\" required />\n<input name=\"surname\" type=\"text\" placeholder=\"Priimek\" required />\n<input name=\"email\" type=\"email\" placeholder=\"E-poštni naslov\" required />\n<input name=\"password\" type=\"password\" placeholder=\"Geslo\" required />\n<input name=\"passwordRepeat\" pwcheck=\"password\"type=\"password\" placeholder=\"Ponovno geslo\" required />",
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {
					text: 'Registracija'
				}), $.extend({}, vex.dialog.buttons.NO, {
					text: 'Prekliči'
				})
			],
			overlayClosesOnClick: false,
			callback: (data) => {
				if (data) {
					$scope.registerPending=true;
					$scope.$apply();
					$http.post('/register', data).then((response) => {
						$window.location = "/auth"
					}, (response) => {
						vex.dialog.alert("E-naslov že uporabljen")
						$scope.registerPending=false;
						$scope.$apply();
					})
				}
			}
		})
	}
}])
.run((amMoment, $window) => {
	amMoment.changeLocale('sl');
	$window.vex.defaultOptions.className = 'vex-theme-top';
});
