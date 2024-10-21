import { readInputFile }  from '../lib/util.js';

function getNumber(line) {
    const digits = line.replace(/[^\d]/g, '');
    console.log(digits + ' <- ' + line);
    const num = digits.length == 1 ?
        digits[0] + digits[0] :
        digits[0] + digits[digits.length - 1];
    console.log(num);

    return parseInt(num, 10);
}

function main() {
    const input = readInputFile();
    console.log(input.length);

    const lines = input.split(/\n/);
    let sum = 0;

    for (const line of lines) {
        if (line.length > 0) {
            sum += getNumber(line);
        }
    }

    console.log(sum);
}

main();
