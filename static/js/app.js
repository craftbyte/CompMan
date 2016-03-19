angular.module('compMan', ['angularMoment', 'angularModalService'])
.controller('loginCtrl', ['$http', '$scope', '$window', 'ModalService', ($http, $scope, $window, ModalService) => {
	vex = $window.vex;
	$scope.login = () => {
		vex.dialog.open({
			message: "Vpiši podatke za prijavo",
			input: "<input name=\"username\" type=\"email\" placeholder=\"E-poštni naslov\" required />\n<input name=\"password\" type=\"password\" placeholder=\"Geslo\" required />",
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
			input: "<input name=\"name\" type=\"text\" placeholder=\"Ime\" required />\n<input name=\"surname\" type=\"text\" placeholder=\"Priimek\" required />\n<input name=\"class\" type=\"text\" placeholder=\"Razred\" required />\n<input name=\"username\" type=\"email\" placeholder=\"E-poštni naslov\" required />\n<input name=\"password\" type=\"password\" placeholder=\"Geslo\" required />\n<input name=\"passwordRepeat\" type=\"password\" placeholder=\"Ponovno geslo\" required />",
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
				}
			}
		})
	}
}])
.run((amMoment, $window) => {
	amMoment.changeLocale('sl');
	$window.vex.defaultOptions.className = 'vex-theme-top';
});    