var app = angular.module('myApp',['ngRoute','myApp.nav']);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl:'login.html'
    })
    .when('/home', {
        templateUrl:'home.html'
    })
    .when('/subjects', {
        templateUrl :'subjects.html',
        controller:'subjectsCrtl'
    })
    .when('/quiz/:id/:name', {
        templateUrl :'quiz.html',
        controller :"quizsCrtl"
    })
    .when('/gioithieu', {
        templateUrl :'goithieu.html',
    })
    .when('/gopy', {
        templateUrl :'support/gopy.html',
    })

    .when('/hoidap', {
        templateUrl :'support/hoidap.html',
    })
    .when('/lienhe', {
        templateUrl :'support/lienhe.html',
    })
    .when('/prf', {
        templateUrl :'support/prf.html',
    })
    .when('/login',{
        templateUrl: 'login.html',
    })
    .otherwise({
        redirectTo: "/login",
      });

    
});
// đọc môn học
app.controller('subjectsCrtl',function($scope,$http){
    $scope.list_subject = [];
    $http.get('../db/Subjects.js').then(function(res){
        $scope.list_subject = res.data;
    });
});
//đọc câu hỏi
app.controller('quizsCrtl',function($scope,$http, $routeParams,quizFactory){
    $http.get('../db/Quizs/'+$routeParams.id+'.js').then(function(res){

        quizFactory.questions = res.data;
    });
});


app.directive('quizpoly',function(quizFactory,$routeParams){
    return {
        restrict : 'AE',
        scope:{},
        templateUrl : 'template-quiz.html',
        link: function(scope,elem,attrs){
            scope.start = function(){
                quizFactory.getQuestions().then(function(){
                    scope.subjectname = $routeParams.name;
                    scope.id=1;
                    scope.quizOver = false;
                    scope.inProgess= true;
                    scope.getQuestion();
                });          
            };
            scope.reset =function(){
                scope.inProgess= false;
                scope.score = 0;
            };
            //doc file cau hoi cua json
            scope.getQuestion = function(){
                var quiz = quizFactory.getQuestion(scope.id);
                if(quiz){
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode= true;
                }else{
                    scope.quizOver = true;
                } 
            }
            
            //kiemtra dung sai cua cau tra loi
            scope.checkAnswer= function(){  
                if(!$('input[name = answer]:checked').length) return;
                var ans = $('input[name = answer]:checked').val();
                if(ans == scope.answer){
                    // alert('Đúng!');
                    scope.score++;
                    scope.correctAns = true;
                }else{
                    // alert('Sai!');
                    scope.correctAns = false;
                }
                scope.answerMode= false;
                if (scope.score >= 5) {
                    scope.result = true;
                } else {
                    scope.result = false;
                }
            };
            scope.nextQuestion = function(){
                scope.id++;
                scope.getQuestion();
            } 
            scope.reset();
        }
    }
});

app.factory('quizFactory', function($http, $routeParams){
    
    return {
        getQuestions:function(){
            return $http.get('../db/Quizs/'+$routeParams.id+'.js').then(function(res){
                questions = res.data;
            });
        },
        getQuestion:function(id){
            var randomItem = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if(count > 10 ){
                count = 10; 
            }
            if(id<count){
                return randomItem;
            }else{
                return false;   
            }
        }
    }
});

window.onload = function() {
    var hour = 04;
    var sec = 60;
    setInterval(function() {
      document.getElementById("timer").innerHTML = "0"+hour+ "phút" + ":" +sec+"giây";
      sec--;
      if ( sec==0) {
        hour--;
        sec = 60;
        if (hour == -1) {
            location = '#!subjects';
            alert('thời gian làm bài của bạn đã hết ! Fail');
        }
      }
    }, 1000);
  }

  
  app.factory('studentFactory', ['$http', function ($http) {
    var studentFactory = {};
    var list = [];
    var isInLog = false;
    var isLogin = false;

    studentFactory.getIsLogin=()=>{
        return isLogin;
    };
    studentFactory.setIsLogin =(value)=>{
        isLogin = value;
    }
    studentFactory.getIsInLogin=()=>{
        return isInLogin;
    };
    studentFactory.setIsInLogin =(value)=>{
        console.log(value);
        isInLogin = value;
    }


  studentFactory.checkLogin=(username, password)=>{
        var promise = studentFactory.getStudents().then((data)=>{
            var students = data.filter(item=>{
                return item.username === username && item.password === password;
            });
            return students;
        });

        return promise;
    }

    studentFactory.getStudents = function () {
        var promise = $http.get('../db/Students.js').then(response => {
            list = response.data;
            //console.log(response.data);
            return list;
        }).catch(reason => alert(reason));

        return promise;
    };
    return studentFactory;
}]);

app.controller('StudentCtrl', ['studentFactory','$scope', function ( studentFactory, $scope) {
    $scope.students = studentFactory.getList();
}])
.controller('LoginCtrl', ['studentFactory','$scope','$location', function ( studentFactory, $scope, $location) {
    $scope.loginForm = {};
    $scope.errorMessage = null;
    studentFactory.setIsInLogin(true);

    $scope.checkLogin=()=>{
        studentFactory.checkLogin($scope.loginForm.username, $scope.loginForm.password).then(data => {
            if (data != null && data.length>0){
                studentFactory.setIsInLogin(false);
                alert("Đăng Nhập Thành Công " + data[0].fullname);
                $location.path('/home');   
            }else{
                studentFactory.setIsLogin(false);
                alert("Tên Đăng Nhập Hoặc Mật Khẩu Không Đúng!!!")
            }

        });
    };
}])
app.controller('LogoutCtrl', ['studentFactory','$scope','$location', function ( studentFactory, $scope, $location) {
    $scope.logout = ()=>{
       alert('bạn có chắc muốn đăng xuất không ?')
        $location.path('/login');
    };
}]);
app.controller('myController', ['$scope', function($scope) {
}]);
    

