angular.module('explorer.controllers.home', [])

.controller('AppCtrl', function ($scope, $state, $ionicHistory, Config, Profiling, DbSrv) {
  /* Sync iniziale */
  DbSrv.sync().then(function (reset) {
    console.log('DB syncronization. Reset: ' + reset);
  });
  // TODO error handling;
})

.controller('HomeCtrl', function ($scope, $state, $ionicHistory, Config, Profiling, DbSrv, LoginSrv) {
  $scope.dbObject = null;

  // alternative to <a href>
  $scope.goTo = function (state, params, reload, root) {
    if (!!root) {
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
    }

    if (!!reload) {
      $ionicHistory.clearCache().then(function () {
        $state.go(state, params);
      });
    } else {
      $state.go(state, params);
    }
  };

  $scope.openLink = function (link) {
    window.open(link, '_system');
  };

  /* dbObject creation */
  DbSrv.getAllCategories().then(function (data) {
    if (!!data) {
      $scope.dbObject = data;
    }
  }); // TODO error handling;


  /* Get element by Id */
  $scope.getElementbyId = function (id) {
    return $scope.dbObject['All'][id];
  };

  /* Get elements by category */
  $scope.getElementsbyCategory = function (category) {
    return $scope.dbObject[category];
  };
});
