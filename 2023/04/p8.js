import { readInputFile, log } from '../lib/util.js';

function parseLine(line) {
    const [cardNumText, numberText] = line.split(/:/);
    const cardNum = parseInt(cardNumText.replace(/[^\d]/g, ''));

    const [winningNumbersText, havingNumbersText] = numberText.split('|');
    const winningNumbers = winningNumbersText.trim().split(/ +/).map(n => parseInt(n));
    const havingNumbers = havingNumbersText.trim().split(/ +/).map(n => parseInt(n));
    const winningNumbersMap = winningNumbers.reduce((wnm,curr)=> (wnm[curr]=true,wnm),{});
    const havingNumbersMap = havingNumbers.reduce((hnm,curr)=> (hnm[curr]=true,hnm),{});
    let cardData = {
        num: cardNum,
        winningNumbers,
        havingNumbers,
        winningNumbersMap,
        havingNumbersMap,
        numCopies: 1,
    };
    return cardData;

}

function getNumWinningNumbers(cardInfo) {
    let numWinningNumbers = 0;

    for (const number of cardInfo.havingNumbers) {
        if (cardInfo.winningNumbersMap[number]) {
            numWinningNumbers++;
        }
    }
    
    return numWinningNumbers;
}

function getCardValue(cardInfo) {
    const numWinningNumbers = getNumWinningNumbers(cardInfo);

    return numWinningNumbers == 0 ? 0 : 2 ** (numWinningNumbers - 1);
}

function main() {
    const input = readInputFile();

    const lines = input.split(/\n/);
    const cards = {};
    for (const line of lines) {
        if (line.length > 0) {
            const cardInfo = parseLine(line);
            // log(`${JSON.stringify(cardInfo)}`);
            cards[cardInfo.num] = cardInfo;
            // process.exit(0);
        }
    }

    const numUniqueCards = Object.keys(cards).length;

    for (let i = 1; i < numUniqueCards + 1; i++) {
        const cardInfo = cards[i];
        const numWinningNumbers = getNumWinningNumbers(cardInfo);
        log(`Card ${i} (${cardInfo.numCopies}): ${numWinningNumbers}`);
        if (numWinningNumbers > 0) {
            for (let j = 1; j <= numWinningNumbers; j++) {
                const index = i + j
                if (index > numUniqueCards) {
                    continue;
                }
                log(`  Card ${index} + ${cardInfo.numCopies}`);
                cards[index].numCopies += cardInfo.numCopies;
            }
        }

    }

    let numCards = 0;
    for (let i = 1; i < numUniqueCards + 1; i++) {
        numCards += cards[i].numCopies;
    }

    console.log(numCards);
}

main();
