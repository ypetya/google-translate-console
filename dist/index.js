"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var configure_1 = require("./configure");
configure_1.default(function (config) {
    var API_KEY = config('apiKey');
    var _a = process.argv, nodePath = _a[0], jsPath = _a[1], args = _a.slice(2);
    if (args.length > 0) {
        translate(args.join(' '));
    }
    else {
        console.log("Usage: " + nodePath + " " + jsPath + " <text to translate>");
    }
    function translate(text) {
        var params = JSON.stringify({
            "format": "text",
            "q": [text],
            "target": config('lang')
        });
        node_fetch_1.default("https://translation.googleapis.com/language/translate/v2?key=" + API_KEY, {
            method: 'POST',
            body: params
        }).then(function (resp) {
            //console.log(`${resp.status}: ${resp.statusText}`);
            return resp.json();
        })
            .then(function (d) {
            var _a = d.data.translations[0], detectedSourceLanguage = _a.detectedSourceLanguage, translatedText = _a.translatedText;
            console.log(detectedSourceLanguage + ": " + translatedText);
            process.exit(0);
        })
            .catch(function (err) {
            console.error(err);
        });
    }
});
//# sourceMappingURL=index.js.map