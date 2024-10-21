import { readInputFile, log } from '../lib/util.js';

const availableCubes = {
    red: 12,
    blue: 14,
    green: 13,
};

function getValidGameId(line) {
    const [gameInfo, cubeInfo] = line.split(/:/);
    const gameId = parseInt(gameInfo.split(/ /)[1]);

    const allShows = cubeInfo.match(/(\d+ [a-z]+)/g);
    for (const show of allShows) {
        const [num, colour] = show.split(/ /);
        log(`${gameId}: checking ${num} ${colour}`);
        if (parseInt(num) > availableCubes[colour]) {
            log(`${gameId}: not possible`);
            return;
        }
    }

    log(`${gameId}: yay`);
    return gameId;
}

function main() {
    // console.log(getFirstDigit('9klnfhhx'));
    // console.log(getLastDigit('9klnfhhx'));
    const input = readInputFile();
    // console.log(input.length);

    const lines = input.split(/\n/);
    let gameIds = [];

    for (const line of lines) {
        if (line.length > 0) {
            const gameId = getValidGameId(line);
            if (gameId) {
                gameIds.push(gameId);
            }
        }
    }

    const sum = gameIds.reduce((a, b) => { return a + b; }, 0);
    console.log(sum);
}

main();
