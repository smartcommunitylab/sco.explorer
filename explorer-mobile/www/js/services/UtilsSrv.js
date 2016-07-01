angular.module('explorer.services.utils', [])

.factory('Utils', function ($ionicLoading, $cordovaToast) {
  var utilsService = {};

  utilsService.getLang = function () {
    var browserLanguage = '';
    // works for earlier version of Android (2.3.x)
    var androidLang;
    if ($window.navigator && $window.navigator.userAgent && (androidLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
      browserLanguage = androidLang[1];
    } else {
      // works for iOS, Android 4.x and other devices
      browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
    }

    var lang = browserLanguage.substring(0, 2);
    if (lang != 'it' && lang != 'en' && lang != 'de') {
      lang = 'en'
    };

    return lang;
  };

  utilsService.getLanguage = function () {
    navigator.globalization.getLocaleName(
      function (locale) {
        alert('locale: ' + locale.value + '\n');
      },
      function () {
        alert('Error getting locale\n');
      }
    );
  };

  utilsService.toast = function (message, duration, position) {
    message = message || 'There was a problem...';
    duration = duration || 'short';
    position = position || 'top';

    if (!!window.cordova) {
      // Use the Cordova Toast plugin
      $cordovaToast.show(message, duration, position);
    } else {
      if (duration == 'short') {
        duration = 2000;
      } else {
        duration = 5000;
      }

      var myPopup = $ionicPopup.show({
        template: '<div class="toast">' + message + '</div>',
        scope: $rootScope,
        buttons: []
      });

      $timeout(function () {
        myPopup.close();
      }, duration);
    }
  };

  utilsService.compare = function (obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  utilsService.loading = function () {
    $ionicLoading.show();
  };

  utilsService.loaded = function () {
    $ionicLoading.hide();
  };

  return utilsService;
});
