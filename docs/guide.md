# Developer Guide
## 在check命令中整合新的工具
如果需要新增代码检查工具（以`foo`为例）的话，按照下列步骤进行：

1. 在`lib`目录下创建目录`foo`并新建文件`checker.js`（建议），用于`foo`check命令的具体实现。

2. 引入必须依赖的模块

	```
	var Checker = require('../checker');   // 所有check工具的父类
	var reporter = require('../reporter'); // 记录并报告错误
	```
3. 创建具体的checker对象

	```
	var checker = new Checker();
	```
4. 实现获取配置的方法:`getConfig`

	```
    checker.getConfig = function (options) {
      // your code here
      return yourConfigObject;
      // 如果存在extends属性进行规则继承的话，不能只返回配置，需要如下操作
      return require('../util').mergeExtends(yourConfigObject);
    };
	```
5. 实现检验的方法:`check`

	```
   /**
     * 对单个文件执行检查的具体实现
     * @param file {object} - 被检查的文件对象
     */
   checker.check = function (file) {
     var contents = file.contents.toString(); 
     var config = this.config;
     /*
       your code here
       获取配置，调用工具相应的API执行校验,如下
      */
     var message = foo.verify(contents,config);
     // 将检验的结果传入reporter，一般检测结果都是数组
     var formatMessages = messages.map(function (message) {
       return {
         type:'foo',  // 检验类型
         severity:message.severity, // 警示级别，1-warn，2-error，3-info
         line:message.line,   // 出现错误的行数
         col:message.column,  // 出现错误的列数
         message:message.message,   // 错误信息
         rule:message.ruleId   // 命中的规则
       };
     });
     return formatMessages; // 返回经过格式化的内容
   };
	```	
6. 导出checker对象

	```
    module.exports = checker;
	```	
此时一个checker对象就已经完成并可以使用了
7. 在`cli/check.js`中引入并使用

	```
    var fooChecker = require('../lib/foo/checker');
    // 命令行的方法实现
    exports.run = function (options) {
      /* code here */
      vfs.src()  // 获取符合条件的文件
        .pipe(fooChecker.exec(options)) // 执行checker的exec方法  
      /* ..... */
    };
	```

## 添加新的命令
添加一个除check以外其他的命令，如`linter bar file.ext`，只需要在`cli`目录下新建文件`bar.js`，并在其中实现方法`run`即可，示例如下：
	
```
/**
 * 命令实现
 * @param options {object} - 命令行传入的配置项
 */
exports.run = function (options) {
  console.log(options);
  /* your code here */
};
```
如果需要以npm包的形式使用该命令，需要实现verify或verifySync方法。