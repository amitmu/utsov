'use strict';

var utsovContactApp = angular.module('utsovContactApp', ['ngRoute']);

var utsovEventApp = angular.module('utsovEventApp', ['ngRoute']);

var utsovPrimeGuestApp = angular.module('utsovPrimeGuestApp', ['ngRoute']);

utsovPrimeGuestApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/BecomePrimeGuest', {
      templateUrl: 'templates/modalsvdonate.html',
      controller: 'PrimeGuestController',
      reloadOnSearch: false,
      action: 'BPG'
    });
  }]);

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
        templateUrl: 'templates/modalsvdonate.html',
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
        reloadOnSearch: false,
        action: 'CON'
      }).
      when('/ChildrensEssay', {
        templateUrl: 'templates/modalevtessay.html',
        controller: 'EventController',
        action: 'ESSAY'
      });
}]);

utsovPrimeGuestApp.controller('PrimeGuestController', function ($scope, $route, $http) {

  //initializing....
  $scope.errors = '';
  $scope.msgs = '';
  $scope.formData = {};
  $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
  $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
  $scope.success = 0;

  rendered = false;
  $scope.action = $route.current.action;
  switch ($route.current.action)
  {
    case 'BPG':
      $scope.title = "Donate with Paypal  - We sincerely appreciate your help!";
      $scope.service = 'api/donations.php';
      break;
  }

  console.log("Action:" + $scope.action);
  console.log("Service:" + $scope.service);
  console.log("Title:" + $scope.title);

  $scope.calculatePrimeGuest = function(){
    return calculatePrimeGuest($scope);
  };
  $scope.reset = function(){
      return reset($scope);
  };
  $scope.renderCheckout =renderCheckout;

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

utsovContactApp.controller('ContactController', function ($scope, $route, $http) {

    //initializing....
    $scope.errors = '';
    $scope.msgs = '';
    $scope.formData = {};
    $scope.phoneNumPattern = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    $scope.zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.success = 0;
    rendered = false;
  
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
        case 'BPG':
            $scope.title = "Become a Prime Guest";
            $scope.service = 'api/donations.php';
            break;
    }

    console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

    $scope.calculatePrimeGuest = function(){
      return calculatePrimeGuest($scope);
    };
    $scope.renderCheckout =renderCheckout;

    $scope.reset = function(){
      return reset($scope);
    };
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
    renderedFromDonate = false;

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
         case 'ESSAY':
            $scope.title = "Details of the Childrens Essay Contest";
            $scope.service = 'api/donations.php';
            break;
    }

    console.log("Action:" + $scope.action);
    console.log("Service:" + $scope.service);
    console.log("Title:" + $scope.title);

    $scope.calculatePrimeGuest = function(){
      return calculatePrimeGuest($scope);
    };
    $scope.renderCheckoutForDonate =renderCheckoutForDonate;

    $scope.reset = function(){
      return reset($scope);
    };

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

      var divPrimeGuest = document.getElementById("primeGuest");
      angular.bootstrap(divPrimeGuest, ["utsovPrimeGuestApp"]);
});

var rendered = false;
var renderedFromDonate = false;

function calculatePrimeGuest(scope) {

  if(scope.formData.donamount >= 160 && scope.formData.donamount <225){
    scope.formData.primeGuestLevel = "You are eligible for Prime Guest Level 1.";
    scope.formData.isPrimeGuest = true;
  } else if(scope.formData.donamount >= 225 && scope.formData.donamount <325){
    scope.formData.primeGuestLevel = "You are eligible for Prime Guest Level 2.";
    scope.formData.isPrimeGuest = true;
  } else if(scope.formData.donamount >= 325){
    scope.formData.primeGuestLevel = "You are eligible for Prime Guest Level 3.";
    scope.formData.isPrimeGuest = true;
  } else {
    scope.formData.primeGuestLevel = "You will not be eligible for Prime Guest program.";
    scope.formData.isPrimeGuest = false;
  }

}

function renderPaypalButton(btnSelector){
  $.post('api/donations.php', JSON.stringify({"action":"getapikey"}), function (json, status) {
    if(status === "success" && json.apiKey && json.paypalEnv){
      paypal.Button.render({

        env: json.paypalEnv, // Or 'sandbox'

        client: {
          sandbox: json.paypalEnv ==="sandbox" ? json.apiKey : '',
          production: json.paypalEnv ==="production" ? json.apiKey : '',
        },

        commit: true, // Show a 'Pay Now' button

        payment: function(data, actions) {
          var donamount = document.getElementById("donamount").value;
          return actions.payment.create({
            payment: {
              transactions: [
                {
                  amount: { total: donamount, currency: 'USD' }
                }
              ]
            }
          });
        },

        onAuthorize: function(data, actions) {
          return actions.payment.execute().then(function(payment) {
            var donamount = document.getElementById("donamount").value;

            var payPalResponse = {
              "action":"savedonation",
              "donation_year": new Date().getFullYear(),
              "email": "",
              "first_name": "",
              "middle_name": "",
              "last_name": "",
              "payer_id": "",
              "line1": "",
              "line2": "",
              "city": "",
              "state": "",
              "postal_code": "",
              "payment_method": "",
              "payment_status": "",
              "payment_amount": parseFloat(donamount),
              "payment_id": ""
            };

            if(payment) {
              payPalResponse.txDateTime = payment.create_time;

              if (payment.payer && payment.payer.payer_info) {
                payPalResponse.email = payment.payer.payer_info.email || "";
                document.getElementById("txEmail").innerHTML = payPalResponse.email;

                payPalResponse.first_name = payment.payer.payer_info.first_name;
                payPalResponse.middle_name = payment.payer.payer_info.middle_name;
                payPalResponse.last_name = payment.payer.payer_info.last_name;
                payPalResponse.payer_id = payment.payer.payer_info.payer_id;

                if (payment.payer.payer_info.shipping_address) {
                  payPalResponse.line1 = payment.payer.payer_info.shipping_address.line1;
                  payPalResponse.line2 = payment.payer.payer_info.shipping_address.line2;
                  payPalResponse.city = payment.payer.payer_info.shipping_address.city;
                  payPalResponse.state = payment.payer.payer_info.shipping_address.state;
                  payPalResponse.postal_code = payment.payer.payer_info.shipping_address.postal_code;
                }
              }

              if (payment.payer && payment.transactions && payment.transactions.length) {
                payPalResponse.payment_method = payment.payer.payment_method;
                payPalResponse.payment_status = payment.payer.status;
                payPalResponse.payment_amount = payment.transactions[0].amount.total;
                if (payment.transactions[0].related_resources && payment.transactions[0].related_resources.length) {

                  payPalResponse.payment_id = payment.transactions[0].related_resources[0].sale.id;
                  document.getElementById("txSuccessPaymentId").innerHTML = payPalResponse.payment_id;
                  document.getElementById("txFailurePaymentId").innerHTML = payPalResponse.payment_id;

                }
              }
              payPalResponse.paypal_resp = JSON.stringify(payment);
            }

            $.post('api/donations.php', JSON.stringify(payPalResponse), function (json, status) {
              document.getElementById("results").style.display = "block";
              if(status === "success" && !json.err) {
                document.getElementById("modal-body").style.display = "none";
                document.getElementById("confirmation").style.display = "block";

              } else {
                document.getElementById("modal-body").style.display = "none";
                document.getElementById("unableToRegister").style.display = "block";
              }
            }, 'json');


          });
        }

      }, btnSelector);
    }
  }, 'json');
}

function renderCheckout() {
  if(!rendered){
    renderPaypalButton('#paypal-button');
    rendered= true;
  }
}

function renderCheckoutForDonate() {
  if(!renderedFromDonate){
    renderPaypalButton('#paypal-button1');
    renderedFromDonate= true;
  }
}

function reset(scope){
  scope.formData.donamount = null;
  document.getElementById("modal-body").style.display = "block";
  document.getElementById("confirmation").style.display = "none";
  document.getElementById("unableToRegister").style.display = "none";
  document.getElementById("results").style.display = "none";
};
