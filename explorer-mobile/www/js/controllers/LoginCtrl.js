angular.module('explorer.controllers.login', [])

.controller('LoginCtrl', function ($scope, $ionicSideMenuDelegate, $ionicLoading, $ionicPlatform, $state, $ionicHistory, $ionicPopup, $timeout, $filter, Utils, Config, LoginSrv, userService, storageService) {
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.user = {
    email: '',
    password: ''
  };

  /* GOOGLE */
  // This method is executed when the user press the "Sign in with Google" button
  $scope.googleSignIn = function () {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    $timeout(function () {
      // Close the popup after 3 seconds for some reason
      $ionicLoading.hide();
    }, 3000);

    LoginSrv.login(null, 'google').then(function (profile) {
        $ionicLoading.hide();
        storageService.saveUser(profile);

        // go on to home page
        $state.go('app.home');
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
      },
      function (err) {
        Toast.show($filter('translate')('pop_up_error_server_template'), 'short', 'bottom');
        $ionicLoading.hide();
      }
    );
  };

  /* FACEBOOK */
  // This method is to get the user profile info from the Facebook API
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
        console.log(response);
        info.resolve(response);
      },
      function (response) {
        console.log(response);
        $ionicLoading.hide();
        info.reject(response);
      }
    );

    return info.promise;
  };

  // This is the fail callback from the login method
  var fbLoginError = function (error) {
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  var fbLoginSuccess = function (response) {
    if (!response.authResponse) {
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
      .then(function (profileInfo) {
        userService.setUser({
          authResponse: authResponse,
          userID: profileInfo.id,
          name: profileInfo.name,
          email: profileInfo.email,
          picture: 'http://graph.facebook.com/' + authResponse.userID + '/picture?type=large'
        });

        //$ionicLoading.hide();
        $state.go('app.home');
      }, function (fail) {
        //fail get profile info
        $ionicLoading.hide();
        console.log('profile info fail', fail);
      });
  };

  $scope.facebookSignIn = function () {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    $timeout(function () {
      // Close the popup after 3 seconds for some reason
      $ionicLoading.hide();
    }, 3000);

    LoginSrv.login(null, 'facebook').then(function (profile) {
      $ionicLoading.hide();
      storageService.saveUser(profile);

      $state.go('app.home');
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
    }, function (err) {
      Toast.show($filter('translate')('pop_up_error_server_template'), "short", "bottom");
      $ionicLoading.hide();
    });
  };

  /*
  function validateUserPopup() {
    var buttons = [
      {
        text: $filter('translate')('btn_close'),
        type: 'button-close',
        onTap: function (e) {
          //close app
          ionic.Platform.exitApp();
        }
      },
      {
        text: $filter('translate')('btn_validate_user'),
        onTap: function (e) {
          $ionicLoading.show();
          registrationForm();
        }
      }
    ];
    if (ionic.Platform.isIOS()) {
      buttons.splice(0, 1);
    }
    $scope.validatePopup = $ionicPopup.show({
      templateUrl: 'templates/validateUserPopup.html',
      title: $filter('translate')('lbl_validateuser'),
      cssClass: 'parking-popup',
      scope: $scope,
      buttons: buttons
    });
  };
  */

  function registrationForm() {
    $state.go('app.registration');
  }

  $scope.$on('$ionicView.leave', function () {
    $ionicSideMenuDelegate.canDragContent(true);
    //$ionicLoading.hide();
    if (window.cordova && window.cordova.plugins.screenorientation) {
      screen.unlockOrientation()
    }
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    /*
    $ionicLoading.show({
      template: $filter('translate')('user_check')
    });
    */
  });

  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.screenorientation) {
      screen.lockOrientation('portrait');
    }

    /*
    $scope.$on('$ionicView.enter', function () {
        $ionicLoading.hide();
    });
    */

    userService.getValidToken().then(function (validToken) {
      var profile = storageService.getUser();
      $scope.validateUserForGamification(profile);
    }, function (err) {
      $ionicLoading.hide();
    });
  });

  $scope.goRegister = function () {
    $state.go('app.signup');
  };

  $scope.passwordRecover = function () {
    window.open(Config.getAACURL() + '/internal/reset?lang=en', '_system', 'location=no,toolbar=no')
  };

  $scope.signin = function () {
    Utils.loading();
    LoginSrv.signin($scope.user).then(
      function (profile) {
        $ionicLoading.hide();
        storageService.saveUser(profile);

        $state.go('app.home');
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
      },
      function (error) {
        storageService.saveUser(null);
        $ionicPopup.alert({
          title: $filter('translate')('error_popup_title'),
          template: $filter('translate')('error_signin')
        });
      }
    ).finally(Utils.loaded);
  };
})

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $filter, $ionicHistory, $ionicPopup, $translate, Utils, Config, LoginSrv) {
  $scope.user = {
    lang: $translate.preferredLanguage(),
    name: '',
    surname: '',
    email: '',
    password: ''
  };

  var validate = function () {
    if (!$scope.user.name.trim() || !$scope.user.surname.trim() || !$scope.user.email.trim() || !$scope.user.password.trim()) {
      return 'error_required_fields';
    }
    if ($scope.user.password.trim().length < 6) {
      return 'error_password_short';
    }
    return null;
  };

  $scope.toLogin = function () {
    window.location.hash = '';
    window.location.reload(true);
  };

  $scope.resend = function () {
    window.open(Config.getAACURL() + '/internal/resend?lang=en', '_system', 'location=no,toolbar=no')
  };

  $scope.register = function () {
    var msg = validate();

    if (msg) {
      $ionicPopup.alert({
        title: $filter('translate')('error_popup_title'),
        template: $filter('translate')(msg)
      });
      return;
    }

    Utils.loading();
    LoginSrv.register($scope.user).then(
      function (data) {
        $state.go('app.signupsuccess');
      },
      function (error) {
        var errorMsg = 'error_generic';
        if (error == 409) {
          errorMsg = 'error_email_inuse';
        }
        $ionicPopup.alert({
          title: $filter('translate')('error_popup_title'),
          template: $filter('translate')(errorMsg)
        });
      }
    ).finally(Utils.loaded);
  };
});
