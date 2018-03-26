/// <reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />

//quick enhancement to add the length to objects, not just arrays
// Object.prototype._length = function () {
//   return Object.keys(this).length;
// };

///Set up Angular App
(function () {
    var app = angular.module('myapp', ['ngResource', 'ngMaterial', 'ngSanitize']);
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

        //function for when X is clicked to close the portfolio details popup
        $scope.closeDialog = function () {
            $scope.portfolioDetail = {};
            $mdDialog.hide();
        };

        //functions for next and prev image chevrons
        $scope.setPortfolioDetailImage = function (imageIndex) {
            $scope.portfolioDetail.currentImage = null;
            if ($scope.portfolioDetail.attachments[imageIndex].previews.length >= 1) {
                $scope.portfolioDetail.currentImage = $scope.portfolioDetail.attachments[imageIndex];
                $scope.setPortfolioDetailNextImage(imageIndex + 1);
                $scope.setPortfolioDetailPrevImage(imageIndex - 1);
            }
            else {
                //try next one
                $scope.setPortfolioDetailImage(imageIndex +1);
            }
        };
        $scope.setPortfolioDetailNextImage = function (imageIndex) {
            $scope.portfolioDetail.nextImageIndex = false;
            if ($scope.portfolioDetail.attachments[imageIndex] === void 0) {
                return; //no more images
            }
            if ($scope.portfolioDetail.attachments[imageIndex] !== void 0 && $scope.portfolioDetail.attachments[imageIndex].previews.length === 0) {
                //try next one
                $scope.setPortfolioDetailNextImage(imageIndex + 1);
                return;
            }
            if ($scope.portfolioDetail.attachments[imageIndex] !== void 0 && $scope.portfolioDetail.attachments[imageIndex].previews.length >= 1) {
                $scope.portfolioDetail.nextImageIndex = imageIndex;
            }
        };

        $scope.setPortfolioDetailPrevImage = function (imageIndex) {
            $scope.portfolioDetail.prevImageIndex = false;
            if ($scope.portfolioDetail.attachments[imageIndex] === void 0) {
                return; //no more images
            }
            if ($scope.portfolioDetail.attachments[imageIndex] !== void 0 && $scope.portfolioDetail.attachments[imageIndex].previews.length === 0) {
                //try Prev one
                $scope.setPortfolioDetailPrevImage(imageIndex - 1);
                return;
            }
            if ($scope.portfolioDetail.attachments[imageIndex] !== void 0 && $scope.portfolioDetail.attachments[imageIndex].previews.length >= 1) {
                $scope.portfolioDetail.prevImageIndex = imageIndex;
            }
        };

        $scope.showPortfolioDetail = function (portfolioItem) {
            $scope.portfolioDetail = portfolioItem;
            var md = markdownit();
            $scope.portfolioDetail.htmlDesc = md.render($scope.portfolioDetail.desc);
            $scope.setPortfolioDetailImage(0);
            $mdDialog.show({
                contentElement: '#portfolioItemDialog',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        //helper function to get the item in an array with the key Name and the value as given name (if it has one)
        $scope.getNameFromArray = function (arr, nm) {
            if (arr instanceof Array && nm != null) {
                for (var i = 0, length = arr.length; i < length; i++) {
                    if (arr[i].name && arr[i].name === nm)
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