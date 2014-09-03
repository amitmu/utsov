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
        controller: 'SponsorController',
        action: 'LIST'
      }).
      when('/AddSponsor', {
        templateUrl: 'templates/savesponsor.html',
        controller: 'SponsorController',
        action: 'ADD'
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
        controller: 'ContestController',
        action: 'LIST'
      }).
      when('/AddSubmission', {
        templateUrl: 'templates/savecontest.html',
        controller: 'ContestController',
        action: 'ADD'
      }).
      when('/ListDonations', {
        templateUrl: 'templates/donation.html',
        controller: 'DonationController',
        action: 'LIST'
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

    //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;

    $scope.title = "Registered Volunteers";
    $scope.action = $route.current.action;
    $scope.volId = $route.volId;

    //retrieving data

    if($scope.action == 'LIST'){ //listing all
        //console.log("Into list");
        $http.post('api/volunteers.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.volunteers = output.data;
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
    }
    else {

        //This is Add - nothing to be done
    }



    //The actual add function
    $scope.SubmitVol = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;
        $scope.formData.action = 'add';
        $http.post('api/volunteers.php',  $scope.formData
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



utsovAdminApp.controller('ContestController', function ($scope, $route, $http) {

    //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.success = 0;

    $scope.title = "Contest Submissions";
    $scope.action = $route.current.action;
    $scope.volId = $route.conId;

    ///retrieving data

    if($scope.action == 'LIST'){ //listing all
        //console.log("Into list");
        $http.post('api/contests.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            console.log("Error:" + output.err);
            console.log("Message:" + output.msg);
            if (output.err == ''){
                $scope.contestents = output.data;
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
    }
    else {

        //This is Add - nothing to be done
    }

     //The actual add function
    $scope.SubmitCon = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;
        $scope.formData.action = 'add';
        $http.post('api/contests.php',  $scope.formData
        ).success(function(output, status, headers, config) {
            console.log("Error:" + output.err);
            console.log("Message:" + output.msg);
            if (output.err == ''){
                $scope.msgs = "Server: " + output.msg;
                $scope.success = 1;
                //console.log($scope.msgs);
            }
            else{
                $scope.errors = "Error: " + output.err;
                $scope.msgs = output.msg;
                $scope.success = 2;
                //console.log($scope.errors);
            }
        }).error(function(output, status){$
            console.log("Error:" + output.err);
            console.log("Message:" + output.msg);
            $scope.errors = "Status: " + status;
            $scope.success = 2;
            //console.log($scope.errors);
        });
    }

});

utsovAdminApp.controller('SponsorController', function ($scope, $route, $http) {

     //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;

    $scope.title = "Contacts for Sponsorship";
    $scope.action = $route.current.action;
    $scope.volId = $route.sponId;

    //retrieving data

    if($scope.action == 'LIST'){ //listing all
        //console.log("Into list");
        $http.post('api/sponsors.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.sponsors = output.data;
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
    }
    else {

        //This is Add - nothing to be done
    }

    //The actual add function
    $scope.SubmitSpon = function () {
        $scope.errors = '';
        $scope.msgs = '';
        $scope.success = 0;
        $scope.formData.action = 'add';
        $http.post('api/sponsors.php',  $scope.formData
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.msgs = "Server: " + output.msg;
                $scope.success = 1;
                //console.log($scope.msgs);
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
            //console.log($scope.errors);
        });
    }
});

utsovAdminApp.controller('DonationController', function ($scope, $route, $http) {
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
