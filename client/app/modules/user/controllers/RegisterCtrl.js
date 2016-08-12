(function () {
	'use strict';


	angular
		.module('headliner')
		.controller('registerCtrl', registerCtrl);

	
	registerCtrl.$inject = ['$scope', '$state', 'authService', 'userService'];

	function registerCtrl($scope, $state, authService, userService) {
		/*jshint validthis: true */

		var form = this;

		form.isInvalid = true;
		form.cancelRegister = cancelRegister;
		form.regUser = regUser;
		form.validateEmail = validateEmail;
		form.validatePassword = validatePassword;



		function cancelRegister() {
			$state.go('home.articles');
		}

		function regUser() {
			if(0 === form.loginEmail.length || 0 === form.loginPassword || form.loginPassword !== form.loginPasswordConfirm) {
				form.isInvalid = true;
				return;
			} else {
				form.isInvalid = false;
				authService.authRef.$createUserWithEmailAndPassword(form.loginEmail, form.loginPassword)
					.then(function(userData) {
						form.saveUser = userService.addUser(userData.uid, form.loginEmail);
						$state.go('home.articles');
					}).catch(function(error) {
						console.log('registerCtrl::regUser', error);
				    });
			}
		}

		function validateEmail(mail) {
			if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value)) {
				return true;
			}
			console.log("You have entered an invalid email address!");
			return false;
		}

		function validatePassword(val) {
			var regEx =  /^[A-Za-z]\w{7,14}$/;
			return val.value.match(regEx) ? true : false;
		}
	}

})();
