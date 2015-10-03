'use strict';

var app = angular.module('utsovPOS', []);
 
app.controller('carouselCtrl', function ($scope, $http) {
	$scope.w = window.innerWidth;
	$scope.h = window.innerHeight;
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
    $scope.found = 0;
    $scope.showResults = false;
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;
    $scope.newpatron = true;
    $scope.title = "Register your patronage";
    $scope.service = '../api/pos.php';
    $scope.admin = false; //for admin user functionality
    $scope.formData.regyear = 2015;
    //console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);
    
    //The find function
    $scope.SearchPatron = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.formData.action = 'search';
        console.log("Running search...");
        $scope.showResults = true;
        $scope.found = -2;
        $http.post($scope.service,  $scope.formData
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.msgs = "Server: " + output.msg;
                $scope.searchResults = output.data;
                $scope.found = $scope.searchResults.length;
                console.log($scope.msgs);
            }
            else{
                $scope.errors = "Error: " + output.err;
                $scope.msgs = output.msg;
                $scope.found = -1;
                console.log($scope.errors);
                
            }
        }).error(function(output, status){
            $scope.errors = "Status: " + status;
            $scope.found = -1;
            console.log($scope.errors);
        });
    }
    
    //The actual add function
    $scope.SubmitRegistration = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;

        $scope.formData.action = 'add';
        console.log("Running submit registration...");
        
        $http.post($scope.service,  $scope.formData
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.msgs = "Server: " + output.msg;
                $scope.success = 1;
                $scope.postData = output.post;
                $scope.clearData();
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
    
    $scope.massageResults = function (field, data) {
        //var retVal = '';
        switch (field)
        {
            case 'name':
                return data.split(' ')[0];
                break;
            case 'email':
                return "***@" + data.split('@')[1];
                break;
            case 'phone':
                return data.substr(0, 3) + "***" + data.substr(6, 4);
                break;
            default:
                return data;
        }
    }
    
    $scope.clearData = function () {
        $scope.formData = {};
        $scope.massagedResults = {};
        $scope.errors = '';
        
        //$scope.msgs = '';
        $scope.success = 0;
        $scope.found = 0;
        $scope.showResults = false;
        $scope.newpatron = true;
    }
});

