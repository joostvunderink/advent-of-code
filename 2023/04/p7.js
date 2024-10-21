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
    };
    return cardData;

}

function getCardValue(cardInfo) {
    let numWinningNumbers = 0;

    for (const number of cardInfo.havingNumbers) {
        if (cardInfo.winningNumbersMap[number]) {
            numWinningNumbers++;
        }
    }

    return numWinningNumbers == 0 ? 0 : 2 ** (numWinningNumbers - 1);
}

function main() {
    const input = readInputFile();
    let sum = 0;

    const lines = input.split(/\n/);
    const cardInfos = [];
    for (const line of lines) {
        if (line.length > 0) {
            const cardInfo = parseLine(line);
            // log(`${JSON.stringify(cardInfo)}`);
            cardInfos.push(cardInfo);
            const value = getCardValue(cardInfo);
            log(`Card ${cardInfo.num}: ${value}`);
            // process.exit(0);
            sum += value;
        }
    }


    console.log(sum);
}

main();
