/**
 * Created by yangjiyuan on 16/3/2.
 */
var app = angular.module('lintplus',[]);
app.directive('fullpage', function () {
    return {
        restrict:'A',
        scope:{},
        link:function(scope, el){
            var w_h = $(window).height();
            var children = el.children('.section');
            children.css({
                "min-height":w_h
            });
        }
    }
});
// 滚动的页首位置
app.directive('scrollTop', ['$rootScope',function ($rootScope) {
   return {
       restrict:'A',
       scope:{},
       link: function (scope,el) {
           var scrollTopFlag = $(window).scrollTop() > 100;
           $rootScope.showForkme = scrollTopFlag;
           if (scrollTopFlag) {
               el.fadeIn();
           } else {
               el.fadeOut();

           }
           $(window).scroll(function () {
               scrollTopFlag = $(this).scrollTop() > 100;
               $rootScope.showForkme = scrollTopFlag;
               $rootScope.$digest();
               if (scrollTopFlag) {
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
}]);
// 转化 select 绑定的数据为数字
app.directive('convertToNumber',function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
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
    $rootScope.htmlRules = [];
    $rootScope.cssRules = [];
    $rootScope.jsRules = [];
    // 禁用HTML检测的标记
    $rootScope.disableHTML = false;
    // 禁用CSS检测的标记
    $rootScope.disableCSS = false;
    // 禁用JS检测的标记
    $rootScope.disableJS = false;
}]);
app.controller('htmlConfigCtrl', ['$scope','$rootScope','rulesServices',function ($scope,$rootScope,rulesServices) {
    $scope.selectAll = false;
    $scope.collections = [{
        label:'默认规则',
        className:'default'
    },{
        label:'其他规范',
        className:'specification'
    }];
    var rulesCache;
    rulesServices.getRules('conf/htmlhint.json').then(function (responese) {
        $rootScope.htmlRules = responese.data;
        rulesCache = angular.copy(responese.data);
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

    // 恢复默认
    $scope.resetToDefault = function () {
        if(rulesCache){
            $rootScope.htmlRules = angular.copy(rulesCache);
            angular.forEach($rootScope.htmlRules, function (rule) {
                rule.enable = !!rule.default;
                if(!rule.enable && rule.options.length > 0){
                    rule.selected = rule.options[0];
                }else{
                    rule.selected = rule.default;
                }
            });
        }
    };
}]);
app.controller('cssConfigCtrl', ['$scope','$rootScope','rulesServices',function ($scope,$rootScope,rulesServices) {
    $scope.selectAll = false;
    $scope.collections = [{
        label:'建议启用',
        className:'recommended'
    },{
        label:'其他规则',
        className:'other'
    }];
    // 错误级别
    $scope.levels = [{
        val:1,
        meaning:'Error'
    },{
        val:2,
        meaning:'Warning'
    }];
    // 把下列这些规则中配置的空格，转化为数字
    var optionRule = ['decl-comma','selector-between-onespace','selector-both-spaces','text-indent'];
    var rulesCache;
    rulesServices.getRules('conf/csshint.json').then(function (responese) {
        $rootScope.cssRules = responese.data;
        rulesCache = angular.copy(responese.data);
        angular.forEach($rootScope.cssRules, function (rule) {
            rule.enable = rule.default.level > 0;
            if(!rule.enable){
                rule.selected = {
                    level:0
                };
            }else{
                rule.selected = angular.copy(rule.default);
            }
        });
    });
    // 全选
    $scope.selectAllHandler = function () {
        var selectAll = $scope.selectAll;
        angular.forEach($rootScope.cssRules, function (rule) {
            rule.enable = selectAll;
        });
    };

    //恢复默认
    $scope.resetToDefault = function () {
        if(rulesCache){
            $rootScope.cssRules = angular.copy(rulesCache);
            angular.forEach($rootScope.cssRules, function (rule) {
                rule.enable = rule.default.level > 0;
                if(!rule.enable){
                    rule.selected = {
                        level:0
                    };
                }else{
                    rule.selected = angular.copy(rule.default);
                }
            });
        }
    };
}]);