import moment from "moment";

type Colors = 'Black' | 'Red' | 'Green' | 'Yellow' | 'Blue' | 'Magenta' | 'Cyan' | 'White' | 'Reset';

const colors: {[key in Colors]: string} = {
    'Black': '\x1b[30m',
    'Red': '\x1b[31m',
    'Green': '\x1b[32m',
    'Yellow': '\x1b[33m',
    'Blue': '\x1b[34m',
    'Magenta': '\x1b[35m',
    'Cyan': '\x1b[36m',
    'White': '\x1b[37m',
    'Reset': '\x1b[0m'
};

const propertys = {
    'Bright': '\x1b[1m',
    'Dim': '\x1b[2m',
    'Underscore': '\x1b[4m',
    'Blink': '\x1b[5m',
    'Reverse': '\x1b[7m',
    'Hidden': '\x1b[8m'
};

moment.locale('fr');

const paint = (string: string, color = 'reset') => {
    return `${colors[color]}${string}${colors.Reset}`;
}

const Date = () => propertys.Bright + moment().format('LTS'),
    ifExist = (input?: string) => input ? input : '';

const hook = (input: string, color: Colors) => {
    return input ? `${colors.Reset}[${colors[color]}${input}${colors.Reset}]` : '';
}

const log = (
    type: 'LOG' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS',
    primaryColor: Colors,
    args: any[],
) => {
    return (prefix: string, string: string, inputAsPrimaryColor: boolean) => {
        const thingsToChange = string.match(/%s/g);

        if (thingsToChange)
            for (let i = 0; i < thingsToChange.length; i++) {
                string = string.replace(/%s/, paint(args[i], primaryColor));
            }

        console.log(
            hook(Date(), "Black") +
            hook(ifExist(type), primaryColor) +
            hook(prefix, primaryColor) +
            ` ${inputAsPrimaryColor ? propertys.Bright + colors[primaryColor] : ''}` +
            string +
            colors.Reset
        );
    }
};

const print = (string: string, prefix?: string, inputAsPrimaryColor: boolean = false) => ({
    log: (...args: any[]) => log('LOG', 'Cyan', args)(prefix, string, inputAsPrimaryColor),
    success: (...args: any[]) => log('SUCCESS', 'Green', args)(prefix, string, inputAsPrimaryColor),
    info: (...args: any[]) => log('INFO', 'Reset', args)(prefix, string, inputAsPrimaryColor),
    warn: (...args: any[]) => log('WARN', 'Yellow', args)(prefix, string, inputAsPrimaryColor),
    error: (...args: any[]) => log('ERROR', 'Red', args)(prefix, string, inputAsPrimaryColor)
});

export { print, colors, propertys, hook, Date, ifExist, paint };
