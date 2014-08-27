$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
});

var utsovAdminApp = angular.module('utsovAdminApp', []);

utsovAdminApp.controller('VolunteerController', function ($scope, $http) {

    $scope.errors = [];
    $scope.msgs = [];
    $scope.GetVolunteers = function () {
        //clearing errors and messages
        $scope.errors.splice(0, $scope.errors.length);
        $scope.msgs.splice(0, $scope.msgs.length);
        $http.post('http://localhost/utsov/api/contacts.php', {'action' : 'list'}
        ).success(function(data, status, headers, config) {
            if(data.msg != ''){
                $scope.contacts.push(data.data);
                $scope.msgs.push(data.msg);
            }
            else{
                $scope.errors.push(data.err);
            }
        }).error(function(data, status){
            $scope.errors.push(status);
        });
        alert(count + " records");
    }

    /*$scope.GetVolunteers = function() {
        //clearing errors and messages
        $scope.errors.splice(0, $scope.errors.length);
        $scope.msgs.splice(0, $scope.msgs.length);
    }*/

        //calling post


});

utsovAdminApp.controller('UserListController', function ($scope, $http) {

    $http.get('localhost/utsov/api/users.php').success(function(data) {
        $scope.users = data.data;
    });

});
