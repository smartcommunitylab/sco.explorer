angular.module('explorer.services.config', [])

.factory('Config', function ($rootScope, $q, $http, $window) {
  var configJson = {
    "appname": "Rovereto Explorer",
    "appversion": "2.0.0",
    "serverURL": "https://dev.smartcommunitylab.it/roveretoexplorer",
    "geocoderURL": "https://os.smartcommunitylab.it/core.geocoder/spring",
    "AACURL": "https://tn.smartcommunitylab.it/aac",
    "authServerURL": "/eauth/authorize",
    "serverTokenURL": "/oauth/token",
    "serverRegisterURL": "/internal/register/rest",
    "serverProfileURL": "/basicprofile/me",
    "cliendID": "ec03a596-e41e-49cc-808c-62f39e01de0b",
    "clientSecKey": "6c6829bc-6621-4273-84b8-d74d23744f04",
    "redirectURL": "http://localhost",
    "schemaVersion": "3",
    "dbName": "Rovereto",
    "doProfiling": false,
    "contentTypes": {
      "path": "eu.iescities.pilot.rovereto.roveretoexplorer.custom.data.model.ExplorerObject"
    },
    "syncTimeout": 8,
    "syncingOverlayTimeout": 50,
    "loadingOverlayTimeout": 20
  };

  var configService = {};
  var APP_BUILD = '';

  configService.HTTP_CONFIG = {
    timeout: 5000
  };

  configService.getServerURL = function () {
    return configJson['serverURL'];
  };

  configService.getSchemaVersion = function () {
    return configJson['schemaVersion'];
  }

  configService.getDbName = function () {
    return configJson['dbName'];
  }

  configService.getSyncURL = function () {
    return configService.getServerURL() + '/sync' + '?since=';
  };

  configService.getSyncTimeoutSeconds = function () {
    // in seconds
    return 60 * 60 * configJson['syncTimeout'];
  };

  configService.getSyncingOverlayTimeout = function () {
    // in milliseconds
    return 1000 * configJson['syncingOverlayTimeout'];
  };

  configService.getLoadingOverlayTimeout = function () {
    // in milliseconds
    return 1000 * configJson['loadingOverlayTimeout'];
  };

  configService.doProfiling = function () {
    return configJson['doProfiling'];
  };

  configService.getContentTypes = function () {
    return configJson['contentTypes'];
  };

  configService.getContentKeyFromDbType = function (dbtype) {
    var cts = configService.getContentTypes();
    for (var contentType in cts) {
      if (cts.hasOwnProperty(contentType) && cts[contentType] == dbtype) {
        return contentType;
      }
    }
    return '';
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
