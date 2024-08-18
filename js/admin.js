'use strict';

$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
  $('[data-toggle="tooltip"]').tooltip();
});

function setCookie(name,value,mins) {
  var expires = "";
  if (mins) {
      var date = new Date();
      date.setTime(date.getTime() + (mins*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

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

    var isLoogedIn = getCookie("utsovAdminCookie");
    $rootScope.IsLoggedIn = isLoogedIn ? true:  false;
    console.log("Initializing Login Status:" + $rootScope.IsLoggedIn);

});

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
      when('/AddDonation', {
        templateUrl: 'templates/addDonation.html',
        controller: 'registerCtrl',
        action: 'ADDON'
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
                setCookie("utsovAdminCookie", JSON.stringify($scope.user), 60);
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
                $scope.counts.total_donation = output.data[1].total_donation;
                $scope.counts.total_count = output.data[1].total_count;
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

    const arr = window.location.href.split("?");
    if(arr.length > 1){
      const queryString = arr[1];
      console.log("queryString", queryString);
      const urlParams = new URLSearchParams(queryString);
      const entries = urlParams.entries();
  
      for(const entry of entries) {
        console.log("entries", `${entry[0]}: ${entry[1]}`);
        $scope.formData = $scope.formData || {};
        $scope.formData[entry[0]] = entry[1];
      }

    }


    $scope.msgs = "Loading...";
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
    $scope.formData.ticket_issued = "";
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
  $scope.formatTickets = function(data){
    if(data.payment_method==='paypal'){
      let str = "";
      str = str +  (data.bothdaysadult && parseInt(data.bothdaysadult)  ? `Adult - Both days : ${data.bothdaysadult}\n`:"");
      str = str +  (data.saturdayadult && parseInt(data.saturdayadult) ? `Adult - Saturday : ${data.saturdayadult}\n`:"");
      str = str +  (data.sundayadult && parseInt(data.sundayadult) ? `Adult - Sunday : ${data.sundayadult}\n`:"");

      str = str +  (data.bothdayskid && parseInt(data.bothdayskid) ? `Kids - Both days : ${data.bothdayskid}\n`:"");
      str = str +  (data.saturdaykid && parseInt(data.saturdaykid) ? `Kids - Saturday : ${data.saturdaykid}\n`:"");
      str = str +  (data.sundaykid && parseInt(data.sundaykid) ? `Kids - Sunday : ${data.sundaykid}\n`:"");

      str = str +  (data.bothdaysstudent && parseInt(data.bothdaysstudent) ? `Student - Both days : ${data.bothdaysstudent}\n`:"");
      str = str +  (data.saturdaystudent && parseInt(data.saturdaystudent) ? `Student - Saturday : ${data.saturdaystudent}\n`:"");
      str = str +  (data.sundaystudent && parseInt(data.sundaystudent) ? `Student - Sunday : ${data.sundaystudent}\n`:"");

      str = str +  (parseInt(data.addtionaldonation) ? `Donation : ${data.addtionaldonation}`:"");

      str = str +  (data.payment_status ? `Prepaid Food : true`:`Prepaid Food : false`);



      return str;

    } else {
      return data.payment_status;
    }
    /*
    return data.payment_method==='paypal' ? `Adult - Both days : ${data.bothdaysadult}\n
    Adult - Saturday : ${data.saturdayadult}\n
    Adult - Sunday: ${data.sundayadult}\n

    Kids - Both days : ${data.bothdayskid}\n
    Kids - Saturday : ${data.saturdaykid}\n
    Kids - Sunday: ${data.sundaykid}\n

    Student - Both days : ${data.bothdaysstudent}\n
    Student - Saturday : ${data.saturdaystudent}\n
    Student - Sunday: ${data.sundaystudent}\n
    
    Donation: ${data.addtionaldonation}\n
    ` : data.payment_status;*/
  };
  $scope.isDisabled = function(data){
    return (data.bothdaysadult + data.saturdayadult + data.sundayadult + data.pgcount + data.kidsanyday) ? '' : 'disabled';
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
    return data.first_name  + ' ' + (data.last_name || '');
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

utsovAdminApp.controller('registerCtrl', function ($scope, $route, $http, $rootScope, $location) {

  if(!$rootScope.IsLoggedIn)
    {
        console.log("Redirecting based on Login Status check");
        $location.path("templates/front.html");
    } else {
  
      //initializing....
      $scope.isAdminUser = true;
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
      $scope.service = 'api/pos.php';
      $scope.user = {};
      $scope.user.type = 'GUEST';
      //$scope.registrations = [{"id":0, "year":"No Data", "donation":0, "date":"20150101:010101", "headcount":0}];
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

          var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
          var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    
          $scope.formData.txDateTime = localISOTime;
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
}

  
});
