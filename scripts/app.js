/// <reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />

//quick enhancement to add the length to objects, not just arrays
// Object.prototype._length = function () {
//   return Object.keys(this).length;
// };

(function () {
    var app = angular.module('myapp', ['ngResource', 'ngMaterial']);
    angular.module('myapp').config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
          .primaryPalette('indigo')
          .accentPalette('lime');
      });
    angular.module('myapp').controller('appController', ['$scope', '$http', '$resource', '$filter', '$mdSidenav', '$mdDialog', '$mdToast', function ($scope, $http, $resource, $filter, $mdSidenav, $mdDialog, $mdToast) 
    {
        $scope.toggleLeft = function () {
            $mdSidenav('left').toggle();
        };

        $scope.portfolio = {};
        $http.get('https://trello.com/b/bgLwimyQ/maxs-web-portfolio.json').then(function(trelloReponse){
            console.log(trelloReponse);
            $scope.portfolio.tags = trelloReponse.data.labels;
            $scope.portfolio.categories = trelloReponse.data.lists;
            $scope.portfolio.websites = trelloReponse.data.cards;
        }, function(httpResp){

        });
    }]);
})();