import { readInputFile, log } from '../lib/util.js';
import { expect } from 'expect';

function calculateWins(time, recordDistance) {
    // The maximum value is obtained by holding the button for half of the race time,
    // then releasing. This is basically (0.5 * time) ^ 2.
    
    let middle = Math.floor(time / 2);
    if (middle * middle < recordDistance) {
        // Can't beat the furthest distance.
        return 0;
    }

    // If time is even, then there is 1 middle number.
    // If time is odd, there are 2 middle numbers.
    let num = 1;
    if (time % 2 == 1) {
        // Odd, so 2 "middle" numbers.
        num = 2;
    }

    // Now all we need to do is go down one millisecond at a time, until the multiplication
    // is lower than the current record.
    let current = middle;
    while (current > 0) {
        current--;
        if (current * (time - current) > recordDistance) {
            num += 2;
        }
        else {
            return num;
        }
    }

    return num;
}

function main() {
    const input = readInputFile();
    let numWays = [];

    const lines = input.split(/\n/);
    let [time, distance] = [0, 0];

    for (const line of lines) {
        const timeMatch = line.match(/^Time: +(.*)/);
        if (timeMatch) {
            time = parseInt(timeMatch[1].replace(/ /g, ''));
            log(`Time ${time}`);
        }

        const distanceMatch = line.match(/^Distance: +(.*)/);
        if (distanceMatch) {
            distance = parseInt(distanceMatch[1].replace(/ /g, ''));
            log(`Distance ${distance}`);
        }

    }

    const numWins = calculateWins(time, distance);
    console.log(numWins);
}

function test() {
    const tests = [
        [7, 9, 4],
        [15, 40, 8],
        [30, 200, 9],
    ];

    for (const t of tests) {
        console.log(`Testing ${JSON.stringify(t)}`);
        expect(calculateWins(t[0], t[1])).toBe(t[2]);
    }
}

if (process.env.TEST) {
    test();
}
else {
    main();
}

