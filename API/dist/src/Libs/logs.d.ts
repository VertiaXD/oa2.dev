type Colors = 'Black' | 'Red' | 'Green' | 'Yellow' | 'Blue' | 'Magenta' | 'Cyan' | 'White' | 'Reset';
declare const colors: {
    [key in Colors]: string;
};
declare const propertys: {
    Bright: string;
    Dim: string;
    Underscore: string;
    Blink: string;
    Reverse: string;
    Hidden: string;
};
declare const paint: (string: string, color?: string) => string;
declare const Date: () => string, ifExist: (input?: string) => string;
declare const hook: (input: string, color: Colors) => string;
declare const print: (string: string, prefix?: string, inputAsPrimaryColor?: boolean) => {
    log: (...args: any[]) => void;
    success: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
};
export { print, colors, propertys, hook, Date, ifExist, paint };
