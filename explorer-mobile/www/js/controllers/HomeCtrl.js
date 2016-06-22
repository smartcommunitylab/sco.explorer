angular.module('explorer.controllers.home', [])

.controller('AppCtrl', function ($scope, $state, $ionicHistory) {
    $scope.openLink = function (link) {
        window.open(link, '_system');
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
})

.controller('HomeCtrl', function ($scope) {

});
