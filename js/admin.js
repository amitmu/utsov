'use strict';

$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
  $('[data-toggle="tooltip"]').tooltip();
});

var utsovAdminApp = angular.module('utsovAdminApp', ['ngRoute']);

utsovAdminApp.directive('changeOnBlur', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ngModelCtrl) {
      if (attrs.type === 'radio' || attrs.type === 'checkbox')
        return;

      var expressionToCall = attrs.changeOnBlur;

      var oldValue = null;
      elm.bind('focus',function() {
        scope.$apply(function() {
          oldValue = elm.val();
          console.log(oldValue);
        });
      })
      elm.bind('blur', function() {
        scope.$apply(function() {
          var newValue = elm.val();
          console.log(newValue, oldValue, newValue !== oldValue);
          if (newValue !== oldValue){
            scope.$eval(expressionToCall);
          }
          //alert('changed ' + oldValue);
        });
      });

      elm.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          oldValue = elm.val();
          scope.$eval(expressionToCall);
          event.preventDefault();
        }
      });
    }
  };
});

utsovAdminApp.run(function($rootScope) {

    $rootScope.IsLoggedIn = false;
    console.log("Initializing Login Status:" + $rootScope.IsLoggedIn);
})

utsovAdminApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/ListUsers', {
        templateUrl: 'templates/users.html',
        controller: 'ListController',
        action: 'USER'
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

utsovAdminApp.controller('FrontpageController', function ($scope, $http, $rootScope) {

    $scope.errors = '';
    $scope.msgs = '';
    $scope.user = {};
    $scope.title = "Utsov Dashboard";
    $scope.service = 'api/status.php';

    //$scope.user.IsLoggedIn = $rootScope.IsLoggedIn;

    console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

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
                $rootScope.IsLoggedIn = true;
                console.log("Setting Login Status:" + $rootScope.IsLoggedIn);
                $scope.GetStatus();
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

    $scope.GetStatus = function () {
        $http.post($scope.service, {"action" : "list"}
        ).success(function(output, status, headers, config) {
            if (output.err == ''){
                $scope.counts = output.data[0];
                //$scope.counts = $scope.resultset[0];
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

});

utsovAdminApp.controller('UserController', function ($scope, $http) {
    $scope.title = "Utsov Admin Users";
    console.log($scope.title);
});

utsovAdminApp.controller('ListController', function ($scope, $route, $http, $rootScope, $location) {

  $scope.fetchData = function () {
    console.log("Selects changed", $scope.formData);
    $http.post($scope.service, {"action": "list", "formData": $scope.formData}
    ).success(function (output, status, headers, config) {
      if (output.err == '') {
        $scope.resultset = output.data;
        $scope.msgs = "Server: " + output.msg;
        console.log($scope.msgs);
      }
      else {
        $scope.errors = "Error: " + output.err;
        $scope.msgs = output.msg;
        console.log($scope.errors);
      }
    }).error(function (output, status) {
      $scope.errors = "Status: " + status;
      console.log($scope.errors);
    });
  };

  $scope.isSelected = function (value) {
    return value === ($scope.formData || {}).yearrequested;
  };

  $scope.initialize = function () {
    $scope.formData = {};
    $scope.formData.yearrequested = new Date().getUTCFullYear().toString();
  };

  $scope.clear = function () {
    $scope.formData = {};
    $scope.formData.yearrequested = new Date().getUTCFullYear().toString();
    $scope.fetchData();
  };

  $scope.formatDate = function(dateValue){
    return dateValue.substring(0,4) + "/" + dateValue.substring(4,6) + "/" + dateValue.substring(6,8);
  };

  $scope.formatPhoneNumber = function(phone) {
    var s2 = (""+phone).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
  };

  $scope.formatAddressLines = function(data){
    return data.address1 ? data.address1 + " " + (data.address2 || "") + ",": "";
  };

  $scope.formatDonorAddressLines = function(data){
    return data.line1 ? data.line1 + " " + (data.line2 || "") + ",": "";
  };

  $scope.formatStateZip = function(data){
    return data.state ? data.state + (data.zip ? " - " + data.zip : "") : "";
  };

  $scope.formatDate = function(data){
    return new Date(data).toLocaleString();
  };

  $scope.formatDonorStateZip = function(data){
    return data.state ? data.state + (data.postal_code ? " - " + data.postal_code : "") : "";
  };

  $scope.formatFullName = function(data){
    return data.first_name  + ' ' + data.last_name;
  };

  $scope.formatCurrency = function(data){
    return "$ " + parseFloat(data).toFixed(2);
  };
  $scope.changeSorting = function(column) {
    var sort = $scope.sort;

    if (sort.column == column) {
      sort.descending = !sort.descending;
    } else {
      sort.column = column;
      sort.descending = false;
    }
  };

  $scope.issueTicket = function(column) {
    confirm("Are you sure you want to make the change?");
  };

  $scope.updateTicketIssued = function (donationId) {
    $.post('api/donations.php',
      JSON.stringify({"action": "updateticketissued", "donationId": donationId}), function (json, status) {
        $scope.fetchData();
      });
  };

  console.log("Checking Login Status:" + $rootScope.IsLoggedIn);
  if (!$rootScope.IsLoggedIn) {
    console.log("Redirecting based on Login Status check");
    $location.path("templates/front.html");
  }
  else {
    //initializing....
    $scope.errors = '';
    $scope.msgs = '';


    $scope.action = $route.current.action;
    switch ($route.current.action) {
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
      case 'USER':
        $scope.title = "Admin Users";
        $scope.service = 'api/users.php';
        break;
    }

    console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

    $scope.fetchData();
  }

});

utsovAdminApp.controller('AddController', function ($scope, $route, $http, $rootScope, $location) {


    if(!$rootScope.IsLoggedIn)
    {
        console.log("Redirecting based on Login Status check");
        $location.path("templates/front.html");
    }

    else
    {
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

    }


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
