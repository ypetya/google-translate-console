import fetch, { Headers } from 'node-fetch';
import API_KEY from './api.key';

let [nodePath, jsPath, ...args] = process.argv;

if (args.length > 0) {
    translate(args.join(' '));
} else {
    console.log(`Usage: ${nodePath} ${jsPath} <text to translate>`);
}

function translate(text: string) {
    const params = JSON.stringify({
        "format": "text",
        "q": [text],
        "target": "hu"
    });

    fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
        {
            method: 'POST',
            body: params
        }).then(resp => resp.json())
        .then(d => {
            const { detectedSourceLanguage, translatedText } = d.data.translations[0];
            console.log(`${detectedSourceLanguage}: ${translatedText}`);
        })
        .catch(err => {
            console.error(err);
        });
}