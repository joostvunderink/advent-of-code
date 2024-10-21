import { readInputFile, log } from '../lib/util.js';


function getMinCubes(line) {
    let minCubes = {
        red: 0,
        blue: 0,
        green: 0,
    };
        
    const [gameInfo, cubeInfo] = line.split(/:/);
    const gameId = parseInt(gameInfo.split(/ /)[1]);

    const allShows = cubeInfo.match(/(\d+ [a-z]+)/g);
    for (const show of allShows) {
        const [num, colour] = show.split(/ /);
        log(`${gameId}: checking ${num} ${colour}`);
        if (parseInt(num) > minCubes[colour]) {
            log(`${gameId}: not possible`);
            minCubes[colour] = parseInt(num);
        }
    }

    return minCubes;
}

function main() {
    // console.log(getFirstDigit('9klnfhhx'));
    // console.log(getLastDigit('9klnfhhx'));
    const input = readInputFile();
    // console.log(input.length);

    const lines = input.split(/\n/);
    let totalPower = 0;

    for (const line of lines) {
        if (line.length > 0) {
            const minCubes = getMinCubes(line);
            const power = minCubes['red'] * minCubes['blue'] * minCubes['green'];
            totalPower += power;
        }
    }

    console.log(totalPower);
}

main();
