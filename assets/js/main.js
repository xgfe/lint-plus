/**
 * Created by yangjiyuan on 16/3/2.
 */
var app = angular.module('lintplus',[]);
app.directive('fullpage', ['$rootScope',function ($rootScope) {
    return {
        restrict:'A',
        scope:{},
        link:function(scope, el){
            initFullpage();
            scope.$on('refresh', function () {
                $.fn.fullpage.destroy('all');
                initFullpage();
                $.fn.fullpage.moveTo('htmlConfig');
            });
            function initFullpage(){
                el.fullpage({
                    onLeave: function(index, nextIndex){
                        $rootScope.isHomePage = !$rootScope.showConfigPage || nextIndex === 1;
                        $rootScope.$digest();
                    }
                });
            }
        }
    }
}]);
app.controller('appCtrl', ['$scope','$rootScope',function ($scope,$rootScope) {
    $rootScope.showConfigPage = false;
    $rootScope.isHomePage = true;
    // 进入配置开始页
    $scope.buildConfig = function () {
        $rootScope.showConfigPage = true;
        $scope.$$postDigest(function(){ //添加之后右侧待添加列表滚动到最下方
            $scope.$broadcast('refresh');
        });
    };
}]);