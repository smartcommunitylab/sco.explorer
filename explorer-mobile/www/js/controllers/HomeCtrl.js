angular.module('explorer.controllers.home', [])

.controller('AppCtrl', function ($scope, $state, $ionicHistory, DatiDB) {
    $scope.openLink = function (link) {
        window.open(link, '_system');
    };
    DatiDB.sync().then(function (data) {
        console.log(data);
        console.log("DB syncronization");
    });
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
