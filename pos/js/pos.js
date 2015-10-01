'use strict';

var app = angular.module('utsovPOS', []);
 
app.controller('carouselCtrl', function ($scope, $http) {
	$scope.w = window.innerWidth;
	$scope.h = window.innerHeight;
	//$scope.uri = "http://lorempixel.com";
	$scope.folders = [
		'2012',
		'2013',
		'2014',
	];
	$scope.images = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	$scope.currentFolder = $scope.folders[0];
	$scope.selectFolder = function (folder) {
		$scope.currentFolder = folder;
	};
	$scope.activeFolder = function (folder) {
		return (folder === $scope.currentFolder) ? 'active' : '';
	};
});


app.controller('registerCtrl', function ($scope, $http) {

    //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;
    $scope.title = "Register your patronage";
    $scope.service = '../api/volunteers.php';
    
    //console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

    $scope.SearchPatron = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.found = 0;
        $scope.formData.action = 'search';
    }
    
    //The actual add function
    $scope.SubmitRegistration = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;
        $scope.formData.action = 'add';
        $http.post($scope.service,  $scope.formData
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.msgs = "Server: " + output.msg;
                $scope.success = 1;
                $scope.postData = output.post;
                //console.log($scope.msgs);
            }
            else{
                $scope.errors = "Error: " + output.err;
                $scope.msgs = output.msg;
                $scope.success = 2;
                //console.log($scope.errors);
            }
        }).error(function(output, status){
            $scope.errors = "Status: " + status;
            $scope.success = 2;
            //console.log($scope.errors);
        });
    }
});

