import * as fs from 'fs';

export function log(str) {
    if (process.env.LOG) {
        console.log(str);
    }
}

export function readInputFile(filename = 'input') {
    const data = fs.readFileSync(filename);
    return data.toString();
}

export function invertHash(h) {
    let r = {};

    for (const k of Object.keys(h)) {
        const v = h[k];
        if (r[v]) {
            r[v].push(k);
        }
        else {
            r[v] = [k];
        }
    }

    return r;
}
