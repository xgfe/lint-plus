var minimist = require('minimist');
var fs = require('fs');
require('colors');

function getOptions(argv){
    var options = minimist(
        argv || [],{
            boolean: [ 'help', 'version'],
            string: ['_', 'config'],
            alias: {
                h: 'help',
                v: 'version',
                c: 'config'
            }
        }
    );

    var commands = fs.readdirSync(__dirname).map(function (file) {
        if(file !== 'index.js'){
            return file.split('.')[0];
        }
    });
    var cmd = options._[0];
    if (cmd && commands.indexOf(cmd) !== -1) {
        cmd = options._.shift();
    }else if (!options.help) {
        cmd = 'check'; //默认指令
    }
    options.command = cmd;
    return options;
}

function parse(){
    var options = getOptions(process.argv.slice(2)),
        cmd = options.command;

    if (options.version) {
        return displayVersion();
    }

    if (options.help) {
        return displayHelp();
    }

    require('./'+cmd).run(options);
}
/**
 * 显示帮助信息
 *
 */
function displayHelp() {
    var str = [
        '',
        '# lint-plus'.cyan,
        '',
        '## Options'.cyan,
        '',
        '   -v,--version         show version info.',
        '   -h,--help            show help info.',
        '   -c,--config          use custom config file.',
        '',
        '## Usage'.cyan,
        '',
        '   linter [target...]'.yellow,
        ''
    ].join('\n');
    console.log(str);
}

/**
 * 显示 package.json 中的版本号
 */
function displayVersion() {
    var pkg = require('../package');
    console.log('%s v%s', pkg.name, pkg.version);
}
exports.getOptions = getOptions;
exports.parse = parse;