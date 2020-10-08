var myApp = angular.module('myApp',[]);


    myApp.controller('LoginController', function($scope, $location) {
        $scope.submit= function(){
        
            var username=$scope.username;
            var password=$scope.password;
            if($scope.username=="admin" && $scope.password=="admin123")
            {
                alert('đăng nhập thành công')
            }
            else
            {
                $scope.message="Error";
                $scope.messagecolor="alert alert-danger";
            }
        }
    });