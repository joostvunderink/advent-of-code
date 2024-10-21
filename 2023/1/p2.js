import { readInputFile, log } from '../lib/util.js';

const numberMap = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'zero': 0,
}
function getDigitAt(line, index) {
    log(`gta ${line} ${index} ${line[index]}`);
    if (!isNaN(line[index])) {
        return line[index];
    }

    const substring = line.substring(index);
    for (const num of Object.keys(numberMap)) {
        if (substring.startsWith(num)) {
            return numberMap[num];
        }
    }
}

function getFirstDigit(line) {
    for (let i = 0; i < line.length; i++) {
        const digit = getDigitAt(line, i);
        if (digit) {
            return digit;
        }
    }
}

function getLastDigit(line) {
    for (let i = line.length - 1; i >= 0; i--) {
        const digit = getDigitAt(line, i);
        if (digit) {
            return digit;
        }
    }
}

function getNumber(line) {
    const num = parseInt(getFirstDigit(line)) * 10 + parseInt(getLastDigit(line));
    log(num + ' <- ' + line);
    return num;
}


function main() {
    // console.log(getFirstDigit('9klnfhhx'));
    // console.log(getLastDigit('9klnfhhx'));
    const input = readInputFile();
    // console.log(input.length);

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
