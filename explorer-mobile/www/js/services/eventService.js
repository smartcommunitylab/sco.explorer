angular.module('explorer.services.event', [])

.factory('eventService', function ($http, $q, Config) {
      $scope.getIdEvent = function(evento){
        return evento.id;
      }

});
