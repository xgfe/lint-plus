var spawnSync = require('child_process').spawnSync;
var fs = require('fs');
var configFileName = '.linter-temp-cache';
/**
 * 获取全局的参数执行校验
 * @param {string|arrays} globalArgvs - 全局参数，一般是文件路径等，数组或字符串
 * @param {object} config - 所有检验工具的配置，格式参照.xgconfig
 * @param {object} argvs - 特殊参数如html:-c js:--fix 等。解析为{html:'-c',js:'--fix'}
 * @param {object} repoter - 收集错误信息
 * @returns {number} errorCode - 错误码，如果检验出错，返回1，没有错误返回0
 */
function lint(globalArgvs,config,argvs,repoter) {
    config = config || {};
    argvs = argvs || {};
    var errorCode = 0;
    var lint = config.lint || [],lintConfig,result;
    if(lint.indexOf('html') !== -1){
        lintConfig = config.htmlhint;
        result = htmlhint(globalArgvs,lintConfig,argvs.html);
        if(repoter){
            repoter.html = result.message;
        }
        errorCode = errorCode || result.code;
    }
    if(lint.indexOf('js') !== -1){
        lintConfig = config.eslint;
        result = eslint(globalArgvs,lintConfig,argvs.js);
        if(repoter){
            repoter.js = result.message;
        }
        errorCode = errorCode || result.code;
    }
    return errorCode;
}
/**
 * 执行xg-htmlhint校验
 * @param {string|array} globalArgvs - 全局参数，一般是文件路径等，数组或字符串
 * @param {object} config - xg-htmlhint的规则配置
 * @param {string} argvs - xg-htmlhint的执行参数
 * @returns {{}} errorCode - 错误码，如果检验出错，返回1，没有错误返回0
 */
function htmlhint(globalArgvs,config,argvs){
    var htmlhint_bin = __dirname + '/node_modules/.bin/xhtmlhint',
        htmlhint_argvs = [];
    if(!fs.existsSync(htmlhint_bin)){
        throw new Error('htmlhint not found.');
    }
    if(argvs && typeof argvs === 'string'){
        htmlhint_argvs = argvs.split(' ');
    }
    if(globalArgvs){
        htmlhint_argvs = htmlhint_argvs.concat(globalArgvs);
    }
    if(config){
        try{
            fs.writeFileSync(configFileName,JSON.stringify(config),'utf8');
            htmlhint_argvs.unshift('-c',configFileName);
        }catch(e){}
    }
    var result;
    try{
        result = spawnSync(htmlhint_bin,htmlhint_argvs);
    }catch(e){
        console.log(e.stack);
    }finally{
        if(fs.existsSync(configFileName)){
            fs.unlinkSync(configFileName);
        }
    }
    return {
        code:result.status,
        message:result.stdout.toString()
    };
}
/**
 * 执行eslint校验
 * @param {string|array} globalArgvs - 全局参数，一般是文件路径等，数组或字符串
 * @param {object} config - eslint的配置参数
 * @param {string} argvs - eslint的执行参数
 * @returns {{}} errorCode - 错误码，如果检验出错，返回1，没有错误返回0
 */
function eslint(globalArgvs,config,argvs){
    var eslint_bin = __dirname + '/node_modules/.bin/eslint',
        eslint_argvs = [];
    if(!fs.existsSync(eslint_bin)){
        throw new Error('eslint not found.');
    }

    /*
    由于eslint在没有传递参数的情况下默认执行 eslint -h 而不是对当前目录所有js文件进行校验，所以，需要进行判断。
    当有传递的参数，也就是需要检测特定文件或者文件夹的时候，判断文件是否是.js文件或目录，是的话在执行。如果没有传递参数，
    默认执行当前目录下的所有js文件。如果传递了参数，但是没有js文件的话，直接返回结果，不执行。
     */
    if(globalArgvs){
        if(typeof globalArgvs === 'string'){
            if(fs.existsSync(globalArgvs)){
                if((fs.statSync(globalArgvs).isFile() && getFileExt(globalArgvs) === 'js') || fs.statSync(globalArgvs).isDirectory()){
                    eslint_argvs.push(globalArgvs);
                }
            }
        }else if(typeof globalArgvs === 'object'){
            globalArgvs.forEach(function (argv) {
                if(fs.existsSync(argv)){
                    if((fs.statSync(argv).isFile() && getFileExt(argv) === 'js')|| fs.statSync(argv).isDirectory()){
                        eslint_argvs.push(argv);
                    }
                }
            });
        }
    }else{
        eslint_argvs.unshift('./');
    }
    if(eslint_argvs.length === 0){ // 如果传递了文件，但不是js
        return {code:0,message:''}
    }
    if(argvs && typeof argvs === 'string'){
        eslint_argvs = eslint_argvs.concat(argvs.split(' '));
    }
    if(config){
        try{
            fs.writeFileSync(configFileName,JSON.stringify(config),'utf8');
            eslint_argvs.unshift('-c',configFileName);
        }catch(e){}
    }
    var result;
    try{
        result = spawnSync(eslint_bin,eslint_argvs);
    }catch(e){
        console.log(e.stack);
    }finally{
        if(fs.existsSync(configFileName)){
            fs.unlinkSync(configFileName);
        }
    }
    return {
        code:result.status,
        message:result.stdout.toString()
    };
}
exports.lint = lint;
exports.htmlhint = htmlhint;
exports.eslint = eslint;

function getFileExt(filepath){
    return filepath.match(/\.(\w+)$/)?filepath.match(/\.(\w+)$/)[1]:'';
}

//fs.js:797
//return binding.stat(pathModule._makeLong(path));
//^
//Error: ENOENT, no such file or directory 'src'
//at Error (native)
//at Object.fs.statSync (fs.js:797:18)
//at /Users/yangjiyuan/Workspace/lint-plus/index.js:98:105
//at Array.forEach (native)
//at eslint (/Users/yangjiyuan/Workspace/lint-plus/index.js:97:25)
//at Object.lint (/Users/yangjiyuan/Worksp