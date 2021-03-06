angular.module('explorer', [
    'ionic',
    'ngCordova',
    'ngSanitize',
    'pascalprecht.translate',
    'explorer.controllers.home',
    'explorer.controllers.login',
    'explorer.controllers.events',
    'explorer.services.config',
    'explorer.services.utils',
    'explorer.services.db',
    'explorer.services.login'
    //'explorer.services.reviews'
])

/*,
'explorer.services.db'
*/

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function ($translateProvider) {
  //$translateProvider.translations('it', {});
  $translateProvider.preferredLanguage('it');
  $translateProvider.useStaticFilesLoader({
    prefix: 'languages/',
    suffix: '.json'
  });
  //$translateProvider.useSanitizeValueStrategy('sanitize');
  //$translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
})

.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.events', {
    url: '/events',
    views: {
      'menuContent': {
        templateUrl: 'templates/events.html',
        controller: 'EventsCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
