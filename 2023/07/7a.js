import { readInputFile, log } from '../lib/util.js';
import { expect } from 'expect';

const cardStrength = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
};

const handType = {
    FIVE_OF_A_KIND: 100,
    FOUR_OF_A_KIND: 90,
    FULL_HOUSE: 80,
    THREE_OF_A_KIND: 70,
    TWO_PAIR: 60,
    ONE_PAIR: 50,
    HIGH_CARD: 40,
};

class Hand {
    constructor(cards, betAmount = 0) {
        this.cards = cards;
        this.betAmount = betAmount;
        this.numCardsPerRank = this.determineNumCardsPerRank();
        this.numCardsList = this.determineNumCardsList();
        this.handType = this.determineHandType();
        this.rank = 0;
    }

    determineNumCardsPerRank() {
        let nums = {};
        for (const letter of this.cards) {
            if (nums[letter]) {
                nums[letter]++;
            }
            else {
                nums[letter] = 1;
            }
        }
        return nums;
    }

    determineNumCardsList() {
        return Object.values(this.numCardsPerRank).sort().reverse();
    }

    determineHandType() {
        if (this.numCardsList[0] == 5) {
            return handType.FIVE_OF_A_KIND;
        }
        if (this.numCardsList[0] == 4) {
            return handType.FOUR_OF_A_KIND;
        }
        if (this.numCardsList[0] == 3) {
            if (this.numCardsList[1] == 2) {
                return handType.FULL_HOUSE;
            }
            else {
                return handType.THREE_OF_A_KIND;
            }
        }
        if (this.numCardsList[0] == 2) {
            if (this.numCardsList[1] == 2) {
                return handType.TWO_PAIR;
            }
            else {
                return handType.ONE_PAIR;
            }
        }
        return handType.HIGH_CARD;
    }

    calculateWinnings() {
        this.winnings = this.rank * this.betAmount;
    }
}

// Returns 1 if hand1 is stronger than hand2
// Returns 0 if the hands is equally strong
// Returns -1 if hand1 is weaker than hand2
function compareHands(hand1, hand2) {
    if (hand1.handType > hand2.handType) {
        return 1;
    }
    if (hand1.handType < hand2.handType) {
        return -1;
    }
    for (let i = 0; i < hand1.cards.length; i++) {
        if (cardStrength[hand1.cards[i]] > cardStrength[hand2.cards[i]]) {
            return 1;
        }
        if (cardStrength[hand1.cards[i]] < cardStrength[hand2.cards[i]]) {
            return -1;
        }
    }
    return 0;
}

function sortHands(hands) {
    return hands.sort((a, b) => {
        return compareHands(a, b);
    });
}

function determineRanks(hands) {
    const sortedHands = sortHands(hands);
    for (let i = 0; i < sortedHands.length; i++) {
        sortedHands[i].rank = i + 1;
    }
}

function calculateWinnings(hands) {
    for (const hand of hands) {
        hand.calculateWinnings();
    }
}

function calculateTotalWinnings(hands) {
    let totalWinnings = 0;
    for (const hand of hands) {
        totalWinnings += hand.winnings;
    }

    return totalWinnings;
}

function main() {
    const input = readInputFile();
    let hands = [];

    const lines = input.split(/\n/);

    for (const line of lines) {
        if (line.length > 0) {
            const [cards, betAmount] = line.split(/ +/);
            const hand = new Hand(cards, betAmount);
            hands.push(hand);
        }
    }
    const sortedHands = sortHands(hands);
    determineRanks(sortedHands);
    calculateWinnings(sortedHands);
    for (const sh of sortedHands) {
        log(`${sh.cards} ${sh.rank} * ${sh.betAmount} = ${sh.winnings}`);
    }
    const totalWinnings = calculateTotalWinnings(sortedHands);

    console.log(totalWinnings);
}

function test() {
    const handsData = [
        ['32T3K', 765],
        ['T55J5', 684],
        ['KK677', 28],
        ['KTJJT', 220],
        ['QQQJA', 483],
    ];

    console.log(`Testing ${JSON.stringify(handsData)}`);
    const h1 = new Hand(...handsData[0]);
    const h2 = new Hand(...handsData[1]);
    const h3 = new Hand(...handsData[2]);
    const h4 = new Hand(...handsData[3]);
    const h5 = new Hand(...handsData[4]);
    const hands = [h1, h2, h3, h4, h5];

    expect(h1.numCardsPerRank['3']).toBe(2);
    expect(h1.numCardsPerRank['K']).toBe(1);
    expect(h1.numCardsPerRank['A']).toBe(undefined);
    expect(h1.numCardsList).toHaveLength(4);
    expect(h1.numCardsList).toEqual([2, 1, 1, 1]);

    expect(compareHands(h1, h2)).toBe(-1);
    expect(compareHands(h3, h4)).toBe(1);
    expect(compareHands(h5, h4)).toBe(1);
    expect(compareHands(h5, h2)).toBe(1);
    
    const sortedHands = sortHands(hands);
    expect(sortedHands[0].cards).toEqual(handsData[0][0]);
    expect(sortedHands[1].cards).toEqual(handsData[3][0]);
    expect(sortedHands[2].cards).toEqual(handsData[2][0]);
    expect(sortedHands[3].cards).toEqual(handsData[1][0]);
    expect(sortedHands[4].cards).toEqual(handsData[4][0]);

    determineRanks(hands);
    expect(h1.rank).toBe(1);
    expect(h2.rank).toBe(4);
    expect(h3.rank).toBe(3);
    expect(h4.rank).toBe(2);
    expect(h5.rank).toBe(5);

    calculateWinnings(hands);
    expect(h1.winnings).toBe(765 * 1);
    expect(h2.winnings).toBe(684 * 4);
    expect(h3.winnings).toBe( 28 * 3);
    expect(h4.winnings).toBe(220 * 2);
    expect(h5.winnings).toBe(483 * 5);

    const totalWinnings = calculateTotalWinnings(hands);
    expect(totalWinnings).toBe(6440);
}

if (process.env.TEST) {
    test();
}
else {
    main();
}

