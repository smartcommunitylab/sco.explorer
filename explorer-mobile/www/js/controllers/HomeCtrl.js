angular.module('explorer.controllers.home', [])

.controller('AppCtrl', function ($scope, $state, $ionicHistory, Config, Profiling, DbSrv) {
  /* Sync iniziale */
  DbSrv.sync().then(function (reset) {
    console.log('DB syncronization. Reset: ' + reset);
  });
  // TODO error handling;
})

.controller('HomeCtrl', function ($scope, $state, $ionicHistory, Config, Profiling, DbSrv) {
  $scope.dbObject = null;

  $scope.eventsByCategory = {
    Sociale: [],
    Cultura: [],
    Sport: [],
    Other: []
  };

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


  /* Database Object creation */
  var init = function () {
    DbSrv.getAllCategories().then(function (data) {
      if (!!data) {
        $scope.dbObject = data;
      }
      //console.log($scope.dbObject);
      $scope.getEventsbyCategory();
    }); // TODO error handling;
  }

  DbSrv.sync().then(function (reset) {
    console.log('Reset: ' + reset);
    init();
  });
  // TODO error handling;

  /* Divide gli eventi per categoria */
  $scope.getEventsbyCategory = function () {
    for (var i in $scope.dbObject) {
      for (var j = 0; j < $scope.dbObject[i].category.length; j++) {
        /*eventsByCategory[$scope.dbObject[i].category[j]].push($scope.dbObject[i].title);*/
        if ($scope.dbObject[i].category[j] == "Sociale") {
          $scope.eventsByCategory.Sociale.push($scope.dbObject[i]);
        } else if ($scope.dbObject[i].category[j] == "Cultura") {
          $scope.eventsByCategory.Cultura.push($scope.dbObject[i]);
        } else if ($scope.dbObject[i].category[j] == "Sport") {
          $scope.eventsByCategory.Sport.push($scope.dbObject[i]);
        } else {
          $scope.eventsByCategory.Other.push($scope.dbObject[i]);
        }
      }
    }
    console.log($scope.eventsByCategory);
  };
});
