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
        //console.log("Broadcasting change from service...")
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
		'1024',
        '1600',
		'1900'
	];
    
    $scope.messages = [
		'Welcome to the 2017 Utsov Pujo.',
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
	//console.log("W:H = "  + $scope.w + ":" + $scope.h);
    
    $scope.selectFolder = function (folder) {
		$scope.currentFolder = folder;
        /*switch (folder)
        {
            case '1024':
                $scope.w = 1024;
	            $scope.h = 760; 
                break;
            case '1600':
                $scope.w = 1600;
	            $scope.h = 870;
                break;
            case '1900':
                $scope.w = 1900;
                $scope.h = 1000;
                break;
            default:
                $scope.w = window.innerWidth;
	            $scope.h = window.innerHeight;
                break;
        }*/
        $scope.w = window.innerWidth;
	    $scope.h = window.innerHeight;
	}
	
    $scope.activeFolder = function (folder) {
        //console.log("Asked:"  + folder + ", Current:" + $scope.currentFolder);
		return (folder === $scope.currentFolder) ? 'active' : '';
	}    
    
    $scope.getMessage = function(index) {
        //console.log("Message Index = " + index);
        return (index < $scope.messages.length ? $scope.messages[index] : $scope.messages[index - $scope.messages.length]);
    }
    
    $scope.signOut = function(){
        //console.log("Signing out user...");
        userInfoService.updateUser('GUEST', 'Patron');
    }
    
    $scope.$on('userChanged', function(){
        $scope.user.name = userInfoService.name;
        $scope.user.type = userInfoService.type;
        //console.log("User:" + $scope.user.name + "[" + $scope.user.type + "]");
        //console.log("Trapping Event in carousel controller");
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

    //console.log("Action:" + $scope.action);
    //console.log("Service:" + $scope.service);
    //console.log("Title:" + $scope.title);

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
                //console.log("Raising Event in login controller");
                //console.log("User:" + newUserName + "[" + newUserType + "]");
                
                userInfoService.updateUser(newUserType, newUserName);
                
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
    
    $scope.$on('userChanged', function(){
        if($scope.user.name !== userInfoService.name)
        {//i.e. Logout happened outside this controller
            $scope.user.name = userInfoService.name
            $scope.user.type = userInfoService.type;
            $scope.success = 0;
            $scope.formData = {};
        }
    });
    
});


app.controller('registerCtrl', function ($scope, $http, userInfoService) {

    //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.registrations = {};
    $scope.currentYear = new Date().getFullYear(); 
    $scope.formData.regyear = $scope.currentYear; //2015;
    $scope.found = 0;
    $scope.showResults = false;
    $scope.foundPatron = false;
    $scope.patronLoaded = false;
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;
    $scope.title = "Register your patronage";
    $scope.service = '../api/pos.php';
    $scope.user = {};
    $scope.user.type = 'GUEST';
    //$scope.registrations = [{"id":0, "year":"No Data", "donation":0, "date":"20150101:010101", "headcount":0}];
    $scope.isAdminUser = false; //for admin user functionality
    //console.log("Action:" + $scope.action);
    //console.log("Service:" + $scope.service);
    //console.log("Title:" + $scope.title);
    
    //The find function
    $scope.SearchPatron = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;
        $scope.formData.action = 'search';
        //console.log("Running search...");
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
    
    //select function
    $scope.SelectPatron = function(patronIndex){
      
        //console.log("Selected Index = " +patronIndex);
        if ($scope.searchResults[patronIndex]) {
            $scope.errors = '';
            $scope.msgs = '';
            $scope.formData = $scope.searchResults[patronIndex];
            $scope.formData.regyear = $scope.currentYear;//2015;
            $scope.formData.action = 'details';

            if(!$scope.formData.name1 || !$scope.formData.email1 || !$scope.formData.phone1){
                $scope.allReqFieldsPresent = false;
            } else{
                $scope.allReqFieldsPresent = true;
            }

            //$scope.formData.id = $scope.searchResults[patronIndex].id;
            
            //retrieve all registrations for selected patron
            $http.post($scope.service,  $scope.formData
            ).success(function(output, status, headers, config) {
                if (output.err == ''){
                    $scope.msgs = "Server: " + output.msg;
                    $scope.registrations = output.data;
                    if($scope.registrations == null || $scope.registrations == undefined || $scope.registrations.length == 0){
                        //$scope.registrations = [{"id":0, "year":"No Data", "donation":0}];
                         $scope.registrations = {};
                    }

                    //console.log("Donation Value:" + $scope.registrations[0].donation);
                    //console.log("Star Count:" + $scope.massageResults('donation', $scope.registrations[0].donation) );
                }
                else{
                    $scope.errors = "Error: " + output.err;
                    $scope.msgs = output.msg;
                    //$scope.registrations = [{"id":0, "year":"No Data", "donation":0, "date":"20150101:010101", "headcount":0}];
                    $scope.registrations = {};
                    //$scope.found = -1;
                    console.log($scope.errors);
                    console.log($scope.msgs);
                    
                }
            }).error(function(output, status){
                $scope.errors = "Status: " + status;
                $scope.msgs = output.msg;
                //$scope.found = -1;
                //$scope.registrations = [{"id":0, "year":"No Data", "donation":0, "date":"20150101:010101", "headcount":0}];
                $scope.registrations = {};
                console.log($scope.errors);
                console.log($scope.msgs);
            });
            
            
            
            $scope.showResults = false;
            if($scope.isAdminUser){
               //admin user, allow updates
                $scope.foundPatron = false;
                $scope.patronLoaded = true;
            }
            else{
                //non-admin hide update fields
                $scope.foundPatron = true;
            }
            
            //console.log("Selected Patron ID = " + $scope.formData.id);
        } else {
            $scope.formData = {};
            $scope.formData.regyear = $scope.currentYear; //2015;
            $scope.errors = "ERROR: Unable to load selected patron - " + patronIndex;
            $scope.success = 2;
        }
        
    }
    
    $scope.SelectRegistration = function(regIndex){
        //filling in registration on selection
        console.log("Selected Registration Index = " +regIndex);
        if ($scope.registrations[regIndex]) {
            
            $scope.formData.regid = parseInt($scope.registrations[regIndex]['id']);
            $scope.formData.regyear = parseInt($scope.registrations[regIndex]['year']);
            $scope.formData.donamount = parseFloat($scope.registrations[regIndex]['donation']);
            $scope.formData.regmsg = $scope.registrations[regIndex]['message'];
            $scope.formData.regcount = parseInt($scope.registrations[regIndex]['headcount']);

            $scope.formData.updateRegistration = true;

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
        //console.log("Running submit registration...");
        //console.log("Patron Id:", $scope.formData.id);
        $http.post($scope.service,  $scope.formData
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.msgs = "Server: " + output.msg;
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

    $scope.isFieldValValid = function(value) {
        //return !(value === "" || value === null || typeof value === "undefined");
        return false;
    }

    $scope.isValidZip = function(value) {
        console.log(value, !(value === "" || value === null || typeof value === "undefined") && /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value));
        return !(value === "" || value === null || typeof value === "undefined") && /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value);
    }

    $scope.isValidEmail = function(value) {
        //return !(value === "" || value === null || typeof value === "undefined") && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        return false;
    }
    $scope.isValidPhone = function(value) {
        //return !(value === "" || value === null || typeof value === "undefined") && /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
        return false;
    }

    $scope.massageResults = function (field, data) {

        if(!data) return "";
        //ignore if admin user by forcing default case
        if($scope.isAdminUser && field !== "date"){field = "xx"};
        
        switch (field)
        {
            case 'name':
                return data.split(' ')[0] + " ***";
                break;
           /* case 'email':
                return "***@" + data.split('@')[1];
                break;*/
            case 'phone':
                return data.substr(0, 3) + "***" + data.substr(6, 4);
                break;
            case 'donation':
                //console.log("Massaging donation Amount: "  + data );
                var don = 0;
                if(isNaN(data) || data < 50) {don = 0;}
                //else if(data < 50){don = 1;}
                //else if(data < 100){don = 2;}
                else{ 
                    don = data - 49; //avoiding divide by zero error 
                    don = Math.floor(don/25); 
                    don += 1;
                }
                
                //console.log("Star Count = " + don)
                //forcing 5 star max
                if(don > 5){don = 5};
                return Array.apply(0, Array(+don));
                
                break;
            case 'date':
                //console.log("Converting Date = " + data);
                var retDate = new Date(data.substring(0,4), data.substring(4,6), data.substring(6,8), data.substring(9,11), data.substring(11,13), data.substring(13,15));
                //console.log("Returning: " + retDate.toLocaleString());
                
                return retDate.toLocaleString();
                        
                break;
            default:
                return data;
                break;
        }
    }
    
    $scope.clearData = function () {
        $scope.formData = {};
        $scope.formData.regyear =  $scope.currentYear; //2015;
        $scope.searchResults = {};
        //$scope.registrations = [{"id":0, "year":"No Data", "donation":0, "date":"20150101:010101", "headcount":0}];
        $scope.registrations = {};
        $scope.errors = '';
        
        //$scope.msgs = '';
        $scope.success = 0;
        $scope.found = 0;
        $scope.showResults = false;
        $scope.foundPatron = false;
        $scope.patronLoaded = false;
    }
    
    $scope.checkNumber= function(data){
        var retVal = data - 0;
        if(isNaN(retVal)){retVal = 0;}
        //console.log("Returning " + retVal);
        return retVal; 
    }
    
    $scope.$on('userChanged', function(){
        $scope.user.name = userInfoService.name;
        $scope.user.type = userInfoService.type;
        $scope.isAdminUser =  ($scope.user.type == 'ADMIN');
        //console.log("Trapping Event in registration controller");
        //console.log("User:" + $scope.user.name + "[" + $scope.user.type + "]");

    });
    
});
