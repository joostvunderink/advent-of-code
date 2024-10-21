import { readInputFile, log } from '../lib/util.js';
import { expect } from 'expect';

function processInput(data) {
    const lines = data.split(/\n/);

    for (const line of lines) {
        if (line.length > 0) {
            return line.split(/,/);
        }
    }
}

function hashText(text) {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
        const h = hashCharacter(text[i]);
        hash += h;
        hash *= 17;
        hash = hash % 256;
    }

    return hash;
}

function hashCharacter(char) {
    return char.charCodeAt(0);
}

function calculateSum(steps) {
    let sum = 0;
    for (let i = 0; i < steps.length; i++) {
        sum += hashText(steps[i]);
    }
    return sum;
}

function main() {
    const input = readInputFile();
    const steps = processInput(input);
    const sum = calculateSum(steps);
    console.log(sum);
}

function test() {
    expect(hashText('HASH')).toBe(52);
    expect(hashText('rn=1')).toBe(30);
    expect(hashText('cm-')).toBe(253);
    expect(hashText('qp=3')).toBe(97);
    expect(hashText('cm=2')).toBe(47);
    expect(hashText('qp-')).toBe(14);
    expect(hashText('pc=4')).toBe(180);
    expect(hashText('ot=9')).toBe(9);
    expect(hashText('ab=5')).toBe(197);
    expect(hashText('pc-')).toBe(48);
    expect(hashText('pc=6')).toBe(214);
    expect(hashText('ot=7')).toBe(231);

    const input = readInputFile('test-input');
    const steps = processInput(input);
    const sum = calculateSum(steps);
    expect(sum).toBe(1320);
}

if (process.env.TEST) {
    test();
}
else {
    main();
}

