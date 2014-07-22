$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
});

var utsovAdminApp = angular.module('utsovAdminApp', []);

utsovAdminApp.controller('VolunteerController', function ($scope) {

    $scope.contacts = [
        {
            'name' : 'Test Name',
            'address1' : 'Test Street',
            'address2' : 'Street 2',
            'city' : 'Testville',
            'state' : 'WA',
            'zip' : '09876',
            'phone' : '9876543210',
            'email' : 'test@server.com',
            'message' : 'testing it out right now',
            'ipaddress' : '127.0.0.0'
        },
        {
            'name' : 'Another Name',
            'address1' : 'Test Street',
            'address2' : 'Street 2',
            'city' : 'Testville',
            'state' : 'WA',
            'zip' : '09876',
            'phone' : '9876543210',
            'email' : 'test@server.com',
            'message' : 'testing it out right now 2',
            'ipaddress' : '127.0.0.1'
        }
    ];
});

utsovAdminApp.controller('UserListController', function ($scope, $http) {

    $http.get('localhost/utsov/api/users.php').success(function(data) {
        $scope.users = data["json"];
    });

});
