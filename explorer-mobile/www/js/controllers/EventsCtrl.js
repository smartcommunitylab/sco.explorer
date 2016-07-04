angular.module('explorer.controllers.events', [])

.controller('EventsCtrl', function ($scope, $state, $stateParams, Config, DbSrv) {
  $scope.events = null;

  var category = !!$stateParams['category'] ? $stateParams['category'] : 'All';

  // Cultura, Sociale, Sport, Other, All
  $scope.events = DbSrv.getDbObject()[category];
});
