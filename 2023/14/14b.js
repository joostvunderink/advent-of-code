import { readInputFile, log } from '../lib/util.js';
import { expect } from 'expect';

function processInput(data) {
    const lines = data.split(/\n/);

    let grid = [];

    for (const line of lines) {
        if (line.length > 0) {
            const gridline = line.split('');
            grid.push(gridline);
        }
    }

    return grid;
}

function createCopy(grid) {
    return JSON.parse(JSON.stringify(grid));
    // let newGrid = [];
    // for (let i = 0; i < grid.length; i++) {
    //     let newLine = 
    // }
}

function tiltGrid(grid, xTilt, yTilt) {
    let copy = createCopy(grid);
    let numChanges = 0;

    do {
        numChanges = 0;
        for (let y = 0; y < copy.length; y++) {
            for (let x = 0; x < copy[0].length; x++) {
                const source = copy[x][y];
                if (source != 'O') {
                    continue;
                }

                const xTarget = x + xTilt;
                const yTarget = y + yTilt;
                if (xTarget < 0 || xTarget >= copy[0].length ||
                    yTarget < 0 || yTarget >= copy.length
                ) {
                    continue;
                }

                const target = copy[xTarget][yTarget];
                if (target == '.') {
                    log(`Moving O from (${x}, ${y}) to (${xTarget}, ${yTarget})`);
                    copy[x][y] = '.';
                    copy[xTarget][yTarget] = 'O';
                    numChanges++;
                }
            }
        }
    } while (numChanges > 0);

    return copy;
}

function calculateStress(grid) {
    let stress = 0;
    for (let y = 0; y < grid.length; y++) {
        const stressLevel = grid.length - y;
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] == 'O') {
                log(`(${x}, ${y}): ${stressLevel}`);
                stress += stressLevel;
            }
        }
    }
    return stress;
}

function main() {
    const input = readInputFile();
    const grid = processInput(input);

    const max = 1000000000;
    let rGrid = createCopy(grid);
    const startTime = Date.now();
    for (let i = 0; i < max; i++) {
        rGrid = tiltGrid(rGrid, -1, 0);
        rGrid = tiltGrid(rGrid, 0, -1);
        rGrid = tiltGrid(rGrid, 1, 0);
        rGrid = tiltGrid(rGrid, 0, 1);
        const stress = calculateStress(rGrid);
        console.log(`${i}: ${stress}`);
        if (i > 0 && i % 1000 == 0) {
            process.exit(0);
            const progress = parseInt(i / max * 10000) / 100.0;
            const curTime = Date.now();
            const diff = curTime - startTime;
            const expectedDuration = max / i * diff;
            process.stdout.write(`\r${progress}% ${diff/1000}/${expectedDuration/1000} (${i})`);
        }
    }
    const stress = calculateStress(rGrid);
    console.log(stress);
}

function test() {
    const input = readInputFile('test-input');
    const grid = processInput(input);
    const output = readInputFile('test-output');
    const outputGrid = processInput(output);

    console.log('Testing')
    expect(grid.length).toBe(10);
    expect(grid[0].length).toBe(10);
    expect(grid[0][0]).toBe('O');
    expect(grid[0][1]).toBe('.');
    expect(grid[0][5]).toBe('#');
    expect(grid[1][0]).toBe('O');

    const tiltedGrid = tiltGrid(grid, -1, 0);
    expect(tiltedGrid[0][0]).toBe('O');
    expect(tiltedGrid[1][0]).toBe('O');
    expect(tiltedGrid[2][0]).toBe('O');
    expect(tiltedGrid[3][0]).toBe('O');
    expect(tiltedGrid[4][0]).toBe('.');

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            expect(tiltedGrid[x][y]).toBe(outputGrid[x][y]);
        }
    }

    const stress = calculateStress(tiltedGrid);
    expect(stress).toBe(136);
}

if (process.env.TEST) {
    test();
}
else {
    main();
}

