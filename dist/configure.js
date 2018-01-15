"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var fs = require("fs");
var loadConfigFile = function (fileName) {
    try {
        return JSON.parse(fs.readFileSync(fileName).toString());
    }
    catch (_a) {
        return {};
    }
};
var config = function (fileName) {
    var conf = loadConfigFile(fileName);
    return {
        append: function (key, value) {
            conf[key] = value;
        },
        writeConfigFile: function () {
            fs.open(fileName, fs.constants.O_CREAT | fs.constants.O_RDWR, function (err, fd) {
                fs.writeFileSync(fileName, JSON.stringify(conf));
                console.log("wrote config file " + fileName);
            });
        },
        get: function (key) { return conf[key]; }
    };
};
var readUserInput = function (config) {
    var io = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    io.on('close', function () { return console.log('Bye!'); });
    var ask = function (question) {
        return new Promise(function (resolve, reject) {
            io.question(question, function (ans) {
                resolve(ans);
            });
        });
    };
    return { ask: ask, close: io.close };
};
var configure = function (ready) {
    var appConfig = config(__dirname + "/.google-translate-console.config");
    var _a = readUserInput(appConfig), ask = _a.ask, close = _a.close;
    var changed = false;
    var quiz = [
        ['apiKey', 'Please enter api key:'],
        ['lang', 'Please enter target language code:']
    ].reduce(function (acc, current) { return new Promise(function (resolve, reject) {
        acc.then(function () {
            var key = current[0], question = current[1];
            if (!appConfig.get(key)) {
                ask(question).then(function (ans) {
                    appConfig.append(key, ans);
                    changed = true;
                    resolve();
                });
            }
            else {
                resolve(appConfig.get(key));
            }
        });
    }); }, Promise.resolve());
    quiz.then(function () {
        if (changed)
            appConfig.writeConfigFile();
        ready(appConfig.get);
    }).catch(function (err) { return console.error(err); });
};
exports.default = configure;
//# sourceMappingURL=configure.js.map