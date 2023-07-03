import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

import('./add')
import('./remove')
import('./list')

export default cmd;