var fs = require('fs');
var path = require('path');
var confs = [{
    path:'../htmlhint.json',
    dir:'html'
},{
    path:'../csshint.json',
    dir:'css'
},{
    path:'../eslint.json',
    dir:'js'
}];
buildConfig(confs);
function buildConfig(confs){
    confs.forEach(function (config) {
        var json = require(config.path);
        var files = fs.readdirSync(config.dir);
        files.forEach(function (filepath) {
            filepath = config.dir +'/'+filepath;
            addExample(json,filepath);
        });
        fs.writeFileSync(config.path,JSON.stringify(json,null,2),'utf8');
    });
}
function addExample(rules,filepath){
    var rule,ruleId = path.parse(filepath).name;
    for(var i= 0,len=rules.length;i<len;i++){
        rule = rules[i];
        if(rule.id === ruleId){
            rule.example = fs.readFileSync(filepath,'utf8');
            break;
        }
    }
}