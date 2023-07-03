import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

import('./status');
import('./activity');

export default cmd;