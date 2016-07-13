angular.module('explorer.controllers.events', [])

.controller('EventsCtrl', function ($scope, $state, $stateParams, $ionicScrollDelegate, $ionicPopup, Config, DbSrv) {
  $scope.events = null;

  var category = !!$stateParams['category'] ? $stateParams['category'] : 'All';

  // Cultura, Sociale, Sport, Other, All
  $scope.events = DbSrv.getDbObject()[category];

  $scope.filter = {
    open: false,
    toggle: function () {
      this.open = !this.open;
      if (this.open) {
        $ionicScrollDelegate.resize();
      }
    },
    filterBy: function (selection) {
      this.selected = selection;
      // you can use a watch to do the filtering
      $scope.updateList(this.selected);
      this.toggle();
    },
    options: [],
    selected: null
  };

  $scope.filter.options = DbSrv.getCategories();

  //$scope.$watch('filter.selected', function (newSelection, oldSelection) {});

  /* Date filter popup */
  var dateFilterPopup = $ionicPopup.show({
    templateUrl: 'templates/popup_eventsdatefilter.html',
    title: 'TEST',
    scope: $scope
  });
});
