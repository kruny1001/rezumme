angular.module('project', ['ngRoute', 'firebase'])

    .value('fbURL', 'https://angularjs-projects.firebaseio.com/')

    .factory('Projects', function($firebase, fbURL) {
        return $firebase(new Firebase(fbURL));
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'ListCtrl',
                templateUrl:'list.html'
            })
            .when('/edit/:projectId', {
                controller:'EditCtrl',
                templateUrl:'detail.html'
            })
            .when('/new', {
                controller:'CreateCtrl',
                templateUrl:'detail.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    })

    .controller('ListCtrl', function($scope, Projects) {
        $scope.projects = Projects;
    })

    .controller('CreateCtrl', function($scope, $location, $timeout, Projects) {
        $scope.save = function() {
            Projects.$add($scope.project, function() {
                $timeout(function() { $location.path('/'); });
            });
        };
    })

    .controller('EditCtrl', function($scope, $location, $routeParams, $firebase, fbURL) {
        var projectUrl = fbURL + $routeParams.projectId;
        $scope.project = $firebase(new Firebase(projectUrl));

        $scope.destroy = function() {
            $scope.project.$remove();
            $location.path('/');
        };

        $scope.save = function() {
            $scope.project.$save();
            $location.path('/');
        };
    })

    .controller('renderTblCtrl', function($scope){
        $scope.contents =
        [
            {title:'AngularJS', desc:'MVC JavaScript framework'},
            {title:'Dart', desc:'Object Oriented Framework'}
        ];
    })

    .controller('TodoCtrl', function($scope) {
        $scope.todos = [
            {text:'learn angular', done:true},
            {text:'build an angular app', done:false}];

        $scope.addTodo = function() {
            $scope.todos.push({text:$scope.todoText, done:false});
            $scope.todoText = '';
        };

        $scope.remaining = function() {
            var count = 0;
            angular.forEach($scope.todos, function(todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        $scope.archive = function() {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.done) $scope.todos.push(todo);
            });
        };
    })
