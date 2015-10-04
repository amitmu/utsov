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
    $scope.foundPatron = false;
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
        $scope.success = 0;
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
                //console.log($scope.msgs);
            }
            else{
                $scope.errors = "Error: " + output.err;
                $scope.msgs = output.msg;
                $scope.found = -1;
                //console.log($scope.errors);
                
            }
        }).error(function(output, status){
            $scope.errors = "Status: " + status;
            $scope.found = -1;
            //console.log($scope.errors);
        });
    }
    
    
    $scope.SelectPatron = function(patronIndex){
      
        console.log("Selected Index = " +patronIndex);
        if ($scope.searchResults[patronIndex]) {
            $scope.formData = $scope.searchResults[patronIndex];
            $scope.showResults = false;
            $scope.foundPatron = true;
            console.log("Selected Patron ID = " + $scope.formData.id);
        } else {
            $scope.formData = {};
            $scope.errors = "ERROR: Unable to load selected patron - " + patronIndex;
            $scope.success = 2;
        }
        
    }
    
    //The actual add function
    $scope.SubmitRegistration = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;

        $scope.formData.action = 'register';
        console.log("Running submit registration...");
        console.log("Patron Id:", $scope.formData.id);
        $http.post($scope.service,  $scope.formData
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.msgs = "Server: " + output.msg;
                //$scope.success = 1;
                //$scope.postData = output.post;
                $scope.clearData();
                $scope.success = 1;
                console.log($scope.msgs);
            }
            else{
                $scope.errors = "Error: " + output.err;
                $scope.msgs = output.msg;
                $scope.success = 2;
                console.log($scope.errors);
                console.log($scope.msgs);
            }
        }).error(function(output, status){
            $scope.errors = "Status: " + status;
            $scope.success = 2;
            console.log($scope.errors);
            console.log($scope.msgs);
        });
    }
    
    $scope.massageResults = function (field, data) {
        
        //ignore if admin user by forcing default case
        if($scope.admin){field = "xx"};
        
        switch (field)
        {
            case 'name':
                return data.split(' ')[0] + " ***";
                break;
            case 'email':
                return "***@" + data.split('@')[1];
                break;
            case 'phone':
                return data.substr(0, 3) + "***" + data.substr(6, 4);
                break;
            case 'donation':
                if(isNaN(data)) {return 0;}
                if(data < 25){return 0;}
                if(data < 50){return 1;}
                if(data < 100){return 2;}
                var don = data - 100;
                don = Math.floor(don/25); 
                don += 2;
                return don;
                break;
            default:
                return data;
                break;
        }
    }
    
    $scope.clearData = function () {
        $scope.formData = {};
        $scope.formData.regyear = 2015;
        $scope.searchResults = {};
        $scope.errors = '';
        
        //$scope.msgs = '';
        $scope.success = 0;
        $scope.found = 0;
        $scope.showResults = false;
        $scope.foundPatron = false;
        $scope.newpatron = true;
    }
});

