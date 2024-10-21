import { readInputFile, log } from '../lib/util.js';

function calculateDestinationValue(sourceValue, map) {
    // log(`${JSON.stringify(map)}`);
    for (const item of map) {
        // log(`${JSON.stringify(item)}`);
        // log(`${sourceValue} >= ${item.sourceRangeStart} && ${sourceValue} < ${item.sourceRangeStart + item.rangeLength}`);
        if (sourceValue >= item.sourceRangeStart && sourceValue < item.sourceRangeStart + item.rangeLength) {
            const destinationValue = (sourceValue - item.sourceRangeStart) + item.destinationRangeStart;
            // log(`${item.sourceRangeStart}: ${sourceValue} -> ${destinationValue}`);
            return destinationValue;
        }
    }

    // log(`${sourceValue}: === `);

    return sourceValue;
}

function processItem(item, type, map) {
    let [currentValue, currentSource, currentDestination] = [item, type, null];

    // log(`Process ${currentSource} ${currentValue}`);

    while (map[currentSource]) {
        currentDestination = Object.keys(map[currentSource])[0];
        // log(`  ${currentSource} -> ${currentDestination}`);
        currentValue = calculateDestinationValue(currentValue, map[currentSource][currentDestination]);
        currentSource = currentDestination;
    }

    // log(`  value: ${currentValue}`);
    return currentValue;
}

function main() {
    const input = readInputFile();
    let min = null;

    const lines = input.split(/\n/);
    let [seedRanges, maps, source, destination, mapPtr] = [[], {}, '', '', null];

    for (const line of lines) {
        const seedMatch = line.match(/^seeds: (.*)/);
        if (seedMatch) {
            const seeds = seedMatch[1].split(/ +/);
            for (let i = 0; i < seeds.length / 2; i++) {
                seedRanges.push([parseInt(seeds[i]), parseInt(seeds[i]) + parseInt(seeds[i+1]) - 1]);
            }
            log(`Seed Ranges (${seedRanges.length}): ${JSON.stringify(seedRanges)}`);
        }

        const mapMatch = line.match(/(.*)-to-(.*) map:/);
        if (mapMatch) {
            [source, destination] = [mapMatch[1], mapMatch[2]];
            maps[source] ||= {};
            maps[source][destination] ||= [];
            mapPtr = maps[source][destination];
            log(`New map: ${source} -> ${destination}`);
        }

        const dataMatch = line.match(/^\s*(\d+)\s+(\d+)\s+(\d+)\s*$/);
        if (dataMatch) {
            mapPtr.push({
                destinationRangeStart: parseInt(dataMatch[1]),
                sourceRangeStart     : parseInt(dataMatch[2]),
                rangeLength          : parseInt(dataMatch[3]),
            });
        }
    }

    for (const seedRange of seedRanges) {
        log(`Seed Range: ${JSON.stringify(seedRange)}`);
        const diff = seedRange[1] - seedRange[0];

        for (let seed = seedRange[0]; seed < seedRange[1]; seed++) {
            if (seed % 1000000 == 0) {
                const progress = (seed - seedRange[0]) / diff * 100;
                log(`${progress.toFixed(2)}% - ${seed}`);
            }
            const location = processItem(seed, 'seed', maps);

            if (min == null) {
                min = location;
            }
            else if (location < min) {
                log(`Found new minimum: ${location}`);
                min = location;
            }
        }
    }

    console.log(min);
}

main();
