'use strict';

var app = angular.module('utsovPOS', []);

app.factory('userInfoService', function($rootScope){
    
    var userInfo = {};
    
    userInfo.type = 'GUEST';
    userInfo.name = 'Patron';
    
    userInfo.updateUser = function(newUserType, newUserName){
        this.type = newUserType;
        this.name = newUserName;
        this.publishUser();
    };
    
    userInfo.publishUser = function() {
        console.log("Broadcasting change from service...")
        $rootScope.$broadcast('userChanged');    
    };
    
    return userInfo;
});
 
app.controller('carouselCtrl', function ($scope, $http, userInfoService) {
	$scope.w = window.innerWidth;
	$scope.h = window.innerHeight;
    $scope.user = {};
    $scope.user.type = 'GUEST';
    $scope.user.name = 'Patron';
	$scope.folders = [
		'small',
        'reg',
		'wide'
	];
    
    $scope.messages = [
		'Welcome to the 2015 Utsav Pujo.',
        'Please remember to donate.',
		'Join us in efforts.',
        'Every donated dollar helps.',
        'Ask an Utsov team member.',
        'Or visit our website.',
        'Enjoy a special musical performance.',
        'Enjoy tastes and flavours of India.',
        'Snacks available for purchase.',
        'Register on the website to join us.',
        'Have a safe and happy Pujo.'
	];
    
	$scope.images = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
	$scope.currentFolder = $scope.folders[0];
	$scope.selectFolder = function (folder) {
		$scope.currentFolder = folder;
	}
	
    $scope.activeFolder = function (folder) {
		return (folder === $scope.currentFolder) ? 'active' : '';
	}    
    
    $scope.getMessage = function(index) {
        console.log("Message Index = " + index);
        return (index < $scope.messages.length ? $scope.messages[index] : $scope.messages[index - $scope.messages.length]);
    }
    
    $scope.signOut = function(){
        console.log("Signing out user...");
        userInfoService.updateUser('GUEST', 'Patron');
    }
    
    $scope.$on('userChanged', function(){
        $scope.user.name = userInfoService.name;
        $scope.user.type = userInfoService.type;
        console.log("Trapping Event in carousel controller");
        console.log("User:" + $scope.user.name + "[" + $scope.user.type + "]");
    });
});


app.controller('loginCntrl', function ($scope, $http, userInfoService) {

    $scope.errors = '';
    $scope.msgs = '';
    $scope.user = {};
    $scope.user.type = 'GUEST';
    $scope.title = "Admin Login";
    $scope.service = '../api/status.php';
    $scope.status = 0;
    $scope.success = 0;

    console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

    $scope.initialize = function(){
        
        $scope.formData = {};
        $scope.success = 0;
        $scope.errors = '';
        $scope.msgs = '';
        $scope.user = {};
    }
     //The login function
    $scope.LoginUser = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;
        $scope.formData.action = "login";
        $http.post($scope.service,  $scope.formData
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.msgs = "Server: " + output.msg;
                $scope.success = 1;
                $scope.user = output.data[0];
                var newUserType = '';
                var newUserName = '';
                if($scope.user.utsov_access == 'W' || $scope.user.capture_access == 'W' || $scope.user.sponsor_access == 'W'){
                    newUserType = 'ADMIN';
                }
                else{
                    newUserType = 'USER';
                }
                newUserName = $scope.user.name;
                
                console.log($scope.msgs);
                console.log("Raising Event in login controller");
                console.log("User:" + newUserName + "[" + newUserType + "]");
                
                userInfoService.updateUser(newUserType, newUserName);
                
            }
            else{
                $scope.errors = "Error: " + output.err;
                $scope.msgs = output.msg;
                $scope.success = 2;
                console.log($scope.errors);
            }
        }).error(function(output, status){
            $scope.errors = "Status: " + status;
            $scope.success = 2;
            console.log($scope.errors);
        });
    }
});


app.controller('registerCtrl', function ($scope, $http, userInfoService) {

    //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.formData.regyear = 2015;
    $scope.found = 0;
    $scope.showResults = false;
    $scope.foundPatron = false;
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;
    $scope.newpatron = true;
    $scope.title = "Register your patronage";
    $scope.service = '../api/pos.php';
    $scope.user = {};
    $scope.user.type = 'GUEST';
    $scope.isAdminUser = false; //for admin user functionality
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
            $scope.formData.regyear = 2015;
            $scope.showResults = false;
            $scope.foundPatron = true;
            console.log("Selected Patron ID = " + $scope.formData.id);
        } else {
            $scope.formData = {};
            $scope.formData.regyear = 2015;
            $scope.errors = "ERROR: Unable to load selected patron - " + patronIndex;
            $scope.success = 2;
        }
        
    }
    
    //The actual add function
    $scope.SubmitRegistration = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;
        $scope.user = {};
        $scope.user.type = 'GUEST';
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
        if($scope.isAdminUser){field = "xx"};
        
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
    
    $scope.$on('userChanged', function(){
        $scope.user.name = userInfoService.name;
        $scope.user.type = userInfoService.type;
        $scope.isAdminUser =  ($scope.user.type == 'ADMIN');
        console.log("Trapping Event in registration controller");
        console.log("User:" + $scope.user.name + "[" + $scope.user.type + "]");

    });
});
