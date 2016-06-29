angular.module('explorer.services.reviews', [])

.factory('ReviewsSrv', function ($http, $q, Config, EventSrv) {

    var reviewsService = {};

    reviewsService.readReviews = function (id) {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: Config.serverURL() + '/social/readReviews/' + id,
            headers: {
                'Accept': 'application/json'
            }
        }).
        success(function (data, status, headers, config) {
            deferred.resolve(data.data);
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(data.errorCode + ' ' + data.errorMessage);
        });

        return deferred.promise;
    };

    reviewsService.sendReview = function (evento) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: Config.serverURL() + '/social/review/' + eventService.getIdEvent(evento),evento,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).
        success(function (data, status, headers, config) {
            deferred.resolve(data.data);
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(data.errorCode + ' ' + data.errorMessage);
        });

        return deferred.promise;
    };

    reviewsService.attend = function (id, add) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: Config.serverURL() + '/social/attend/' + id + '/' + add,'',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).
        success(function (data, status, headers, config) {
            deferred.resolve(data.data);
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(data.errorCode + ' ' + data.errorMessage);
        });

        return deferred.promise;
    };

  reviewsService.edit = function (id, evento) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: Config.serverURL() + '/social/edit/' + id + '/' + add,'',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).
        success(function (data, status, headers, config) {
            deferred.resolve(data.data);
        }).
        error(function (data, status, headers, config) {
            console.log(data + status + headers + config);
            deferred.reject(data.errorCode + ' ' + data.errorMessage);
        });

        return deferred.promise;
    };

    return reviewsService;
});
