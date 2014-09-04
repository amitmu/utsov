'use strict';

var utsovContactApp = angular.module('utsovContactApp', ['ngRoute']);

var utsovEventApp = angular.module('utsovEventApp', ['ngRoute']);


utsovContactApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/AddSponsor', {
        templateUrl: 'templates/modalsvsponsor.html',
        controller: 'ContactController',
        action: 'SPON'
      }).
      when('/AddVolunteer', {
        templateUrl: 'templates/modalsvcontact.html',
        controller: 'ContactController',
        action: 'VOL'
      }).
      when('/AddSubmission', {
        templateUrl: 'templates/modalsvcontest.html',
        controller: 'ContactController',
        action: 'CON'
      }).
      when('/AddDonation', {
        templateUrl: 'templates/savedonation.html',
        controller: 'ContactController',
        action: 'DON'
      });
}]);


utsovEventApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/BhogSponsor', {
        templateUrl: 'templates/modalsvbhog.html',
        controller: 'EventController',
        action: 'SPON'
      }).
      when('/EventRegistration', {
        templateUrl: 'templates/modalsvcontest.html',
        controller: 'EventController',
        action: 'CON'
      });
}]);

utsovContactApp.controller('ContactController', function ($scope, $route, $http) {

    //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;

    $scope.action = $route.current.action;
    switch ($route.current.action)
    {
        case 'VOL':
            $scope.title = "Register To Volunteer";
            $scope.service = 'api/volunteers.php';
            break;
        case 'SPON':
            $scope.title = "Register For Sponsorship";
            $scope.service = 'api/sponsors.php';
            break;
        case 'CON':
            $scope.title = "Register For Contest";
            $scope.service = 'api/contests.php';
            break;
         case 'DON':
            $scope.title = "Donate with Paypal";
            $scope.service = 'api/donations.php';
            break;
    }

    console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

    //The actual add function
    $scope.SubmitFormData = function () {
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


utsovEventApp.controller('EventController', function ($scope, $route, $http) {

    //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;

    $scope.action = $route.current.action;
    switch ($route.current.action)
    {
        case 'SPON':
            $scope.title = "Register for Bhog Sponsorship";
            $scope.service = 'api/sponsors.php';
            break;
        case 'CON':
            $scope.title = "Register For Contest";
            $scope.service = 'api/contests.php';
            break;
    }

    console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

    //The actual add function
    $scope.SubmitFormData = function () {
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


//Bootstraping the two modules on the page
angular.element(document).ready(function() {
      var divContact = document.getElementById("events");
      angular.bootstrap(divContact, ["utsovEventApp"]);

      var divEvent = document.getElementById("contact");
      angular.bootstrap(divEvent, ["utsovContactApp"]);
});
