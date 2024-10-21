import { readInputFile, log } from '../lib/util.js';
import { Array2D } from '../lib/array2d.js';

const rePart = /\d+/g;
const reSymbol = /[^\d\.]/g;

function parseLine(lineNum, line, parts, symbols) {
    const partMatches = [...line.matchAll(rePart)];

    for (let partMatch of partMatches) {
        const y = partMatch['index'];
        const part = partMatch.toString();
        log(`Part (${lineNum},${y}) = ${part}`);
        parts.set(lineNum, y, part); 
    }

    const symbolMatches = [...line.matchAll(reSymbol)];

    for (let symbolMatch of symbolMatches) {
        const y = symbolMatch['index'];
        const symbol = symbolMatch.toString();
        log(`Symbol (${lineNum},${y}) = ${symbol}`);
        symbols.set(lineNum, y, symbol); 
    }
}

function partTouchesSymbol(parts, symbols, xPart, yPart, xMax, yMax) {
    const part = parts.get(xPart, yPart);
    const length = part.length;

    for (let x = xPart - 1; x <= xPart + 1; x++) {
        for (let y = yPart - 1; y <= yPart + length; y++) {
            if (x < 0 || y < 0 || x > xMax || y > yMax) {
                continue;
            }
            const symbol = symbols.get(x, y);
            if (symbol) {
                log(`--->>> Touch: ${part} (${xPart}, ${yPart}) -> ${symbol} (${x}, ${y}) `);
                return true;
            }
        }
    }

    return false;
}

function getTouchingParts(parts, symbols, xSymbol, ySymbol, xMax, yMax) {
    let touchingParts = [];
    const symbol = symbols.get(xSymbol, ySymbol);

    log(`Checking symbol ${symbol} at (${xSymbol}, ${ySymbol})`);

    for (let x = xSymbol - 1; x <= xSymbol + 1; x++) {
        for (let y = 0; y <= yMax; y++) {
            const part = parts.get(x, y);
            if (part) {
                const length = part.length;
                // part starts at y
                // part ends at y + length
                // y of symbol should be between one before the start and the end, inclusive
                if (ySymbol >= y - 1 && ySymbol <= y + length) {
                    log(`  Touch: ${part} (${x}, ${y})`);
                    touchingParts.push(part);
                }
            }
        }
    }

    return touchingParts;
}

function main() {
    const input = readInputFile();

    const lines = input.split(/\n/);
    let parts = new Array2D();
    let symbols = new Array2D();

    let lineNum = 0;
    let lineLength;
    for (const line of lines) {
        if (line.length > 0) {
            parseLine(lineNum, line, parts, symbols);
            lineLength = line.length;
            lineNum++;
        }
    }

    log(`Dimensions: x = ${lineLength}, y = ${lineNum}`);
    
    let sum = 0;
    for (let x = 0; x < lineNum; x++) {
        for (let y = 0; y < lineLength; y++) {
            const symbol = symbols.get(x, y);
            if (symbol && symbol == '*') {
                const touchingParts = getTouchingParts(parts, symbols, x, y, lineLength, lineNum);
                if (touchingParts.length == 2) {
                    const mult = parseInt(touchingParts[0] * touchingParts[1]);
                    log(`--> + ${mult} (${x}, ${y}): ${touchingParts[0]} * ${touchingParts[1]} = ${mult}`);
                    sum += mult;
                }
            }
        }
    }

    console.log(sum);
}

main();
