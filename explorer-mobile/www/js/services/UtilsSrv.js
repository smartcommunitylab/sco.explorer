angular.module('explorer.services.utils', [])

.factory('Utils', function ($ionicLoading) {
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
