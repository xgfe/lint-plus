var _ = require('./util');
var colors = require('colors');
var messages = {};
function report(file,msg) {
    if(!messages[file]){
        messages[file] = [];
    }
    messages[file].push({
        type:msg.type,
        severity:msg.severity,
        line:msg.line,
        col:msg.col,
        message:msg.message,
        rule:msg.rule
    });
}
function getMessages(){
    return messages;
}
function showMessages(doLog) {
    var success = true,
        errorFileCount=0,
        totalFileCount = 0,
        errorCount = 0;
    return _.mapStream(function (file,cb) {
        var msgs = messages[file.path]||[],
            len=msgs.length,
            subpath= _.getSubPath(file.path),
            type;
        totalFileCount ++;
        if(len){
            success = false;
            errorFileCount ++;
            errorCount += len;
            if(!doLog){
                cb(null, file);
                return;
            }
            console.log(
                '\n %s (%s message%s)',
                colors.yellow(subpath),
                len,
                len>1?'s':''
            );
            msgs.forEach(function (message) {
                type = (function () {
                    var temp = message.severity;
                    if(temp === 2){
                        return colors.red("ERROR");
                    }
                    if(temp === 1){
                        return colors.yellow('WARN ');
                    }
                    return colors.green('INFO ');
                })();
                console.log(
                    '     %s line %s, col %s: %s  %s',
                    type,
                    message.line,
                    message.col,
                    message.message,
                    colors.gray(message.rule)
                );
            });
        }
        cb(null, file);
    }, function () {
        if(doLog){
            console.log(
                colors.bold.red('\nLinter found %s problem%s in %s of %s file%s.'),
                errorCount,
                errorCount > 1 ? 's' : '',
                errorFileCount,
                totalFileCount, totalFileCount > 1 ? 's' : ''
            );
            if (success) {
                console.log(colors.green('Congratulations! Everything is OK!'));
            }
        }
        this.emit('done', success,messages,errorCount,errorFileCount,totalFileCount);
    });
}
exports.report =report ;
exports.getMessages = getMessages;
exports.showMessages = showMessages;