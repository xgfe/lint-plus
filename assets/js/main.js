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
app.directive('fold', function () {
    return {
        restrict:'A',
        scope:{},
        link: function (scope,el) {
            el.attr('title','点击收起');
            var section = el.closest('.section');
            var isClose;
            var w_h = $(window).height();
            el.on('click', function (evt) {
                evt.stopPropagation();
                isClose = section.hasClass('section-close');
                if(isClose){
                    offClick();
                }else{
                    el.attr('title','点击展开');
                    section.css('min-height',0)
                        .attr('title','点击展开')
                        .addClass('section-close')
                        .on('click', offClick);
                }
            });
            function offClick(){
                el.attr('title','点击收起');
                section.removeClass('section-close')
                    .css('min-height',w_h)
                    .removeAttr('title')
                    .off('click');
            }
        }
    }
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
    $rootScope.disableStatus = {}
    // 禁用HTML检测的标记
    $rootScope.disableStatus.disableHTML = false;
    // 禁用CSS检测的标记
    $rootScope.disableStatus.disableCSS = false;
    // 禁用JS检测的标记

    $rootScope.disableStatus.disableJS = false;
    // 启用JS推荐配置的标记
    $rootScope.jsRecommended = false;

    $rootScope.makeConfig = function (evt) {
        var lintConfig = {},
            tempRules = {},
            htmlConfig = {
                "suffix": ['html']
            },
            cssConfig = {
                "suffix": 'css',
                "ignore": [],
            },
            jsConfig = {
                "suffix": ['js', 'es', 'es6'],
                "ignore": [],
                "env": {
                    "node": true,
                    "mocha": true
                },
                "globals": {
                    "angular": true,
                    "jQuery": true,
                    "define": true,
                    "require": true
                }
            };
        // htmlConfig生成
        if ($rootScope.disableStatus.disableHTML) {
            htmlConfig = false;
        } else {
            tempRules = {};
            angular.forEach($rootScope.htmlRules, function (rule) {
                if (rule.default) {
                    if (!rule.enable) {
                        tempRules[rule.id] = false;
                    } else {
                        if (rule.id == 'attr-value-quotes' && rule.selected == 'single') {
                            tempRules[rule.id] = 'single';
                        }
                    }
                } else {
                    if (rule.enable) {
                        tempRules[rule.id] = true;
                        if (rule.id == 'id-class-value') {
                            tempRules[rule.id] = rule.selected;
                        }
                    }
                }
            })
            htmlConfig.rules = tempRules;
        }


        // cssConfig生成
        if ($rootScope.disableStatus.disableCSS) {
            cssConfig = false;
        } else {
            tempRules = {};
            angular.forEach($rootScope.cssRules, function (rule) {
                if (!rule.enable) {
                    tempRules[rule.id] = {'level': 0};
                }
            })
            cssConfig.rules = tempRules;
        }

        // jsConfig生成
        if ($rootScope.disableStatus.disableJS) {
            jsConfig = false;
        } else {
            tempRules = {};
            if ($rootScope.jsRecommended) {
                jsConfig['extends'] = 'eslint:recommended';
            }
            angular.forEach($rootScope.jsRules, function (rule) {
                if (rule.isRecommended) {
                    if (!rule.enable) {
                        if ($rootScope.jsRecommended) {
                            tempRules[rule.id] = 0;
                        }
                    } else {
                        if (!$rootScope.jsRecommended) {
                            tempRules[rule.id] = rule.hasOptions ? [2] : 2;
                        }
                    }
                } else {
                    if (rule.enable) {
                        tempRules[rule.id] = rule.hasOptions ? [2] : 2;
                    }
                }
            })
            jsConfig.rules = tempRules;
        }

        // lintConfig生成
        lintConfig = {
            "html": htmlConfig,
            "css": cssConfig,
            "js": jsConfig
        }

        var json = lintConfig,
            el = angular.element(evt.target);
        var content = ['data:text/json;charset=utf-8,'];
        content.push(encodeURIComponent(JSON.stringify(json, null, 2)));
        el.attr('href', content.join(''));

    }

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
    // 把下列这些规则中配置的空格，转化为数字
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
app.controller('jsConfigCtrl', ['$scope','$rootScope','rulesServices',function ($scope,$rootScope,rulesServices) {
    $scope.selectAll = false;
    $scope.selectRecommended = false;
    // 所有分类
    $scope.collections = [{
        label:'建议启用',
        className:'possible-errors'
    },{
        label:'最好的实践',
        className:'best-practices'
    },{
        label:'严格模式',
        className:'strict-mode'
    },{
        label:'变量相关',
        className:'variables'
    },{
        label:'Node.js 和 CommonJS',
        className:'node.js-and-commonjs'
    },{
        label:'代码风格相关',
        className:'stylistic-issues'
    },{
        label:'ECMAScript6',
        className:'ecmascript-6'
    }];
    // 把下列这些规则中配置的空格，转化为数字
    var rulesCache;
    rulesServices.getRules('conf/eslint.json').then(function (responese) {
        $rootScope.jsRules = responese.data;
        rulesCache = angular.copy(responese.data);
        angular.forEach($rootScope.jsRules, function (rule) {
        });
    });
    // 全选
    $scope.selectAllHandler = function () {
        var selectAll = $scope.selectAll;
        angular.forEach($rootScope.jsRules, function (rule) {
            rule.enable = selectAll;
        });
    };

    //恢复默认
    $scope.resetToDefault = function () {
        if(rulesCache){
            angular.forEach($rootScope.jsRules, function (rule) {
                rule.enable = false;
            });
        }
    };

    //使用推荐配置
    $scope.selectRecommendedHandler = function () {
        var selectRecommended = $scope.selectRecommended;
        $rootScope.jsRecommended = $scope.selectRecommended;
        if(rulesCache){
            $rootScope.jsRules = angular.copy(rulesCache);
            angular.forEach($rootScope.jsRules, function (rule) {
                rule.enable = !!rule.isRecommended&&selectRecommended;
            });
        }
    };
}]);