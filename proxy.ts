import { default as Proxys } from './ips-data_center.json';
import { HttpsProxyAgent } from 'https-proxy-agent';

var i = 0;
const getProxy = () => {
    const proxy = Proxys[i];
    i++;
    if (i >= Proxys.length) i = 0;
    const splitted = proxy.split(':');
    const infos = {
        host: splitted[0],
        port: splitted[1],
        auth: splitted[2] + ':' + splitted[3],
    }
    return {
        infos,
        agent: new HttpsProxyAgent(infos)
    }
}

export default getProxy;