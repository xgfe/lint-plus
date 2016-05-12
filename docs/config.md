# 配置文件说明
## 格式要求
配置文件支持两种格式  

1. npm模块的形式导出配置，即

	```
	文件名如lint.js等js文件
	module.exports = {
	  html:{}
	  /* your config here */
	};
	```
2. json格式的文件，后缀名不限制，内容必须是json格式的，如

	```
	文件名如lint.json/.lintrc等
	{
	  "html":{}
	  /* your config here */
	}
	```

## 配置内容
目前lint-plus集成了三种检查工具，分别是检查HTML代码的[xg-htmlhint](http://github.com/y8n/xg-htmlhint)，检查css代码的[xg-csshint](http://github.com/xgfe/xg-csshint)以及[Eslint](http://eslint.org)。  
每一个配置文件中可以配置三个属性，分别是`html`，`css`和`js`，代表检查这三种代码的工具配置。不进行配置或将这些属性配置为`false`，表示不启用该工具，如

```
{
  "html":false,
  "css":{
    /* .... */
  }
}
```	
上述配置表示禁用html和js代码检查，启用css检查。  
每一项配置中有多个共同的配置属性，如  

- `suffix`：表示启用检查工具去情况下需要被检查的文件的后缀名，可以是数组或字符串
	
	```
	suffix:"js"
	或
	suffix:["js","es"]
	```	
- `ignore`：需要被检查工具忽略的文件，支持[glob](https://github.com/isaacs/node-glob)语法，可以是数组或字符串

	```
	ignore:"test.js"
	或
	ignore:"*.jsx"
	或
	ignore:["test/**/*.js","foo*.js"]
	```
- `extends`：继承的配置，用法参考Eslint配置中的[extends](http://eslint.org/docs/user-guide/configuring#extending-configuration-files)配置，不但每个检查工具可以进行规则继承，所有的规则也可以继承。

	```
	{
	  extends:"../extend/config",
	  html:{
		extends:["../config-a","config-b"]
		...
	  },
	  css:{
	    extends:["../config-css","config-scss"]
		...
	  },
	  js:{
	    extends:"../config-es5"
		...
	  }
	}
	```
- `rules`：对规则进行配置，配置内容因工具而异  

除此之外，还可以配置额外的属性，如eslint除了上述属性，还可以配置env，global等，可以直接在js下面进行相应配置。

```
{
  js:{
    suffix:"js",
    extends:"eslint:recommended",
    env:{
      node:true
    },
    global:{
      jQuery:true
    },
    rules:{
      ... 
    }
  }
  ...
}
```
- eslint 特殊的配置
	- extends属性
	extends可以配置为字符串，如

	```
	extends:"eslint:recommended"
	```
	也可以是字符串数组，如
	
	```
	extends:["eslint:recommended","path/to/extends.json"]
	```
	- plugins
	新增的插件支持和eslint原生的配置有所不同，支持多种配置方式，如单独的字符串
	
	```
	plugins:"angular"
	```
	或者数组

	```
	plugins:["angular","react"]
	```
	以上两种配置会在`node_modules`目录下查找`eslint-plugin-xxx`的npm包，如果插件并不是以一个npm包的形式存在，可以指定路径，如下
	
	```
	plugins:{
		angular:"path/to/angular-plugin"
	}
	或
	plugins:["react",{
		angular:"path/to/angular-plugin"
	}]
	```
	以下配置中angular插件是**无效**的

	```
	plugins:{
		react:"path/to/react/plugin",
		angular:"path/to/react/plugin"
	}
	```
	注意:使用全局lint-plus不会加载本地的插件,所以建议使用对象(`plugins:{angular:"path/to/plugin"}`)的形式指定插件及其本地路径;使用本地的lint-plus就可以正常使用本地的插件,也就可以使用`plugins:["angular"]`或`plugins:"react"`这样的写法了.
	
	- fix
	设置fix为true，如
	
	```
	fix:true
	```
	可以将ESLint中可修复的错误进行修复，具体参考[ESLint Rules](http://eslint.org/docs/rules/)
	
	
	

## 参考配置
- [Eslint的建议规则](https://github.com/xgfe/lint-plus/blob/master/conf/eslint.json)
- [xg-htmlhint默认配置](https://github.com/y8n/xg-htmlhint/blob/master/.htmlhintrc)
- [xg-csshint默认配置](https://github.com/xgfe/xg-csshint/blob/master/src/config.js)
- [lint-plus示例配置文件](https://github.com/xgfe/lint-plus/blob/master/lint.js)