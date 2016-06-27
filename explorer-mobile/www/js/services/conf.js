angular.module('explorer.services.conf', [])

.factory('Config', function ($q, $http, $window, $filter, $rootScope) {

  var DEVELOPMENT = false;

  var URL = 'https://' + (DEVELOPMENT ? 'dev' : 'tn') + '.smartcommunitylab.it';
  var app = 'roveretoexplorer'
  var userdata = 'userdata/paths';

  var APP_BUILD = '';

  var credits = 'credits.html';
  var contentTypes = {
    'path': 'it.smartcommunitylab.percorsi.model.Path',
    'categories': 'it.smartcommunitylab.percorsi.model.Categories',
  };
  var dbName = 'Rovereto';
  return {

    getVersion: function () {
      return 'v ' + APP_VERSION + (APP_BUILD && APP_BUILD != '' ? '<br/>(' + APP_BUILD + ')' : '');
    },
    getLang: function () {
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
      if (lang != 'it' && lang != 'en' && lang != 'de') lang = 'en';
      return lang;
    },
    getLanguage: function () {

      navigator.globalization.getLocaleName(
        function (locale) {
          alert('locale: ' + locale.value + '\n');
        },
        function () {
          alert('Error getting locale\n');
        }
      );

    },
    keys: function () {
      return keys;
    },
    URL: function () {
      return URL;
    },
    app: function () {
      return app;
    },
    userdata: function () {
      return userdata;
    },
    service: function () {
      return service;
    },
    schemaVersion: function () {
      return 0;
    },
    savedImagesDirName: function () {
      return 'Percorsi-ImagesCache';
    },
    syncUrl: function () {
      //console.log('$rootScope.TEST_CONNECTION: '+(!!$rootScope.TEST_CONNECTION));
      var SYNC_MODE = (!!$rootScope.TEST_CONNECTION ? 'syncdraft' : 'sync');
      //console.log('SYNC_MODE: '+SYNC_MODE);
      return URL + '/' + app + '/sync' + '?since=';
      // /sync/{appId}?since={version}
    },
    syncTimeoutSeconds: function () {
      //return 60 * 60; /* 60 times 60 seconds = EVERY HOUR */
      return 60 * 60 * 8; /* 60 times 60 seconds = 1 HOUR --> x8 = THREE TIMES A DAY */
      //return 60 * 60 * 24; /* 60 times 60 seconds = 1 HOUR --> x24 = ONCE A DAY */
      //return 60 * 60 * 24 * 10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
    },
    syncingOverlayTimeoutMillis: function () {
      return 50 * 1000; /* seconds before automatically hiding syncing overlay */
    },
    loadingOverlayTimeoutMillis: function () {
      return 20 * 1000; /* seconds before automatically hiding loading overlay */
    },
    fileDatadirMaxSizeMB: function () {
      return 100;
    },
    fileCleanupTimeoutSeconds: function () {
      return 60 * 60 * 12; /* 60 times 60 seconds = 1 HOUR --> x12 = TWICE A DAY */
    },
    fileCleanupOverlayTimeoutMillis: function () {
      return 20 * 1000; /* seconds before automatically hiding cleaning overlay */
    },
    contentTypesList: function () {
      return contentTypes;
    },
    contentKeyFromDbType: function (dbtype) {
      for (var contentType in contentTypes) {
        if (contentTypes.hasOwnProperty(contentType)) {
          if (contentTypes[contentType] == dbtype) return contentType;
        }
      }
      return '';
    },
    textTypesList: function () {
      return textTypes;
    },

    cityName: "Vivo la città",
    credits: credits,
    imagePath: function () {
      return imagePath;
    },
    dbName: function () {
      return dbName;
    },
    doProfiling: function () {
      return false;
    }
  }
})

.factory('Profiling', function (Config) {
  var reallyDoProfiling = Config.doProfiling();
  var startTimes = {};
  return {
    start2: function (label) {
      startTimes[label] = (new Date).getTime();
    },
    start: function (label) {
      if (reallyDoProfiling) this.start2(label);
    },

    _do2: function (label, details, info) {
      var startTime = startTimes[label] || -1;
      if (startTime != -1) {
        var nowTime = (new Date).getTime();
        console.log('PROFILING: ' + label + (details ? '(' + details + ')' : '') + '=' + (nowTime - startTime));
        //if (details) startTimes[label]=nowTime;
        if (!!info) console.log(info);
      }
    },
    _do: function (label, details, info) {
      if (reallyDoProfiling) this._do2(label, details);
    }
  };
})
