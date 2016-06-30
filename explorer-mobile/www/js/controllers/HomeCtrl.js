angular.module('explorer.controllers.home', [])

.controller('AppCtrl', function ($scope, $state, $ionicHistory, Config, Profiling, DbSrv) {
  /* Sync iniziale */
  DbSrv.sync().then(function (data) {
    console.log(data);
    console.log('DB syncronization');
  });
  // TODO error handling;
})

.controller('HomeCtrl', function ($scope, $state, $ionicHistory, Config, Profiling, DbSrv) {
  $scope.dBObject = null;
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


  /* Eatabase Object creation */

  var init = function () {
    DbSrv.getAllCategories().then(function (data) {
        $scope.dBObject = data;
        console.log($scope.dBObject);
        $scope.getEventsbyCategory();
        localStorage.updatedVersion = 'false';
      }) // TODO error handling;
  }

  if (!localStorage.currentDbVersion || localStorage.updatedVersion === 'true') {
    DbSrv.sync().then(function (data) {
      console.log(data);
      init();
    });
    // TODO error handling;
  }

  /* Divide gli eventi per categoria */

  $scope.getEventsbyCategory = function () {
    for (var i in $scope.dBObject) {
      for (var j = 0; j < $scope.dBObject[i].category.length; j++) {
        /*eventsByCategory[$scope.dBObject[i].category[j]].push($scope.dBObject[i].title);*/
        if ($scope.dBObject[i].category[j] == "Sociale") {
          $scope.eventsByCategory.Sociale.push($scope.dBObject[i]);
        } else if ($scope.dBObject[i].category[j] == "Cultura") {
          $scope.eventsByCategory.Cultura.push($scope.dBObject[i]);
        } else if ($scope.dBObject[i].category[j] == "Sport") {
          $scope.eventsByCategory.Sport.push($scope.dBObject[i]);
        } else {
          $scope.eventsByCategory.Other.push($scope.dBObject[i]);
        }
      }
    }
    console.log($scope.eventsByCategory);
  };
});
