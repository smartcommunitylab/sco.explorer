angular.module('explorer.services.reviews', [])

.factory('reviewsService', function ($http, $q, Config, eventService) {

    var reviewsService = {};

    reviewsService.readReviews = function (id) {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: Config.URL() + '/' + Config.app() + '/social/readReviews/' + id,
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
            url: Config.URL() + '/' + Config.app() + '/social/review/' + eventService.getIdEvent(evento),evento,
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
            url: Config.URL() + '/' + Config.app() + '/social/attend/' + id + '/' + add,'',
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
            url: Config.URL() + '/' + Config.app() + '/social/edit/' + id + '/' + add,'',
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
