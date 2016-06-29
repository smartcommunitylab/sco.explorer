angular.module('explorer.services.config', [])

.factory('Config', function ($rootScope, $q, $http, $window) {
  var configService = {};
  var configJson = {};
  var APP_BUILD = '';

  configService.init = function () {
    var deferred = $q.defer();

    if (configJson != null) {
      deferred.resolve(true);
    } else {
      $http.get('data/config.json').success(function (response) {
        configJson = response;
        deferred.resolve(true);
      });
    }

    return deferred.promise;
  };

  // INIT
  configService.init();

  configService.HTTP_CONFIG = {
    timeout: 5000
  };

  configService.getServerURL = function () {
    return configJson['serverURL'];
  };

  configService.getGeocoderURL = function () {
    return configJson['geocoderURL'];
  };

  configService.getAACURL = function () {
    return configJson['AACURL'];
  };

  configService.getAuthServerURL = function () {
    return configJson['AACURL'] + configJson['authServerURL'];
  };

  configService.getServerTokenURL = function () {
    return configJson['AACURL'] + configJson['serverTokenURL'];
  };

  configService.getServerRegisterURL = function () {
    return configJson['AACURL'] + configJson['serverRegisterURL'];
  };

  configService.getServerProfileURL = function () {
    return configJson['AACURL'] + configJson['serverProfileURL'];
  };

  configService.getRedirectUri = function () {
    return configJson['redirectURL'];
  };

  configService.getClientId = function () {
    return configJson['cliendID'];
  };

  configService.getClientSecKey = function () {
    return configJson['clientSecKey'];
  };

  configService.getAppName = function () {
    return configJson['appname'];
  };

  configService.getAppVersion = function () {
    return 'v ' + configJson['appversion'] + (APP_BUILD && APP_BUILD != '' ? '<br/>(' + APP_BUILD + ')' : '');
  };

  return configService;
})
