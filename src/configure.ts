import * as readline from 'readline';
import * as fs from 'fs';

const loadConfigFile = (fileName) => {
    try {
        return JSON.parse(fs.readFileSync(fileName).toString());
    } catch {
        return {};
    }
}

const config = (fileName) => {
    let conf = loadConfigFile(fileName);

    return {
        append: (key, value) => {
            conf[key] = value;
        },
        writeConfigFile: () => {
            fs.open(fileName, fs.constants.O_CREAT | fs.constants.O_RDWR, (err, fd) => {
                fs.writeFileSync(fileName,
                    JSON.stringify(conf)
                );
                console.log(`wrote config file ${fileName}`);
            });
        },
        get: (key) => conf[key]
    }
}
const readUserInput = (config) => {

    const io = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    io.on('close', () => console.log('Bye!'));

    const ask = (question: string) => {
        return new Promise((resolve, reject) => {
            io.question(question, (ans) => {
                resolve(ans);
            });
        });
    };
    return { ask, close: io.close };
}

const configure = (ready) => {
    const appConfig = config(`${__dirname}/.google-translate-console.config`);
    const { ask, close } = readUserInput(appConfig);
    let changed = false;

    const quiz = [
        ['apiKey', 'Please enter api key:'],
        ['lang', 'Please enter target language code:']].reduce(
        (acc, current) => new Promise((resolve, reject) => {
            acc.then(() => {
                let [key, question] = current;
                if (!appConfig.get(key)) {
                    ask(question).then((ans) => {
                        appConfig.append(key, ans);
                        changed = true;
                        resolve();
                    });
                } else {
                    resolve(appConfig.get(key));
                }
            })
        }), Promise.resolve());


    quiz.then(() => {
        if (changed) appConfig.writeConfigFile();
        ready(appConfig.get);
    }).catch((err) => console.error(err));
}

export default configure;