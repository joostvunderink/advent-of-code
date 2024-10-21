import { readInputFile, log, invertHash } from '../lib/util.js';
import { expect } from 'expect';

const cardStrength = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 1,
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

function determineHandTypeFromCardsList(numCardsList) {
    if (numCardsList[0] == 5) {
        return handType.FIVE_OF_A_KIND;
    }
    if (numCardsList[0] == 4) {
        return handType.FOUR_OF_A_KIND;
    }
    if (numCardsList[0] == 3) {
        if (numCardsList[1] == 2) {
            return handType.FULL_HOUSE;
        }
        else {
            return handType.THREE_OF_A_KIND;
        }
    }
    if (numCardsList[0] == 2) {
        if (numCardsList[1] == 2) {
            return handType.TWO_PAIR;
        }
        else {
            return handType.ONE_PAIR;
        }
    }
    return handType.HIGH_CARD;
}


class Hand {
    constructor(cards, betAmount = 0) {
        this.cards = cards;
        this.betAmount = betAmount;
        this.numCardsPerRank = this.determineNumCardsPerRank();
        this.rankPerCards = invertHash(this.numCardsPerRank);
        this.numCardsList = this.determineNumCardsList();
        this.handType = this.determineHandType();

        this.numCardsPerRankWithJokers = this.determineNumCardsPerRankWithJokers();
        this.numCardsListWithJokers = this.determineNumCardsListWithJokers();
        this.handTypeWithJokers = this.determineHandTypeWithJokers();
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

    getBestJokerRank() {
        // Whatever NON-JOKER rank is most present in the hard, the joker is best used as this rank.
        // With the given scoring algorithm, it doesn't matter which of your "most" present cards
        // you choose.

        let rank, num = 0;
        for (const key of Object.keys(this.numCardsPerRank)) {
            if (key == 'J') {
                continue;
            }
            if (this.numCardsPerRank[key] > num) {
                // log(`${key} num cards ${this.numCardsPerRank[key]}`);
                rank = key;
                num = this.numCardsPerRank[key];
            }
        }

        return rank;

        // const numMostCards = this.numCardsList[0];
        // return this.rankPerCards[numMostCards][0];

        // if (numMostCards == 5) {
        //     return this.rankPerCards['5'];
        // }

        // const secondMostCards = this.numCardsList[1];

        // if (numMostCards > secondMostCards) {
        //     // The hand has one rank more than all others.
        //     // The best joker rank is this card.
        //     return this.rankPerCards[numMostCards];
        // }
    }

    determineNumCardsPerRankWithJokers() {
        const cpr = this.determineNumCardsPerRank();
        const numJokers = this.numCardsPerRank['J'];

        if (!numJokers || numJokers == 0 || numJokers == 5) {
            return cpr;
        }

        const rank = this.getBestJokerRank();
        if (rank != 'J') {
            cpr[rank] += numJokers;
            cpr['J'] = 0;
        }

        return cpr;
    }

    determineNumCardsList() {
        return Object.values(this.numCardsPerRank).sort().reverse();
    }

    determineNumCardsListWithJokers() {
        return Object.values(this.numCardsPerRankWithJokers).sort().reverse();
    }

    determineHandType() {
        return determineHandTypeFromCardsList(this.numCardsList);
    }

    determineHandTypeWithJokers() {
        return determineHandTypeFromCardsList(this.numCardsListWithJokers);
    }

    calculateWinnings() {
        this.winnings = this.rank * this.betAmount;
    }
}

// Returns 1 if hand1 is stronger than hand2
// Returns 0 if the hands is equally strong
// Returns -1 if hand1 is weaker than hand2
function compareHands(hand1, hand2, useJokers = false) {
    const hand1Type = useJokers ? hand1.handTypeWithJokers : hand1.handType;
    const hand2Type = useJokers ? hand2.handTypeWithJokers : hand2.handType;
    if (hand1Type > hand2Type) {
        return 1;
    }
    if (hand1Type < hand2Type) {
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

function sortHands(hands, useJokers = false) {
    return hands.sort((a, b) => {
        return compareHands(a, b, useJokers);
    });
}

function determineResultRanks(hands) {
    const sortedHands = sortHands(hands, true);
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
            const hand = new Hand(cards, betAmount, true);
            hands.push(hand);
        }
    }
    const sortedHands = sortHands(hands, true); // with jokers this time
    determineResultRanks(sortedHands);
    calculateWinnings(sortedHands);
    for (const sh of sortedHands) {
        log(`${sh.cards} [${sh.handType}/${sh.handTypeWithJokers}] ${sh.rank} * ${sh.betAmount} = ${sh.winnings}`);
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
    console.log('8924dpboe')
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

    expect(h1.getBestJokerRank()).toBe('3');
    expect(h2.getBestJokerRank()).toBe('5');
    expect(h3.getBestJokerRank()).toBe('7');
    expect(h4.getBestJokerRank()).toBe('T');
    expect(h5.getBestJokerRank()).toBe('Q');

    const sortedHands = sortHands(hands, true);
    // expect(sortedHands[0].cards).toEqual(handsData[0][0]);
    // expect(sortedHands[1].cards).toEqual(handsData[3][0]);
    // expect(sortedHands[2].cards).toEqual(handsData[2][0]);
    // expect(sortedHands[3].cards).toEqual(handsData[1][0]);
    // expect(sortedHands[4].cards).toEqual(handsData[4][0]);

    determineResultRanks(hands);
    expect(h1.rank).toBe(1);
    expect(h2.rank).toBe(3);
    expect(h3.rank).toBe(2);
    expect(h4.rank).toBe(5);
    expect(h5.rank).toBe(4);

    calculateWinnings(hands);
    // expect(h1.winnings).toBe(765 * 1);
    // expect(h2.winnings).toBe(684 * 4);
    // expect(h3.winnings).toBe( 28 * 3);
    // expect(h4.winnings).toBe(220 * 2);
    // expect(h5.winnings).toBe(483 * 5);

    const totalWinnings = calculateTotalWinnings(hands);
    expect(totalWinnings).toBe(5905);

    // expect(h1.getBestJokerRank()).toBe('3');
    // expect(h2.getBestJokerRank()).toBe('5');
    // expect(h3.getBestJokerRank()).toBe('K');
    // expect(h4.getBestJokerRank()).toBe('T');
    // expect(h5.getBestJokerRank()).toBe('Q');

    expect(h1.handTypeWithJokers).toBe(handType.ONE_PAIR);
    expect(h2.handTypeWithJokers).toBe(handType.FOUR_OF_A_KIND);
    expect(h3.handTypeWithJokers).toBe(handType.TWO_PAIR);
    expect(h4.handTypeWithJokers).toBe(handType.FOUR_OF_A_KIND);
    expect(h5.handTypeWithJokers).toBe(handType.FOUR_OF_A_KIND);

    const totalWinningsWithJokers = calculateTotalWinnings(hands);
    expect(totalWinningsWithJokers).toBe(5905);
    console.log('All tests successful');
}

if (process.env.TEST) {
    test();
}
else {
    main();
}

