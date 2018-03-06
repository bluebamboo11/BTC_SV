angular.module('MyApp', ['ngMaterial'])
    .controller('AppCtrl', function ($scope, $http, $mdDialog, $mdToast) {
        $scope.lastPrice=0;
        $scope.bidPrice =0;
        GetMarket();
        function GetMarket() {
            $http({
                method: 'GET',
                url: 'getInfo'
            }).then(function successCallback(response) {
                $scope.lastPrice=response.data.last;
                $scope.bidPrice=response.data.low
            }, function errorCallback(response) {

            });
        }
    });