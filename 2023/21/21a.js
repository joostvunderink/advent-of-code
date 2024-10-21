import { readInputFile, log } from '../lib/util.js';
import { expect } from 'expect';
import { Grid, Coord, Cell, NORTH, EAST, SOUTH, WEST, ALL_DIRECTIONS } from '../lib/grid.js';

function processInput(data) {
    const lines = data.split(/\n/).filter(l => l && l.length > 0);
    const grid = new Grid();
    grid.loadFromData(lines);

    return grid;
}

function getStartLocation(grid) {
    for (let x = 0; x < grid.getWidth(); x++) {
        for (let y = 0; y < grid.getHeight(); y++) {
            const cell = grid.getXY(x, y);
            if (cell.val == 'S') {
                cell.val = '.';
                return cell.coord;
            }
        }
    }
    throw new Error('Could not find start location!');
}

function getNextPossibleLocations(grid, currentPossibleLocations) {
    // Determine all possible next locations.
    // Update the grid, putting an 'O' on each location.
    for (const cpl of currentPossibleLocations) {
        for (const direction of ALL_DIRECTIONS) {
            try {
                const cell = grid.getNeighbour(cpl, direction);
                if (cell.val != '#') {
                    // This is a possible new location. Set this cell to 'O' temporarily.
                    grid.set(cell.coord, 'O');
                }
            }        
            catch(e) {
                // Out of bounds. Ignore.
                // console.log('ERROR!!' + e.stack);
            }
        }
    }

    // Go through the grid, finding all 'O' cells, and putting them in a list.
    // Also reset 'O' to '.'.
    let nextPossibleLocations = [];
    for (let x = 0; x < grid.getWidth(); x++) {
        for (let y = 0; y < grid.getHeight(); y++) {
            const cell = grid.getXY(x, y);
            if (cell.val == 'O') {
                nextPossibleLocations.push(cell.coord);
                cell.val = '.';
            }
        }
    }
    return nextPossibleLocations;
}

function main() {
    const numSteps = 64;
    const input = readInputFile();
    const grid = processInput(input);
    const startLocation = getStartLocation(grid);
    let currentPossibleLocations = [startLocation];
    for (let i = 0; i < numSteps; i++) {
        currentPossibleLocations = getNextPossibleLocations(grid, currentPossibleLocations);
    
    }
    console.log(currentPossibleLocations.length);
}

function test() {
    const input = readInputFile('test-input');
    const grid = processInput(input);
    expect(grid.getXY(0, 0).val).toBe('.');
    expect(grid.getXY(0, 1).val).toBe('.');
    expect(grid.getXY(1, 0).val).toBe('.');
    expect(grid.getXY(1, 1).val).toBe('#');
    expect(grid.getXY(1, 2).val).toBe('#');
    expect(grid.getXY(1, 3).val).toBe('.');
    expect(grid.getXY(1, 4).val).toBe('#');
    expect(grid.getXY(1, 5).val).toBe('#');
    expect(grid.getXY(5, 5).val).toBe('S');
    expect(grid.get(new Coord(5, 5)).val).toBe('S');

    console.log(grid.toString());
    const startLocation = getStartLocation(grid);
    expect(startLocation.x).toBe(5);
    expect(startLocation.y).toBe(5);
    expect(grid.getXY(5, 5).val).toBe('.');

    let currentPossibleLocations = [startLocation];
    for (let i = 0; i < 6; i++) {
        currentPossibleLocations = getNextPossibleLocations(grid, currentPossibleLocations);
        // console.log(currentPossibleLocations.length);
    
    }
    expect(currentPossibleLocations.length).toBe(16);
    console.log('All tests successful.');
}

if (process.env.TEST) {
    test();
}
else {
    main();
}

