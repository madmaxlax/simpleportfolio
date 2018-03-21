/// <reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />

//quick enhancement to add the length to objects, not just arrays
// Object.prototype._length = function () {
//   return Object.keys(this).length;
// };

///Set up Angular App
(function () {
    var app = angular.module('myapp', ['ngResource', 'ngMaterial']);
    //Set up the main controller
    angular.module('myapp').config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('lime');
    });
    angular.module('myapp').controller('appController', ['$scope', '$http', '$resource', '$filter', '$mdSidenav', '$mdDialog', '$mdToast', function ($scope, $http, $resource, $filter, $mdSidenav, $mdDialog, $mdToast) {
        //side nav toggle button
        $scope.toggleLeft = function () {
            $mdSidenav('left').toggle();
        };

        //initialize filter text
        $scope.portfolioSearchText = '';

        //helper function to get the item in an array with the key Name and the value as given name (if it has one)
        $scope.getNameFromArray = function(arr, nm) {
            if(arr instanceof Array && nm != null){
                for (var i = 0, length = arr.length; i < length; i++) {
                    if(arr[i].name && arr[i].name === nm)
                        return arr[i];
                }
            }
            else return null;//return empty object for invalid input
        };


        $scope.portfolio = {};
        //fetch the portfolio data from Trello
        $http.get('https://trello.com/b/bgLwimyQ/maxs-web-portfolio.json').then(function (trelloReponse) {
            console.log(trelloReponse.data);

            //set up the portfolio var
            $scope.portfolio.tags = trelloReponse.data.labels;
            $scope.portfolio.categories = trelloReponse.data.lists;
            $scope.portfolio.items = trelloReponse.data.cards;
            // $scope.portfolio.items.forEach(function(portfolioItem){
            //     console.log($scope.getNameFromArray(portfolioItem.attachments,'Link'));

            // });
        }, function (httpResp) {
            alert("Error loading portfolio from Trello!");
        });
    }]);
})();