(function () {
  'use strict';


  angular
    .module('headliner')
    .controller('loginCtrl', loginCtrl);

  
  loginCtrl.$inject = ['$scope', '$state', 'authService', 'userService'];

  function loginCtrl($scope, $state, authService, userService) {
      /*jshint validthis: true */

      var form = this;

      form.tmpUser = {};
      form.isInvalid = true;
      form.validateEmail = validateEmail;
      form.registerUser = registerUser;
      form.loginUser = loginUser;
      form.validatePassword = validatePassword;
      form.errorMessage = String;



      function loginUser() {
        if(0 === form.loginEmail.length || 0 === form.loginPassword) {
          form.isInvalid = true;
          return;
        } else {
          form.isInvalid = false;
          authService.authRef.$signInWithEmailAndPassword(form.loginEmail, form.loginPassword)
            .then(function(authData) {
              form.authdata = authData;
              if(form.authdata) {
                form.loggedIn = userService.getUser();
                form.loggedIn.$loaded()
                  .then(function() {
                    for(var i = 0, len = form.loggedIn.length; i < len; i++) {
                      if(form.loggedIn[i].loginId === form.authdata.uid) {
                        
                        form.tmpUser = {
                          fbID: form.loggedIn[i].$id,
                          loginID: form.loggedIn[i].loginId,
                          user: form.loggedIn[i].user
                        };

                        userService.userOnline(form.tmpUser.fbID);
                        userService.setCurrentUser(form.tmpUser);
                        $state.go('home.dashboard');
                      }
                    }
                  });
              } else {
                $state.go('home.articles');
              }
          }).catch(function(error) {
            // Process incorrect email or password message
            form.errorMessage = error.message;
            console.log('loginCtrl::loginUser', error.message);
          });
        }
      }

      function registerUser() {
        $state.go('home.register');
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