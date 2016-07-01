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
  var now = moment().format("YYYY-MM-DD");
  console.log(now);
  /*var startOfDay = moment().startOf('day').unix() * 1000;
  var endOfDay = moment().endOf('day').unix() * 1000;
  console.log(startOfDay);
  console.log(endOfDay);*/

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
    }); // TODO error handling;
  }

  /* Get element by Id */
  $scope.getElementbyId = function (id) {
    return $scope.dbObject['All'][id];
  };

  /* Get elements by category */
  $scope.getElementsbyCategory = function (category) {
    return $scope.dbObject[category];
  };

  /* Get today elements by category*/

  /* TODO: FIX -> this is wrong, need a fix */

  $scope.getElementsbyDay = function (category) {
    var categoryObj = $scope.getElementsbyCategory(category);
    console.log(categoryObj);
    for (var i in categoryObj) {
      var fromDate = moment(categoryObj[i].fromTime).format("YYYY-MM-DD");
      var toDate = moment(categoryObj[i].toTime).format("YYYY-MM-DD");
      if (moment(now).isBetween(fromDate, toDate)) {
        console.log(categoryObj[i]);
      }
    }
  };

  /* Get next 7 days elements by category*/

  /* TODO: FIX -> this is wrong, need a fix */

  $scope.getElementsbyWeek = function (category) {
    var categoryObj = $scope.getElementsbyCategory(category);
    for (var i in categoryObj) {
      var fromDate = moment(categoryObj[i].fromTime).format("YYYY-MM-DD");
      var toDate = moment(categoryObj[i].toTime).format("YYYY-MM-DD");
      if (moment(now).isAfter(fromDate) && moment(now).add(1, "weeks").isBefore(toDate)) {
        console.log(categoryObj[i]);
      }
    }
  };

  /* Get next 30 days elements by category*/
  /* TODO: FIX -> this is wrong, need a fix */
  $scope.getElementsbyMonth = function (category) {
    var categoryObj = $scope.getElementsbyCategory(category);
    for (var i in categoryObj) {
      var fromDate = moment(categoryObj[i].fromTime).format("YYYY-MM-DD");
      var toDate = moment(categoryObj[i].toTime).format("YYYY-MM-DD");
      if (moment(now).isBetween(fromDate, toDate)) {
        console.log(categoryObj[i]);
      }
    }
  };
});
