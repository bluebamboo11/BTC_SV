angular.module('MyApp', ['ngMaterial'])
    .controller('AppCtrl', function ($scope, $http, $mdDialog, $mdToast) {
        $scope.lastPrice = 0;
        $scope.bidPrice = 0;

        function GetMarket() {
            $http({
                method: 'GET',
                url: 'getInfo'
            }).then(function successCallback(response) {
                $scope.lastPrice = response.data.last;
                $scope.bidPrice = response.data.low
            }, function errorCallback(response) {

            });
        }

        $scope.addTradeBuy = function () {

            $http({
                method: 'POST',
                url: 'addTradeBuy',
                data:
                    {
                        apiKey: $scope.apiKey,
                        apiSecret: $scope.apiSecret,
                        amount: $scope.amount,
                        percent: $scope.percent,
                        code:$scope.code
                    },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                console.log(response.data);
                if (response.data.error) {
                    $scope.lastPrice = response.data.last;
                    $scope.bidPrice = response.data.low
                }{
                    alert('Lỗi : '+JSON.stringify(response.data));
                }
            }, function errorCallback(response) {

            });
        }
        $scope.addTradeSell = function () {
            $http({
                method: 'POST',
                url: 'addTradeSell',
                data:
                    {
                        apiKey: $scope.apiKey,
                        apiSecret: $scope.apiSecret,
                        amount: $scope.amount,
                        percent: $scope.percent,
                        code:$scope.code
                    },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                console.log(response.data);

            }, function errorCallback(response) {

            });
        }
    });