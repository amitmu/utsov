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
        controller: 'SponsorController'
      }).
      when('/ListVolunteers', {
        templateUrl: 'templates/volunteers.html',
        controller: 'VolunteerController',
        action: 'LIST'
      }).
      when('/ShowVolunteer/:volId', {
        templateUrl: 'templates/savevolunteer.html',
        controller: 'VolunteerController',
        action: 'EDIT'
      }).
      when('/AddVolunteer', {
        templateUrl: 'templates/savevolunteer.html',
        controller: 'VolunteerController',
        action: 'ADD'
      }).
      when('/ListSubmissions', {
        templateUrl: 'templates/contest.html',
        controller: 'ContestController'
      }).
      when('/ListDonations', {
        templateUrl: 'templates/donation.html',
        controller: 'DonationController'
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

utsovAdminApp.controller('VolunteerController', function ($scope, $route, $http) {

    $scope.errors = [];
    $scope.msgs = [];
    $scope.formData = {};

    $scope.title = "Registered Volunteers";
    $scope.action = $route.current.action;
    $scope.volId = $route.volId;

    //retrieving data

    if($scope.action == 'LIST'){ //listing all
        console.log("Into list");
        $http.post('api/volunteers.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if (output.msg !== ''){
                $scope.volunteers = output.data;
                $scope.msgs.push("Server: " + output.msg);
            }
            else{
                $scope.errors.push("Error: " + output.err);
            }
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
        console.log("Title: " + $scope.title);
    }
    else {

        //This is Add - nothing to be done
    }

    $scope.SubmitVol = function () {
        $scope.errors.splice(0, $scope.errors.length);$
        $scope.msgs.splice(0, $scope.msgs.length);
        $scope.formData.action = 'add';
        $http.post('api/volunteers.php',  $scope.formData
        ).success(function(output, status, headers, config) {
            $scope.msgs.push("Server: " + output.msg);
            $scope.postData = output.post;
            $scope.errors.push("Error: " + output.err);
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
    }
});

utsovAdminApp.controller('SponsorController', function ($scope, $http) {
    $scope.title = "Contacts for Sponsorship";
    $scope.errors = [];
    $scope.msgs = [];
    //retrieving data
    $http.post('api/sponsors.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if (output.msg !== ''){
                $scope.contestents = output.data;
                $scope.msgs.push("Server: " + output.msg);
            }
            else{
                $scope.errors.push("Error: " + output.err);
            }
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
});

utsovAdminApp.controller('ContestController', function ($scope, $http) {
    $scope.title = "Contest Submissions";
    $scope.errors = [];
    $scope.msgs = [];
    //retrieving data
    $http.post('api/contests.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if (output.msg !== ''){
                $scope.contestents = output.data;
                $scope.msgs.push("Server: " + output.msg);
            }
            else{
                $scope.errors.push("Error: " + output.err);
            }
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
});

utsovAdminApp.controller('DonationController', function ($scope, $http) {
    $scope.title = "Donations Captured";
    $scope.errors = [];
    $scope.msgs = [];
    //retrieving data
    $http.post('api/donations.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if (output.msg !== ''){
                $scope.contestents = output.data;
                $scope.msgs.push("Server: " + output.msg);
            }
            else{
                $scope.errors.push("Error: " + output.err);
            }
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
});
