/**
 * Created by yangjiyuan on 16/3/2.
 */
var app = angular.module('lintplus',['ui.fugu','ngSanitize']);
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
// 读取文件内容的指令
// <tag read-file="readFileHandler($file)"></tag>
app.directive('readFile', ['$document',function ($document) {
    return {
        restrict:'A',
        scope:{
            readFile:'&'
        },
        link: function (scope,element,attrs) {
            var input = angular.element('<input type="file" style="display: none;">');
            input.on('change', function (evt) {
                readBlob(evt.target.files);
            });
            var body = angular.element($document[0].body);
            body.append(input);
            element.on('click', function () {
                input[0].click();
            });
            function readBlob(files) {

                var file = files[0];
                var start = 0;
                var end = file.size - 1;

                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                        file.content = evt.target.result;
                        var handler = scope.readFile;
                        handler({$file:file});
                        input.val('');// 修改值,这样即使选择同一个文件,也会触发onchange事件
                    }
                };
                var blob = file.slice(start, end + 1);
                reader.readAsBinaryString(blob);
            }
        }
    }
}]);
app.directive('hljs', function () {
    return {
        restrict:'A',
        scope:{
            hljs:'@?'
        },
        link: function (scope,element) {
            var code = scope.hljs || '';
            element[0].innerHTML = hljs.highlightAuto(code).value;
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
// 首字母大写
app.filter('firstUpper', function () {
    return function (item) {
        return item[0].toUpperCase() + item.slice(1);
    };
});
app.controller('appCtrl', ['$scope','$rootScope','rulesServices','$fgModal','$q','$templateRequest','$compile','$timeout',
    function ($scope,$rootScope,rulesServices,$fgModal,$q,$templateRequest,$compile,$timeout) {
    $rootScope.htmlRules = [];
    $rootScope.cssRules = [];
    $rootScope.jsRules = [];
    $rootScope.disableStatus = {};
    // 禁用HTML检测的标记
    $rootScope.disableStatus.disableHTML = false;
    // 禁用CSS检测的标记
    $rootScope.disableStatus.disableCSS = false;
    // 禁用JS检测的标记

    $rootScope.disableStatus.disableJS = false;
    // 启用JS推荐配置的标记
    $rootScope.jsRecommended = false;

    $rootScope.downloadConfigHandler = function (evt) {
        var lintConfig = {},
            tempRules = {},
            htmlConfig = {
                "suffix": ['html']
            },
            cssConfig = {
                "suffix": 'css'
            },
            jsConfig = {
                "suffix": ['js', 'es'],
                "env": {
                    "browser": true
                },
                "globals": {
                    "jQuery": true,
                    "$":true
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
                    } else if(rule.id == 'attr-value-quotes' && rule.selected == 'single'){
                        tempRules[rule.id] = 'single';
                    }
                } else {
                    if (rule.enable) {
                        tempRules[rule.id] = true;
                        if (rule.id == 'id-class-value') {
                            tempRules[rule.id] = rule.selected;
                        }
                    }
                }
            });
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
            });
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
            });
            jsConfig.rules = tempRules;
        }

        // lintConfig生成
        lintConfig = {
            "html": htmlConfig,
            "css": cssConfig,
            "js": jsConfig
        };
        var zip = new JSZip();
        getDocContent(lintConfig).then(function (docContent) {
            zip.file('lintrc.json',JSON.stringify(lintConfig, null, 2));
            zip.file('code-style-doc.html',docContent);
            //var codeWin = window.open();
            //codeWin.document.write(docContent);
            //codeWin.document.close();
            download(zip);
        }, function () {
            zip.file('lint-plus-config/lintrc.json',JSON.stringify(lintConfig, null, 2));
            download(zip);
        });

    };
    /**
     * 下载zip
     * @param zip
     */
    function download(zip){
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, 'lint-plus-config.zip');
            });
    }
    // 根据配置生成规则文档
    function getDocContent(lintConfig){
        return $q(function(resolve, reject) {
            var tempScope = $rootScope.$new();
            tempScope.lintConfig = buildRuleDocs(lintConfig);
            if(!tempScope.lintConfig.length){
                reject();
            }
            $templateRequest('doc/tpl.html').then(function (source) {
                var element = $compile(angular.element(source))(tempScope);
                var html = '<!DOCTYPE html>'+
                    '<html lang="en-us">'+
                    '<head>'+
                    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'+
                    '<title>代码规范文档 - lint-plus</title>'+
                    '</head>'+
                    '<body>';
                $timeout(function () {
                    html += element.html()+'</body></html>';
                    resolve(html);
                });
            }, function () {
                reject();
            });
        });
    }
    function buildRuleDocs(lintConfig){
        var htmlConfig = lintConfig.html,
            cssConfig = lintConfig.css,
            jsConfig = lintConfig.js;
        var rulesDocs = [];
        var config = {};
        var docable;
        if(htmlConfig){
            config = {
                lang:'html',
                rules:{}
            };
            docable = false;
            angular.forEach($rootScope.htmlRules, function (rule) {
                if(rule.enable){
                    docable = true;
                    config.rules[rule.id] = angular.copy(rule);
                }
            });
            if(docable){
                rulesDocs.push(config);
            }
        }
        if(cssConfig){
            config = {
                lang:'css',
                rules:{}
            };
            docable = false;
            angular.forEach($rootScope.cssRules, function (rule) {
                if(rule.enable){
                    docable = true;
                    config.rules[rule.id] = angular.copy(rule);
                }
            });
            if(docable){
                rulesDocs.push(config);
            }
        }
        if(jsConfig){
            config = {
                lang:'javascript',
                rules:{}
            };
            docable = false;
            angular.forEach($rootScope.jsRules, function (rule) {
                if(rule.enable){
                    docable = true;
                    config.rules[rule.id] = angular.copy(rule);
                }
            });
            if(docable){
                rulesDocs.push(config);
            }
        }
        return rulesDocs;
    }
    function hasRecommended(jsConfig){
        if(!jsConfig.extends){
            return false;
        }
        if(angular.isString(jsConfig.extends)){
            return jsConfig.extends === 'eslint:recommended';
        }
        if(angular.isArray(jsConfig.extends)){
            return jsConfig.extends.indexOf('eslint:recommended') !== -1;
        }
    }

    // 解析配置
    function parseConfig(config){
        var htmlConfig = config.html,
            cssConfig = config.css,
            jsConfig = config.js;
        // 解析html规则
        $rootScope.disableStatus.disableHTML = !htmlConfig;
        if(htmlConfig){
            if(isEmptyObject(htmlConfig.rules)){ // 如果配置为 {} ,恢复默认
                angular.forEach($rootScope.htmlRules, function (rule) {
                    rule.enable = !!rule.default;
                    if(!rule.enable && rule.options.length > 0){
                        rule.selected = rule.options[0];
                    }else{
                        rule.selected = rule.default;
                    }
                });
            }else{
                angular.forEach($rootScope.htmlRules, function (rule) {
                    var temp = htmlConfig.rules[rule.id];
                    if(angular.isDefined(temp)){
                        rule.enable = !!temp;
                        rule.selected = temp;
                    }else{
                        rule.enable = !!rule.default;
                        rule.selected = rule.default;
                    }
                });
            }
        }
        // 解析css配置
        $rootScope.disableStatus.disableCSS = !cssConfig;
        if(cssConfig){
            if(isEmptyObject(cssConfig.rules)){ // 如果配置为 {} ,恢复默认
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
            }else{
                angular.forEach($rootScope.cssRules, function (rule) {
                    var temp = cssConfig.rules[rule.id];
                    if(angular.isDefined(temp)){
                        rule.enable = temp.level !== 0;
                    }else{
                        rule.enable = !!rule.default;
                    }
                });
            }
        }
        // 解析js配置
        $rootScope.disableStatus.disableJS = !jsConfig;
        if(jsConfig){
            if(hasRecommended(jsConfig)){
                $rootScope.jsRecommended = true;
                $scope.$broadcast('js:recommended');
            }
            if(isEmptyObject(jsConfig.rules)){ // 如果配置为 {} ,根据extends恢复默认
                if(hasRecommended(jsConfig)){
                    angular.forEach($rootScope.jsRules, function (rule) {
                        if(rule.isRecommended){
                            rule.enable = true;
                        }
                    });
                }else{
                    angular.forEach($rootScope.jsRules, function (rule) {
                        rule.enable = false;
                    });
                }
            }else{
                if(hasRecommended(jsConfig)){
                    angular.forEach($rootScope.jsRules, function (rule) {
                        if(rule.isRecommended){
                            rule.enable = true;
                        }
                    });
                }
                angular.forEach($rootScope.jsRules, function (rule) {
                    var temp = jsConfig.rules[rule.id];
                    if(angular.isDefined(temp)){
                        rule.enable = eslintRuleIsEnable(temp);
                    }
                });
            }
        }
    }
    // 判断一个eslint的配置是否是启用的
    function eslintRuleIsEnable(rule){
        var arr = [1,2,'warn','error'];
        if(angular.isArray(rule) && rule.length > 0){
            return arr.indexOf(rule[0]) !== -1;
        }
        if(angular.isNumber(rule) || angular.isString(rule)){
            return arr.indexOf(rule) !== -1;
        }
        return false;
    }
    // 判断对象是否是{}
    function isEmptyObject(obj){
        var i = 0,key;
        for(key in obj){
            ++i;
        }
        return !i;
    }
    // 读取文件,预览配置内容并进行解析
    $scope.readFileHandler = function (content) {
        var config = {};
        try{
            config = JSON.parse(content);
            $fgModal.open({
                templateUrl:'previewConfig.html',
                controller:['$scope','$fgModalInstance', function ($scope,$fgModalInstance) {
                    $scope.config = config;
                    $scope.ok = function () { // 解析
                        parseConfig(config);
                        $fgModalInstance.close();
                    };
                    $scope.cancel = function () {
                        $fgModalInstance.dismiss('cancel');
                    };
                    $scope.okText = '解析';
                }]
            });
        }catch(e){
            $fgModal.open({
                templateUrl:'error.html',
                size:'sm',
                controller:['$scope','$fgModalInstance', function ($scope,$fgModalInstance) {
                    $scope.ok = function () {
                        $fgModalInstance.close();
                    };
                }]
            });
        }
    };
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
    $scope.$on('js:recommended', function () {
        $scope.selectRecommended = true;
    });

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