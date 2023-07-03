import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

import('./join');
import('./list');
import('./stop');

export default cmd;