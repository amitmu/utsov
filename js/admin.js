'use strict';

$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});

var utsovAdminApp = angular.module('utsovAdminApp', ['ngRoute']);


utsovAdminApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/ListUsers', {
        templateUrl: 'templates/users.html',
        controller: 'UserController'
    }).
      when('/ListSponsors', {
        templateUrl: 'templates/sponsors.html',
        controller: 'ListController',
        action: 'SPON'
      }).
      when('/AddSponsor', {
        templateUrl: 'templates/savesponsor.html',
        controller: 'AddController',
        action: 'SPON'
      }).
      when('/ListVolunteers', {
        templateUrl: 'templates/volunteers.html',
        controller: 'ListController',
        action: 'VOL'
      }).
      when('/ShowVolunteer/:volId', {
        templateUrl: 'templates/savevolunteer.html',
        controller: 'VolunteerController',
        action: 'VOL'
      }).
      when('/AddVolunteer', {
        templateUrl: 'templates/savevolunteer.html',
        controller: 'AddController',
        action: 'VOL'
      }).
      when('/ListSubmissions', {
        templateUrl: 'templates/contest.html',
        controller: 'ListController',
        action: 'CON'
      }).
      when('/AddSubmission', {
        templateUrl: 'templates/savecontest.html',
        controller: 'AddController',
        action: 'CON'
      }).
      when('/ListDonations', {
        templateUrl: 'templates/donation.html',
        controller: 'ListController',
        action: 'DON'
      }).
      otherwise({
        templateUrl: 'templates/front.html',
        controller: 'FrontpageController'
      });
}]);

utsovAdminApp.controller('FrontpageController', function ($scope, $http) {
    $scope.title = "Utsov Admin Page";
    console.log($scope.title);
});

utsovAdminApp.controller('UserController', function ($scope, $http) {
    $scope.title = "Utsov Admin Users";
    console.log($scope.title);
});

utsovAdminApp.controller('ListController', function ($scope, $route, $http) {
    //initializing....
    $scope.errors = '';
    $scope.msgs = '';

    $scope.action = $route.current.action;
    switch ($route.current.action)
    {
        case 'VOL':
            $scope.title = "Registered Volunteers";
            $scope.service = 'api/volunteers.php';
            break;
        case 'SPON':
            $scope.title = "Contacts for Sponsorship";
            $scope.service = 'api/sponsors.php';
            break;
        case 'CON':
            $scope.title = "Contest Submissions";
            $scope.service = 'api/contests.php';
            break;
        case 'DON':
            $scope.title = "Paypal Donations";
            $scope.service = 'api/donations.php';
            break;
    }

    console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

    $http.post($scope.service, {"action" : "list"}
    ).success(function(output, status, headers, config) {
        if (output.err == ''){
            $scope.resultset = output.data;
            $scope.msgs = "Server: " + output.msg;
            //console.log($scope.msgs);
        }
        else{
            $scope.errors = "Error: " + output.err;
            $scope.msgs = output.msg;
            //console.log($scope.errors);
        }
    }).error(function(output, status){
        $scope.errors = "Status: " + status;
        //console.log($scope.errors);
    });

});


utsovAdminApp.controller('AddController', function ($scope, $route, $http) {

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
