/**
 * 配置文件可以有三种
 * 1：js文件，以模块的形式导出配置对象
 * 2：json文件
 * 3：其他类型文件，内容必须是json格式，否则无法解析
 *
 * 可以在配置对象的顶层配置extends属性继承其他属性，也可以分别在各个工具中进行配置继承。
 * lint-plus本身自带了多个推荐配置，后续还会不断完善
 */
module.exports = {
    "extends":"default",
    "html":{
        "extends":"htmlhint:recommended",
        "rules":{
            "id-name-unique":false,
            "doctype-first": false,
            "title-tag-require": false,
            "tagname-lowercase": true,
            "tag-pair": true,
            "attr-lowercase": false,
            "spec-char-escape": false
        }
    },
    "css":{
        "ignore":["hehe.js","test/*.js"],
        "extends":"csshint:recommended",
        "rules":{
            "after-colon": {"level": 1},
            "attribute-selector": {"level": 2},
            "before-colon": {"level": 1},
            "color-abbr": {"level": 1},
            "content-double-quotation": {"level": 1},
            "decl-comma": {"level": 1,"followedComma": " "},
            "decl-end-of-semicolon": {"level": 1},
            "disallow-import": {"level": 1},
            "disallow-named-color": {"level": 1},
            "disallow-quotes-in-url": {"level": 1},
            "disallow-use-expression": {"level": 1},
            "vendor-prefixes-sort": {"level": 1}
        }
    },
    "js":{
        "suffix":["js","es","es6"],
        "ignore":["hehe.js","test/*.js"],
        "extends":"eslint:recommended",
        "env":{
            "node": true,
            "mocha":true
        },
        "globals": {
            "angular": true,
            "jQuery":true,
            "define":true,
            "require":true
        },
        "rules": {
            "no-undef":2,
            "no-func-assign":0,
            "no-unexpected-multiline":2,
            "block-scoped-var":2,
            "curly":2,
            "dot-location": [2, "property"],
            "no-alert":[2],
            "no-eval":[2],
            "no-floating-decimal":[2],
            "no-implied-eval":[2],
            "no-lone-blocks":[2],
            "no-loop-func":[2],
            "no-multi-str":[2],
            "no-new-func":[2],
            "no-return-assign":[2],
            "no-self-compare":[2],
            "no-sequences":[2],
            "no-unused-expressions":[2],
            "no-delete-var":[2],
            "no-undefined":[2],
            "no-unused-vars":[2],
            "no-use-before-define":[2,"nofunc"]
        }
    }
};