"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paint = exports.ifExist = exports.Date = exports.hook = exports.propertys = exports.colors = exports.print = void 0;
const moment_1 = __importDefault(require("moment"));
const colors = {
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
exports.colors = colors;
const propertys = {
    'Bright': '\x1b[1m',
    'Dim': '\x1b[2m',
    'Underscore': '\x1b[4m',
    'Blink': '\x1b[5m',
    'Reverse': '\x1b[7m',
    'Hidden': '\x1b[8m'
};
exports.propertys = propertys;
moment_1.default.locale('fr');
const paint = (string, color = 'reset') => {
    return `${colors[color]}${string}${colors.Reset}`;
};
exports.paint = paint;
const Date = () => propertys.Bright + (0, moment_1.default)().format('LTS'), ifExist = (input) => input ? input : '';
exports.Date = Date;
exports.ifExist = ifExist;
const hook = (input, color) => {
    return input ? `${colors.Reset}[${colors[color]}${input}${colors.Reset}]` : '';
};
exports.hook = hook;
const log = (type, primaryColor, args) => {
    return (prefix, string, inputAsPrimaryColor) => {
        const thingsToChange = string.match(/%s/g);
        if (thingsToChange)
            for (let i = 0; i < thingsToChange.length; i++) {
                string = string.replace(/%s/, paint(args[i], primaryColor));
            }
        console.log(hook(Date(), "Black") +
            hook(ifExist(type), primaryColor) +
            hook(prefix, primaryColor) +
            ` ${inputAsPrimaryColor ? propertys.Bright + colors[primaryColor] : ''}` +
            string +
            colors.Reset);
    };
};
const print = (string, prefix, inputAsPrimaryColor = false) => ({
    log: (...args) => log('LOG', 'Cyan', args)(prefix, string, inputAsPrimaryColor),
    success: (...args) => log('SUCCESS', 'Green', args)(prefix, string, inputAsPrimaryColor),
    info: (...args) => log('INFO', 'Reset', args)(prefix, string, inputAsPrimaryColor),
    warn: (...args) => log('WARN', 'Yellow', args)(prefix, string, inputAsPrimaryColor),
    error: (...args) => log('ERROR', 'Red', args)(prefix, string, inputAsPrimaryColor)
});
exports.print = print;
//# sourceMappingURL=logs.js.map