require.config({
    paths:{
              angular:"/bower_components/angularjs/angular.min"
   }
});

require(["angular"],function(a,b){

        var app=angular.module("test-app",[]);

        app.controller("C",function($scope){
            $scope.name="123";
        });

        angular.bootstrap(document,['test-app']);

});
