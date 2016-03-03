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
            scope.$on('moveDown', function () {
                $rootScope.$$postDigest(function(){ //添加之后右侧待添加列表滚动到最下方
                    $.fn.fullpage.moveSectionDown()
                });
            });
            function initFullpage(){
                el.fullpage({
                    //anchors:['home','htmlConfig','cssConfig','jsConfig'],
                    autoScrolling:false,
                    recordHistory:false,
                    onLeave: function (index,nextIndex) {
                        $rootScope.isHomePage = nextIndex === 1;
                        $rootScope.$digest();
                    }
                });
            }
        }
    }
}]);
// 滚动的页首位置
app.directive('scrollTop', function () {
   return {
       restrict:'A',
       scope:{},
       link: function (scope,el) {
           if ($(window).scrollTop() > 100) {
               el.fadeIn();
           } else {
               el.fadeOut();
           }
           $(window).scroll(function () {
               if ($(this).scrollTop() > 100) {
                   el.fadeIn();
               } else {
                   el.fadeOut();
               }
           });
           el.click(function () {
               $("html, body").animate({scrollTop: 0}, 600);
               return false;
           });
       }
   };
});
app.service('rulesServices', ['$http',function ($http) {
    return {
        getRules:function (path) {
            return $http({
                url:path,
                method:'get'
            });
        }
    }
}]);
app.controller('appCtrl', ['$scope','$rootScope',function ($scope,$rootScope) {
    $rootScope.isHomePage = true;
    // 进入配置开始页
    $scope.buildConfig = function () {
        $rootScope.$broadcast('moveDown');
    };
}]);
app.controller('htmlConfigCtrl', ['$scope','$rootScope','rulesServices',function ($scope,$rootScope,rulesServices) {
    $scope.selectAll = false;
    $rootScope.htmlRules = [];
    $scope.collections = [{
        label:'默认规则',
        className:'default'
    },{
        label:'其他规范',
        className:'specification'
    }];
    rulesServices.getRules('conf/htmlhint.json').then(function (responese) {
        $rootScope.htmlRules = responese.data;
        angular.forEach($rootScope.htmlRules, function (rule) {
            rule.enable = !!rule.default;
            if(!rule.enable && rule.options.length > 0){
                rule.selected = rule.options[0];
            }else{
                rule.selected = rule.default;
            }
        });
    });
    // 全选
    $scope.selectAllHandler = function () {
        var selectAll = $scope.selectAll;
        angular.forEach($rootScope.htmlRules, function (rule) {
            rule.enable = selectAll;
            if(selectAll && rule.options.length > 0 && !rule.selected){
                rule.selected = rule.options[0];
            }
        });
    };
    // 下一步
    $scope.nextStep = function () {
        $rootScope.$broadcast('moveDown');
    };
}]);
app.controller('cssConfigCtrl', ['$scope','$rootScope','rulesServices',function ($scope,$rootScope,rulesServices) {
    $scope.selectAll = false;
    $scope.cssRules = [];
    $scope.collections = [];
    rulesServices.getRules('conf/csshint.json').then(function (responese) {
        $scope.cssRules = responese.data;
    });
    // 全选
    $scope.selectAllHandler = function () {
    };
    // 下一步
    $scope.nextStep = function () {
        //$rootScope.$broadcast('moveDown');
        console.log($rootScope.htmlRules)
    };
}]);