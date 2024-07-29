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
    }).
    when('/AddDonationSatWalkIn', {
      templateUrl: 'templates/modalsvdonatesatwalkin.html',
      controller: 'PrimeGuestController',
      reloadOnSearch: false,
      action: 'BPG'
    }).
    when('/Covid19', {
      templateUrl: 'templates/modalsvcoviddonate.html',
      controller: 'PrimeGuestController',
        reloadOnSearch: false,
        action: 'ACD'
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
        reloadOnSearch: false,
        action: 'DON'
      }).
      when('/AddFooteCovidDonationr', {
        templateUrl: 'templates/modalsvcoviddonate.html',
        controller: 'ContactController',
        reloadOnSearch: false,
        action: 'CDON'
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
  $scope.paypalbuttonId = "paypal-button-pg";

  $scope.formData.bothDayAdAmt = 80;
  $scope.formData.bothDayKidAmt = 60;

  $scope.formData.satAdAmt = 55;
  $scope.formData.satKidAmt = 35;

  $scope.formData.sunAdAmt = 40;
  $scope.formData.sunKidAmt = 30;

  $scope.formData.bothDayStuAmt = 75;
  $scope.formData.satStuAmt = 40;
  $scope.formData.sunStuAmt = 35;

  rendered = false;
  $scope.action = $route.current.action;
  switch ($route.current.action)
  {
    case 'BPG':
      $scope.title = "Donate with Paypal  - We sincerely appreciate your help!";
      $scope.service = 'api/donations.php';
      break;
    case 'ACD':
      $scope.title = "Donate for COVID-19 crisis in India";
      $scope.service = 'api/donations.php';
      break;
  }

  console.log("Action:" + $scope.action);
  console.log("Service:" + $scope.service);
  console.log("Title:" + $scope.title);

  $scope.calculatePrimeGuest = function(){
    return calculatePrimeGuest($scope);
  };

  $scope.calculatePrimeGuestOnSpot = function(){
    return calculatePrimeGuestOnSpot($scope);
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
    $scope.paypalbuttonId = "paypal-button-ct"
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
        case 'CDON':
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
    rendered = false;
    

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
    $scope.renderCheckoutForDonate =renderCheckout;

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
      
      if(document.URL && document.URL.endsWith("registerOnSpot")){
        document.getElementById("registerBtn").click();
      }

      if(document.URL && document.URL.endsWith("satWalkIn")){
        document.getElementById("registerBtnSat").click();
      }

      if(document.URL && document.URL.endsWith("sunWalkIn")){
        document.getElementById("registerBtnSun").click();
      }
});

var rendered = false;

function calculatePrimeGuestOnSpot(scope){
  return calculatePrimeGuest(scope, true);
}

function calculatePrimeGuest(scope, onSpot) {

  /*if(scope.formData.donamount >= 160 && scope.formData.donamount <225){
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
  }*/

  if(scope.formData.prepayFood){

    scope.formData.bothDayAdAmt = 100;
    scope.formData.bothDayKidAmt = 75;

    scope.formData.satAdAmt = 70;
    scope.formData.satKidAmt = 45;

    scope.formData.sunAdAmt = 55;
    scope.formData.sunKidAmt = 40;

    scope.formData.bothDayStuAmt = 90;
    scope.formData.satStuAmt = 50;
    scope.formData.sunStuAmt = 45;

  } else {
    scope.formData.bothDayAdAmt = 80;
    scope.formData.bothDayKidAmt = 60;

    scope.formData.satAdAmt = 55;
    scope.formData.satKidAmt = 35;

    scope.formData.sunAdAmt = 40;
    scope.formData.sunKidAmt = 30;

    scope.formData.bothDayStuAmt = 75;
    scope.formData.satStuAmt = 40;
    scope.formData.sunStuAmt = 35;
    
  }

  scope.formData.adbothdays = sanitizeNumber(scope.formData.adbothdays);
  scope.formData.adsat = sanitizeNumber(scope.formData.adsat);
  scope.formData.adsun = sanitizeNumber(scope.formData.adsun);

  scope.formData.kidbothdays = sanitizeNumber(scope.formData.kidbothdays);
  scope.formData.kidsat = sanitizeNumber(scope.formData.kidsat);
  scope.formData.kidsun = sanitizeNumber(scope.formData.kidsun);


  scope.formData.stubothdays = sanitizeNumber(scope.formData.stubothdays);
  scope.formData.stusat = sanitizeNumber(scope.formData.stusat);
  scope.formData.stusun = sanitizeNumber(scope.formData.stusun);
  
  scope.formData.adddon = sanitizeNumber(scope.formData.adddon, true);

  if((scope.formData.kidsat|| 0) >0  && (scope.formData.adsat||0) <=0  && (scope.formData.adbothdays||0) <=0){
    scope.frmRegister.donamount.$setValidity("kidError", false);
  } else if((scope.formData.kidsun|| 0) >0  && (scope.formData.adsun||0) <=0 && (scope.formData.adbothdays||0) <=0){
    scope.frmRegister.donamount.$setValidity("kidError", false);
  } else if((scope.formData.kidbothdays|| 0) >0  && (scope.formData.adbothdays||0) <=0){
    scope.frmRegister.donamount.$setValidity("kidError", false);
  }else {
    scope.frmRegister.donamount.$setValidity("kidError", true);
  }

  var satAdults = (scope.formData.adbothdays*1 || 0) + (scope.formData.adsat*1 || 0);
  var sunAdults =  (scope.formData.adbothdays*1 || 0) + (scope.formData.adsun*1 || 0);
  scope.formData.satAdults = satAdults;
  scope.formData.sunAdults = sunAdults;

  var satKids =  (scope.formData.kidbothdays*1 || 0) + (scope.formData.kidsat*1 || 0);
  var sunKids =  (scope.formData.kidbothdays*1 || 0) + (scope.formData.kidsun*1 || 0);
  scope.formData.satKids = satKids;
  scope.formData.sunKids = sunKids;


  var satStu =  (scope.formData.stubothdays*1 || 0) + (scope.formData.stusat*1 || 0);
  var sunStu =  (scope.formData.stubothdays*1 || 0) + (scope.formData.stusun*1 || 0);
  scope.formData.satStu = satStu;
  scope.formData.sunStu = sunStu;

  scope.formData.numSatTickets= satAdults + satKids + satStu;
  scope.formData.numSunTickets= sunAdults + sunKids + sunStu;
   


  var numTickets= 
   (scope.formData.adbothdays*2 || 0)
   + (scope.formData.adsat*1 || 0)
   + (scope.formData.adsun*1 || 0)

   + (scope.formData.kidbothdays*2 || 0)
   + (scope.formData.kidsat*1 || 0)
   + (scope.formData.kidsun*1 || 0)

   + (scope.formData.stubothdays*2 || 0)
   + (scope.formData.stusat*1 || 0)
   + (scope.formData.stusun*1 || 0);

   if(numTickets > 10){
    scope.frmRegister.donamount.$setValidity("numTicketsErr", false);
  } else {
    scope.frmRegister.donamount.$setValidity("numTicketsErr", true);
  }
  
   var calcAmt
   
   if(onSpot){

    calcAmt= (scope.formData.adbothdays*0 || 0)
   + (scope.formData.adsat*40 || 0)
   + (scope.formData.adsun*30 || 0)

   + (scope.formData.kidbothdays*0 || 0)
   + (scope.formData.kidsat*25 || 0)
   + (scope.formData.kidsun*20 || 0)

   + (scope.formData.stubothdays*0 || 0)
   + (scope.formData.stusat*30 || 0)
   + (scope.formData.stusun*25 || 0)

   + (scope.formData.adddon || 0);

   } else {

    calcAmt= (scope.formData.adbothdays*scope.formData.bothDayAdAmt || 0)
   + (scope.formData.adsat*scope.formData.satAdAmt || 0)
   + (scope.formData.adsun*scope.formData.sunAdAmt || 0)

   + (scope.formData.kidbothdays*scope.formData.bothDayKidAmt || 0)
   + (scope.formData.kidsat*scope.formData.satKidAmt || 0)
   + (scope.formData.kidsun* scope.formData.sunKidAmt || 0)

   + (scope.formData.stubothdays*scope.formData.bothDayStuAmt || 0)
   + (scope.formData.stusat*scope.formData.satStuAmt || 0)
   + (scope.formData.stusun*scope.formData.sunStuAmt || 0)

   + (scope.formData.adddon || 0);
   }
   

   scope.formData.donamount = Math.round((calcAmt + Number.EPSILON) * 100) / 100
   scope.formData.numTickets = numTickets;

 

}

function sanitizeNumber(field, ignoreRound){
  if(!field) return field;
  field = ignoreRound ? field: Math.round(field);
  field = field<0?0:field;
  return  parseFloat(field);
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
            var donamount = document.getElementById("donamount") ? document.getElementById("donamount").value : undefined;
            
            var adbothdays = document.getElementById("adbothdays") ? document.getElementById("adbothdays").value: undefined;
            var adsat = document.getElementById("adsat") ? document.getElementById("adsat").value : undefined;
            var adsun = document.getElementById("adsun")? document.getElementById("adsun").value: undefined;

            var kidbothdays = document.getElementById("kidbothdays") ? document.getElementById("kidbothdays").value: undefined;
            var kidsat = document.getElementById("kidsat") ? document.getElementById("kidsat").value : undefined;
            var kidsun = document.getElementById("kidsun")? document.getElementById("kidsun").value: undefined;

            var stubothdays = document.getElementById("stubothdays") ? document.getElementById("stubothdays").value: undefined;
            var stusat = document.getElementById("adsat") ? document.getElementById("stusat").value : undefined;
            var stusun = document.getElementById("adsun")? document.getElementById("stusun").value: undefined;

            var adddon = document.getElementById("adddon") ? document.getElementById("adddon").value: undefined;

            var prepayFood = document.getElementById("prepayFood") ? document.getElementById("prepayFood").checked: undefined;


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
              "payment_id": "",
//              "pgcount": parseInt(pgcount),
              "adbothdays": parseInt(adbothdays),
              "adsat": parseInt(adsat),
              "adsun": parseInt(adsun),
              "kidbothdays": parseInt(kidbothdays),
              "kidsat": parseInt(kidsat),
              "kidsun": parseInt(kidsun),
              "stubothdays": parseInt(stubothdays),
              "stusat": parseInt(stusat),
              "stusun": parseInt(stusun), 
              //"kid": parseInt(kid),
              "adddon": parseFloat(adddon),
              "prepayFood": prepayFood
            };

            if(adbothdays || adsat || adsun || kidbothdays || kidsat || kidsun || stubothdays || stusat || stusun || adddon) {
              payPalResponse.usesNewTicketingSystem = true;
              
              payPalResponse.adbothdays= parseInt(adbothdays);
              payPalResponse.adsat= parseInt(adsat);
              payPalResponse.adsun= parseInt(adsun);

              payPalResponse.kidbothdays= parseInt(kidbothdays);
              payPalResponse.kidsat= parseInt(kidsat);
              payPalResponse.kidsun= parseInt(kidsun);
              

              payPalResponse.stubothdays= parseInt(stubothdays);
              payPalResponse.stusat= parseInt(stusat);
              payPalResponse.stusun= parseInt(stusun);
              
              payPalResponse.adddon= parseFloat(adddon)||0;
            }else{
              payPalResponse.usesNewTicketingSystem = false;
            }


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
                  payPalResponse.line1 = payment.payer.payer_info.shipping_address.line1 || "";
                  payPalResponse.line2 = payment.payer.payer_info.shipping_address.line2 || "";
                  payPalResponse.city = payment.payer.payer_info.shipping_address.city || "";
                  payPalResponse.state = payment.payer.payer_info.shipping_address.state || "";
                  payPalResponse.postal_code = payment.payer.payer_info.shipping_address.postal_code || "";
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
              console.log(json);
              console.log(status);
              if(status === "success" && !json.err) {
                document.getElementById("modal-body").style.display = "none";
                document.getElementById("confirmation").style.display = "block";

              } else {
                document.getElementById("modal-body").style.display = "none";
                document.getElementById("unableToRegister").style.display = "block";
              }
            }, 'json').fail(function(response) {
              document.getElementById("modal-body").style.display = "none";
              document.getElementById("unableToRegister").style.display = "block";
          });;


          });
        }

      }, btnSelector);
    }
  }, 'json');
}

function renderCheckout(id) {
  if(!rendered){
    renderPaypalButton('#' + id);
    rendered= true;
  }
}

function reset(scope){
  scope.formData.donamount = null;
  scope.formData.adbothdays = 0;
  scope.formData.adsat = 0;
  scope.formData.adsun = 0;

  scope.formData.kidbothdays = 0;
  scope.formData.kidsat = 0;
  scope.formData.kidsun = 0;

  scope.formData.stubothdays = 0;
  scope.formData.stusat = 0;
  scope.formData.stusun = 0;

  scope.formData.adddon = 0.00;

  scope.formData.satAdults = 0;
  scope.formData.sunAdults = 0;
  scope.formData.satKids = 0;
  scope.formData.sunKids = 0;
  scope.formData.satStu = 0;
  scope.formData.sunStu = 0;
  scope.formData.numTickets = 0;

  document.getElementById("modal-body").style.display = "block";
  document.getElementById("confirmation").style.display = "none";
  document.getElementById("unableToRegister").style.display = "none";
  document.getElementById("results").style.display = "none";

};
