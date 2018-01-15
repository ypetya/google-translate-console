import fetch, { Headers } from 'node-fetch';
import configure from './configure';

configure((config) => {
    const API_KEY = config('apiKey');

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
            "target": config('lang')
        });

        fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
            {
                method: 'POST',
                body: params
            }).then(resp => {
                //console.log(`${resp.status}: ${resp.statusText}`);
                return resp.json();
            })
            .then(d => {
                const { detectedSourceLanguage, translatedText } = d.data.translations[0];
                console.log(`${detectedSourceLanguage}: ${translatedText}`);
                process.exit(0);
            })
            .catch(err => {
                console.error(err);
            });
    }
});
