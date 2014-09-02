

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
        controller: 'VolunteerController'
      }).
      when('/ListSubmissions', {
        templateUrl: 'templates/contest.html',
        controller: 'ContestController'
      }).
      otherwise({
        templateUrl: 'templates/front.html',
        controller: 'FrontpageController'
      });
}]);



utsovAdminApp.controller('UtsovAdminController', function ($scope, $http) {
    $scope.errors = [];
    $scope.msgs = [];
    $scope.formData = {};
    $scope.postData = {};
    $scope.GetVolunteers = function () {
        //clearing errors and messages
        $scope.errors.splice(0, $scope.errors.length);
        $scope.msgs.splice(0, $scope.msgs.length);
        $scope.msgs.push("Getting Volunteers");
        $http.post('api/contacts.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if (output.msg !== ''){
                $scope.contacts = output.data;
                $scope.msgs.push("Server: " + output.msg);
            }
            else{
                $scope.errors.push("Error: " + output.err);
            }
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
    }

    $scope.GetUsers = function () {
        //clearing errors and messages
        $scope.errors.splice(0, $scope.errors.length);
        $scope.msgs.splice(0, $scope.msgs.length);
        $scope.msgs.push("Getting Users");
        $http.post('api/users.php', {"action" : "list"}
        ).success(function (output, status, headers, config) {
            if (output.msg !== '') {
                $scope.users = output.data;
                $scope.msgs.push("Server: " + output.msg);
            }
            else {
                $scope.errors.push("Error: " + output.err);
            }
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
    }

    $scope.SubmitVol = function () {
        $scope.errors.splice(0, $scope.errors.length);$
        $scope.msgs.splice(0, $scope.msgs.length);
        $scope.msgs.push("Submitting Volunteer");
        $scope.formData.action = 'add';

        $http.post('api/contacts.php',  $scope.formData
        ).success(function(output, status, headers, config) {
            //if(output.msg !== ''){
                //$scope.users = output.data;
            $scope.msgs.push("Server: " + output.msg);
            $scope.postData = output.post;
            //}
            //else{
            $scope.errors.push("Error: " + output.err);
            //}
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
    }

});


utsovAdminApp.controller('UserController', function ($scope, $http) {

    $scope.message = "System Users";
    $scope.GetUsers = function () {
        //clearing errors and messages
        $scope.errors.splice(0, $scope.errors.length);
        $scope.msgs.splice(0, $scope.msgs.length);
        $scope.msgs.push("Getting Users");
        $http.post('api/users.php', {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if(output.msg !== ''){
                $scope.users = output.data;
                $scope.msgs.push("Server: " + output.msg);
            }$
            else{$
                $scope.errors.push("Error: " + output.err);
            }
        }).error(function(output, status){
            $scope.errors.push("Status: " + status);
        });
    }

});

utsovAdminApp.controller('FrontpageController', function ($scope, $http) {
    $scope.header = "Utsov Admin Page";
});

utsovAdminApp.controller('UserController', function ($scope, $http) {
    $scope.header = "Utsov Admin Users";
});

utsovAdminApp.controller('VolunteerController', function ($scope, $http) {
    $scope.header = "Registered Volunteers";

     /* $scope.errors = [];
    $scope.msgs = [];
    //retrieving data
    $http.post('api/contacts.php', {"action" : "list"}
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
        });*/

});

utsovAdminApp.controller('SponsorController', function ($scope, $http) {
    $scope.header = "Contacts for Sponsorship";
});

utsovAdminApp.controller('ContestController', function ($scope, $http) {
    $scope.header = "Contest Submissions";
});
